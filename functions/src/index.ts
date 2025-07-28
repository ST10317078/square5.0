/* function eslint-disable object-curly-spacing, comma-dangle, operator-linebreak */
import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import axios from "axios";

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// 1. Auto-generate wallet on user signup
export const createWallet = functions.auth.user().onCreate(
  async (user: functions.auth.UserRecord): Promise<null> => {
    const walletRef = db.doc(`wallets/${user.uid}`);
    await walletRef.set({
      balance: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return null;
  }
);

// 2. Initialize a top‑up via Paystack
export const initializeTopUp = functions.https.onCall(
  async (
    data: unknown,
    context
  ): Promise<{
    accessCode: string;
    reference: string;
  }> => {
    console.log("initializeTopUp context.auth →", context.auth);
    interface TopUpRequest { amount: number; email: string; }
    const { amount, email } = data as TopUpRequest;
    const uid = context.auth?.uid;
    if (!uid) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated",
      );
    }
    const secretKey = functions.config().paystack.secret_key;

    // Initialize transaction
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      { amount, email, metadata: { uid } },
      { headers: { Authorization: `Bearer ${secretKey}` } }
    );

    const { access_code: accessCode, reference } = response.data.data;
    return { accessCode, reference };
  }
);

// 3. Verify and finalize top‑up
export const verifyTopUp = functions.https.onCall(
  async (data: unknown, context): Promise<{ success: true }> => {
    console.log("verifyTopUp context.auth →", context.auth);
    interface VerifyRequest { reference: string; amount: number; }
    const { reference, amount } = data as VerifyRequest;
    const uid = context.auth?.uid;
    if (!uid) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated",
      );
    }
    const secretKey = functions.config().paystack.secret_key;

    // Verify transaction
    const verifyResp = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${secretKey}` } }
    );

    const { status, amount: paidAmount } = verifyResp.data.data;
    if (status !== "success" || paidAmount !== amount) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Payment not successful or amount mismatch",
      );
    }

    const walletRef = db.doc(`wallets/${uid}`);
    const txRef = db.collection("transactions").doc();

    // Atomically update balance and log transaction
    await db.runTransaction(async (tx) => {
      const walletSnap = await tx.get(walletRef);
      const currentBalance = walletSnap.exists
        ? (walletSnap.data()?.balance as number) || 0
        : 0;
      const newBalance = currentBalance + amount;

      tx.update(walletRef, { balance: newBalance });
      tx.set(txRef, {
        type: "topup",
        to: uid,
        amount,
        reference,
        status: "success",
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    return { success: true };
  }
);

// 4. Peer‑to‑peer transfer
export const transferFunds = functions.https.onCall(
  async (data: unknown, context): Promise<{ transactionId: string }> => {
    console.log("transferFunds context.auth →", context.auth);
    interface TransferRequest { toUid: string; amount: number; }
    const { toUid, amount } = data as TransferRequest;
    const fromUid = context.auth?.uid;
    if (!fromUid) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated",
      );
    }

    const fromRef = db.doc(`wallets/${fromUid}`);
    const toRef = db.doc(`wallets/${toUid}`);
    const txRef = db.collection("transactions").doc();

    await db.runTransaction(async (tx) => {
      const fromSnap = await tx.get(fromRef);
      const toSnap = await tx.get(toRef);

      const fromBalance = fromSnap.exists
        ? (fromSnap.data()?.balance as number) || 0
        : 0;
      if (fromBalance < amount) {
        throw new functions.https.HttpsError(
          "failed-precondition",
          "Insufficient funds",
        );
      }

      tx.update(fromRef, { balance: fromBalance - amount });
      tx.update(toRef, {
        balance:
          ((toSnap.data()?.balance as number) || 0) + amount,
      });
      tx.set(txRef, {
        type: "transfer",
        from: fromUid,
        to: toUid,
        amount,
        status: "success",
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    return { transactionId: txRef.id };
  }
);
