import {
  getFirestore,
  doc,
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { getFunctions, httpsCallable, HttpsCallableResult } from "firebase/functions";
import { auth, db } from "../firebaseConfig";
import { Transaction, Wallet } from "../types"; // Import strong types

// Initialize Firebase Functions
const functions = getFunctions();

// --- Type definitions for our Cloud Function interactions ---
interface TransferData {
  recipientId: string;
  amount: number;
}

interface TransferResult {
  success: boolean;
  transactionId: string;
}

/**
 * Calls the 'transferFunds' Firebase Function to securely transfer money between users.
 * @param recipientId The UID of the user who will receive the funds.
 * @param amount The amount of money to transfer.
 * @returns A promise that resolves with the result of the transaction from the backend.
 */
export const transferFunds = (
  recipientId: string,
  amount: number
): Promise<HttpsCallableResult<TransferResult>> => {
  if (!auth.currentUser) {
    throw new Error("User must be logged in to transfer funds.");
  }
  
  // Use the function name from your Firebase backend
  const transfer = httpsCallable<TransferData, TransferResult>(functions, 'transferFunds'); 
  
  return transfer({ recipientId, amount });
};

/**
 * Sets up a real-time listener on the user's wallet document.
 * @param uid The UID of the user whose wallet to watch.
 * @param callback The function to call with the updated wallet data.
 * @returns An unsubscribe function to stop listening for updates.
 */
export function watchWallet(
  uid: string, 
  callback: (wallet: Wallet | null) => void
) {
  const walletRef = doc(db, "wallets", uid);
  
  return onSnapshot(walletRef, (docSnap) => {
    if (docSnap.exists()) {
      // Pass the full, typed wallet object to the callback
      callback({ id: docSnap.id, ...docSnap.data() } as Wallet);
    } else {
      // Wallet doesn't exist yet, return null
      callback(null);
    }
  }, (error) => {
    console.error("Error listening to wallet changes:", error);
  });
}

/**
 * Sets up a real-time listener for a user's transactions (both sent and received).
 * @param uid The UID of the user whose transactions to watch.
 * @param callback The function to call with the updated list of transactions.
 * @returns An unsubscribe function to stop listening for updates.
 */
export function watchTransactions(
  uid: string, 
  callback: (transactions: Transaction[]) => void
) {
  const transactionsRef = collection(db, "transactions");

  // This query finds all transactions where the user is either the sender or receiver
  const q = query(
    transactionsRef,
    where("participants", "array-contains", uid), // Querying the participants array
    orderBy("timestamp", "desc")
  );
  
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const userTransactions = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Transaction)
    );
    callback(userTransactions);
  }, (error) => {
    console.error("Error listening to transaction changes:", error);
    callback([]); // Return an empty array on error
  });
}

// NOTE: The `initTopUp` and `verifyTopUp` functions would be implemented similarly
// to `transferFunds`, calling your specific Firebase Functions for those actions.
