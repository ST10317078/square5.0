<<<<<<< HEAD
import * as functions from 'firebase-functions/v1';
import * as admin     from 'firebase-admin';
import axios          from 'axios';

admin.initializeApp();
const db = admin.firestore();

// 1) Auto‑create wallet on user signup
export const createWallet = functions.auth.user()
  .onCreate(async (user) => {
    await db.doc(`wallets/${user.uid}`).set({
=======
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
>>>>>>> 19676a782321ebe9a783a6a59363415e2bad9248
      balance: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return null;
<<<<<<< HEAD
  });

// 2) init TopUp → returns { accessCode, reference }
export const initializeTopUp = functions.https.onCall(async (req) => {
  interface TopUpReq { amount: number; email: string; }
  const { amount, email } = req.data as TopUpReq;
  const uid = req.auth?.uid!;
  if (!uid) throw new functions.https.HttpsError('unauthenticated','');
  const secret = functions.config().paystack.secret_key;
  const resp = await axios.post(
    'https://api.paystack.co/transaction/initialize',
    { amount, email, metadata: { uid } },
    { headers: { Authorization: `Bearer ${secret}` } }
  );
  const { access_code: accessCode, reference } = resp.data.data;
  return { accessCode, reference };
});

// 3) verifyTopUp → credits wallet & logs transaction
export const verifyTopUp = functions.https.onCall(async (req) => {
  interface VerifyReq { reference: string; amount: number }
  const { reference, amount } = req.data as VerifyReq;
  const uid = req.auth?.uid!;
  if (!uid) throw new functions.https.HttpsError('unauthenticated','');
  const secret = functions.config().paystack.secret_key;

  const verify = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    { headers: { Authorization: `Bearer ${secret}` } }
  );
  const { status, amount: paid } = verify.data.data;
  if (status !== 'success' || paid !== amount) {
    throw new functions.https.HttpsError('failed-precondition','');
  }

  const walletRef = db.doc(`wallets/${uid}`);
  const txRef     = db.collection('transactions').doc();
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(walletRef);
    const current = snap.data()?.balance || 0;
    tx.update(walletRef, { balance: current + amount });
    tx.set(txRef, {
      type: 'topup',
      to: uid,
      amount,
      reference,
      status: 'success',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  });
  return { success: true };
});

// 4) transferFunds → peer-to-peer
export const transferFunds = functions.https.onCall(async (req) => {
  interface TransferReq { toUid: string; amount: number }
  const { toUid, amount } = req.data as TransferReq;
  const fromUid = req.auth?.uid!;
  if (!fromUid) throw new functions.https.HttpsError('unauthenticated','');

  const fromRef = db.doc(`wallets/${fromUid}`);
  const toRef   = db.doc(`wallets/${toUid}`);
  const txRef   = db.collection('transactions').doc();

  await db.runTransaction(async (tx) => {
    const [fromSnap, toSnap] = await Promise.all([
      tx.get(fromRef), tx.get(toRef)
    ]);
    const fromBal = fromSnap.data()?.balance || 0;
    if (fromBal < amount) {
      throw new functions.https.HttpsError('failed-precondition','');
    }
    tx.update(fromRef, { balance: fromBal - amount });
    tx.update(toRef,   { balance: (toSnap.data()?.balance || 0) + amount });
    tx.set(txRef, {
      type: 'transfer',
      from: fromUid,
      to: toUid,
      amount,
      status: 'success',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  return { transactionId: txRef.id };
});
=======
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
>>>>>>> 19676a782321ebe9a783a6a59363415e2bad9248
