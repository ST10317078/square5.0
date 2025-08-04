// types/react-native-config.d.ts

declare module 'react-native-config' {
  interface NativeConfig {
    // list any keys you actually use, e.g.:
    PAYSTACK_PUBLIC_KEY: string
    // add other env vars here...
  }

  const Config: NativeConfig
  export default Config
}
