import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button } from "react-native";
import {
  watchWallet,
  fetchTransactions,
  initTopUp,
  verifyTopUp,
} from "../../services/walletApi";
import { chargeCard } from "../../types/paystack-react-native"; // or use your Paystack WebView
import { auth } from '../../firebaseConfig';  // ← import your auth instance

export default function WalletScreen() {
  const uid = auth().currentUser!.uid; // or however you grab it
  const [balance, setBalance] = useState(0);
  const [txs, setTxs] = useState<any[]>([]);

  useEffect(() => {
    const unsubW = watchWallet(uid, setBalance);
    const unsubT = fetchTransactions(uid, setTxs);
    return () => {
      unsubW();
      unsubT();
    };
  }, [uid]);

  async function onTopUp() {
    const amount = 10000; // in cents
    const { accessCode, reference } = await initTopUp(
      amount,
      "user@example.com"
    );
    const res = await chargeCard({ accessCode });
    if (res.reference === reference) {
      await verifyTopUp(reference, amount);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24 }}>
        Balance: R{(balance / 100).toFixed(2)}
      </Text>
      <Button title="Top Up" onPress={onTopUp} />
      <FlatList
        data={txs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text>
            {item.type === "transfer"
              ? `💸 ${item.amount / 100} from ${item.from}`
              : `➕ Top-up ${item.amount / 100}`}
          </Text>
        )}
      />
    </View>
  );
}
