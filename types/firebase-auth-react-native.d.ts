// types/firebase-auth-react-native.d.ts

import type { FirebaseApp } from 'firebase/app';
import type { Persistence } from 'firebase/auth';

/**
 * Tell TS that when we import from "firebase/auth/react-native",
 * we really mean the RN entrypoint in @firebase/auth.
 */
declare module 'firebase/auth/react-native' {
  /** Initialize Auth for RN with AsyncStorage persistence */
  export function initializeAuth(
    app: FirebaseApp,
    options: { persistence: Persistence }
  ): import('firebase/auth').Auth;

  /** The AsyncStorage‑based persistence implementation */
  export function getReactNativePersistence(
    storage: any
  ): Persistence;
}
