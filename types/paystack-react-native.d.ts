// types/paystack-react-native.d.ts
declare module 'paystack-react-native' {
  export interface ChargeCardOptions { accessCode: string }
  export interface ChargeCardResult { reference: string; status: string; message?: string }

  const Paystack: {
    initSdk(publicKey: string): void;
    chargeCard(options: ChargeCardOptions): Promise<ChargeCardResult>;
  };
  export default Paystack;
}
