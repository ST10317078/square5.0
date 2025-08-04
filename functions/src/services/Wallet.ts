import functions from '@react-native-firebase/functions';
import firestore from '@react-native-firebase/firestore';

export async function initTopUp(amount: number, email: string) {
  const { accessCode, reference } = await functions()
    .httpsCallable('initializeTopUp')({ amount, email });
  return { accessCode, reference };
}

export async function verifyTopUp(reference: string, amount: number) {
  return functions().httpsCallable('verifyTopUp')({ reference, amount });
}

export async function transferFunds(toUid: string, amount: number) {
  const res = await functions()
    .httpsCallable('transferFunds')({ toUid, amount });
  return res.transactionId as string;
}

export function watchWallet(uid: string, cb: (bal: number) => void) {
  return firestore()
    .doc(`wallets/${uid}`)
    .onSnapshot(snap => cb(snap.data()?.balance ?? 0));
}

export function fetchTransactions(uid: string, cb: (txs: any[]) => void) {
  return firestore()
    .collection('transactions')
    .where('to','==',uid)
    .orderBy('timestamp','desc')
    .onSnapshot(s => cb(s.docs.map(d => d.data())));
}
