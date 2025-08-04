<<<<<<< HEAD
// types/react-native-paystack-webview.d.ts
declare module 'react-native-paystack-webview' {
  import * as React from 'react'
  export function PaystackProvider(props: {
    publicKey: string
    children: React.ReactNode
  }): JSX.Element
  export function usePaystack(): {
    popup: {
      checkout(opts: {
        amount: number
        email: string
        onSuccess?: (res: any) => void
        onCancel?: () => void
      }): Promise<{ reference: string; status: string }>
    }
  }
=======
// types/paystack-react-native.d.ts
declare module 'paystack-react-native' {
  export interface ChargeCardOptions { accessCode: string }
  export interface ChargeCardResult { reference: string; status: string; message?: string }

  const Paystack: {
    initSdk(publicKey: string): void;
    chargeCard(options: ChargeCardOptions): Promise<ChargeCardResult>;
  };
  export default Paystack;
>>>>>>> 19676a782321ebe9a783a6a59363415e2bad9248
}
