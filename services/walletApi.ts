// services/walletApi.ts
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  Unsubscribe,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../firebaseConfig";

/**
 * Starts a real-time listener on this user’s wallet doc.
 * @param uid      current user's UID
 * @param onUpdate callback with raw balance number (e.g. in cents)
 * @returns        an unsubscribe fn
 */
export function watchWallet(
  uid: string,
  onUpdate: (balance: number) => void
): Unsubscribe {
  const ref = doc(db, "wallets", uid);
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        onUpdate((data.balance as number) || 0);
      } else {
        onUpdate(0);
      }
    },
    (err) => {
      console.warn("wallet listener error:", err);
    }
  );
}

/**
 * Starts a real-time listener on this user’s transactions.
 * @param uid      current user's UID
 * @param onUpdate callback with an array of tx objects
 * @returns        an unsubscribe fn
 */
export function fetchTransactions(
  uid: string,
  onUpdate: (txs: any[]) => void
): Unsubscribe {
  const txCol = collection(db, "transactions");
  const q = query(
    txCol,
    where("participants", "array-contains", uid),
    orderBy("timestamp", "desc")
  );
  return onSnapshot(
    q,
    (snap) => {
      onUpdate(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }))
      );
    },
    (err) => {
      console.warn("transactions listener error:", err);
    }
  );
}

/**
 * Call your initializeTopUp cloud fn.
 * Returns the Paystack accessCode + reference.
 */
export async function initTopUp(
  amount: number,
  email: string
): Promise<{ accessCode: string; reference: string }> {
  const fn = httpsCallable<
    { amount: number; email: string },
    { accessCode: string; reference: string }
  >(functions, "initializeTopUp");
  const res = await fn({ amount, email });
  return res.data;
}

/**
 * Call your verifyTopUp cloud fn.
 * Returns { success: true } when done.
 */
export async function verifyTopUp(
  reference: string,
  amount: number
): Promise<{ success: boolean }> {
  const fn = httpsCallable<
    { reference: string; amount: number },
    { success: boolean }
  >(functions, "verifyTopUp");
  const res = await fn({ reference, amount });
  return res.data;
}

/**
 * (Optional) Peer-to-peer transfer.
 * Returns { transactionId }.
 */
export async function transferFunds(
  toUid: string,
  amount: number
): Promise<{ transactionId: string }> {
  const fn = httpsCallable<
    { toUid: string; amount: number },
    { transactionId: string }
  >(functions, "transferFunds");
  const res = await fn({ toUid, amount });
  return res.data;
}
