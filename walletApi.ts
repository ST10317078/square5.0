// walletApi.ts
import { httpsCallable, HttpsCallableResult } from "firebase/functions";
import { auth, functions } from "./firebaseConfig";

interface VerifyTopUpData {
  reference: string;
  amount: number;
}
interface VerifyTopUpResult {
  success: boolean;
  message?: string;
}

export async function verifyTopUp(
  reference: string,
  amount: number
): Promise<HttpsCallableResult<VerifyTopUpResult>> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User must be logged in to verify a top‑up.");
  }

  // Force a fresh ID‑token
  await user.getIdToken(/* forceRefresh= */ true);

  const fn = httpsCallable<VerifyTopUpData, VerifyTopUpResult>(
    functions,
    "verifyTopUp"
  );
  return fn({ reference, amount });
}
