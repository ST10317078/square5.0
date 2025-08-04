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
}
