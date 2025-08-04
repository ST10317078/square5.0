import * as functions from 'firebase-functions/v1';
import * as admin     from 'firebase-admin';
import axios          from 'axios';

admin.initializeApp();
const db = admin.firestore();

// 1) Auto‑create wallet on user signup
export const createWallet = functions.auth.user()
  .onCreate(async (user) => {
    await db.doc(`wallets/${user.uid}`).set({
      balance: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return null;
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
