// declarations.d.ts

import type { FirebaseApp } from 'firebase/app';
import type { Persistence } from 'firebase/auth';

declare module 'firebase/auth/react-native' {
  /** RN entrypoint for initializeAuth */
  export function initializeAuth(
    app: FirebaseApp,
    options: { persistence: Persistence }
  ): import('firebase/auth').Auth;

  /** AsyncStorage‑based persistence */
  export function getReactNativePersistence(
    storage: any
  ): Persistence;
}
