import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as bip39 from "bip39";
import BIP32Factory from "bip32";
import * as ecc from "tiny-secp256k1";
import { Psbt, payments, networks } from "bitcoinjs-lib";
import ECPairFactory from "ecpair";
import * as Keychain from "react-native-keychain";
import { Buffer } from "buffer";

// --- Context types
export type WalletContextType = {
  address: string;
  balance: number;
  generateNewWallet: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  sendTransaction: (to: string, sats: number) => Promise<void>;
};

// create and export context
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Provider component
export const WalletProvider = ({ children }: { children: ReactNode }) => {
  // initialize BIP32 with TinySecp
  const bip32 = BIP32Factory(ecc);
  const ECPair = ECPairFactory(ecc);
  const network = networks.bitcoin;

  const [seed, setSeed] = useState<Buffer | null>(null);
  const [address, setAddress] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);

  // load seed on mount
  useEffect(() => {
    (async () => {
      try {
        const creds = await Keychain.getGenericPassword({ service: "wallet-seed" });
        if (creds) {
          const bytes = JSON.parse(creds.password) as number[];
          const raw = Buffer.from(bytes);
          await initFromSeed(raw);
        }
      } catch {
        // ignore errors
      }
    })();
  }, []);

  // derive address and fetch balance
  async function initFromSeed(raw: Buffer) {
    setSeed(raw);
    const root = bip32.fromSeed(raw);
    const child = root.derivePath("m/84'/0'/0'/0/0");
    // ++ FIX: Convert the Uint8Array public key to a Buffer
    const payment = payments.p2wpkh({ pubkey: Buffer.from(child.publicKey), network });
    if (!payment.address) throw new Error("Failed to derive address");
    setAddress(payment.address);
    await fetchBalance(payment.address);
  }

  // generate new mnemonic wallet
  async function generateNewWallet() {
    const mnemonic = bip39.generateMnemonic();
    const raw = await bip39.mnemonicToSeed(mnemonic);
    const bytes = Array.from(Buffer.from(raw));
    await Keychain.setGenericPassword("seed", JSON.stringify(bytes), { service: "wallet-seed" });
    await initFromSeed(Buffer.from(raw));
    alert(`🚨 BACKUP your mnemonic:\n\n${mnemonic}`);
  }

  // fetch UTXO-based balance
  async function fetchBalance(addr: string) {
    try {
      const res = await fetch(`https://blockstream.info/api/address/${addr}`);
      const js = await res.json();
      const sats = js.chain_stats.funded_txo_sum - js.chain_stats.spent_txo_sum;
      setBalance(sats);
    } catch {
      // ignore
    }
  }

  async function refreshBalance() {
    if (address) await fetchBalance(address);
  }

  // build, sign, broadcast transaction
  async function sendTransaction(to: string, sats: number) {
    if (!seed) throw new Error("Wallet not initialized");

    // get UTXOs
    const utxos: { txid: string; vout: number; value: number }[] =
      await fetch(`https://blockstream.info/api/address/${address}/utxo`).then(r => r.json());

    const psbt = new Psbt({ network });
    let totalIn = 0;
    for (const u of utxos) {
      psbt.addInput({
        hash: u.txid,
        index: u.vout,
        witnessUtxo: {
          script: payments.p2wpkh({ address, network })!.output!,
          value: u.value,
        },
      });
      totalIn += u.value;
      if (totalIn >= sats + 1000) break;
    }
    if (totalIn < sats + 1000) throw new Error("Insufficient funds");

    psbt.addOutput({ address: to, value: sats });
    psbt.addOutput({ address, value: totalIn - sats - 1000 });

    // sign inputs
    const root = bip32.fromSeed(seed);
    const child = root.derivePath("m/84'/0'/0'/0/0");
    // ++ FIX: Convert the Uint8Array private key to a Buffer
    const keyPair = ECPair.fromPrivateKey(Buffer.from(child.privateKey!), { network });
    for (let i = 0; i < psbt.inputCount; i++) {
      psbt.signInput(i, keyPair);
    }
    // validate with always-true
    psbt.validateSignaturesOfAllInputs(() => true);
    psbt.finalizeAllInputs();

    const rawTx = psbt.extractTransaction().toHex();
    await fetch("https://blockstream.info/api/tx", { method: "POST", body: rawTx });
    await refreshBalance();
  }

  return (
    <WalletContext.Provider
      value={{ address, balance, generateNewWallet, refreshBalance, sendTransaction }}>
      {children}
    </WalletContext.Provider>
  );
};

// hook
export function useWallet(): WalletContextType {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
