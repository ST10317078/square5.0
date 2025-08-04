<<<<<<< HEAD
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
=======
// src/Screens/Wallet/WalletScreen.tsx

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { Wallet, Transaction } from '../../types';
import { useTheme } from '../context/ThemeContext';
import createStyles from '../context/appStyles';
import { Ionicons } from '@expo/vector-icons';
import { usePaystack } from 'react-native-paystack-webview';
import { verifyTopUp } from '../../walletApi';

const WalletScreen: React.FC = () => {
  // ─── ALL HOOKS AT THE TOP ─────────────────────────────────────────────────────
  const { colors } = useTheme();
  const styles = createStyles(colors).global;
  const { popup } = usePaystack();

  const [initializing, setInitializing] = useState(true);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [addFundsModalVisible, setAddFundsModalVisible] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState('');
  const [paymentInProgress, setPaymentInProgress] = useState(false);

  const uid = auth.currentUser?.uid!;
  const email = auth.currentUser?.email!;

  const fetchWalletData = useCallback(async () => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const walletRef = doc(db, 'wallets', uid);
    const txRef = collection(db, 'transactions');
    const q = query(
      txRef,
      where('participants', 'array-contains', uid),
      orderBy('timestamp', 'desc')
    );

    const unsubWallet = onSnapshot(walletRef, snap => {
      if (snap.exists()) {
        const data = snap.data();
        const balance = typeof data.balance === 'number' ? data.balance : 0;
        const rawCurrency = data.currency as string;
        const currency: 'ZAR' | 'USD' = rawCurrency === 'USD' ? 'USD' : 'ZAR';
        const updatedAt =
          data.updatedAt instanceof Timestamp ? data.updatedAt : Timestamp.now();

        setWallet({ id: snap.id, balance, currency, updatedAt });
      } else {
        setWallet({
          id: uid,
          balance: 0,
          currency: 'ZAR',
          updatedAt: Timestamp.now(),
        });
      }
      setLoading(false);
    });

    const unsubTx = onSnapshot(q, snap => {
      setTransactions(
        snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Transaction, 'id'>) }))
      );
    });

    return () => {
      unsubWallet();
      unsubTx();
    };
  }, [uid]);

  // ─── AUTH REHYDRATION ─────────────────────────────────────────────────────────
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(() => setInitializing(false));
    return unsub;
  }, []);

  // ─── FETCH DATA AFTER INIT ────────────────────────────────────────────────────
  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  // ─── EVENT HANDLERS ───────────────────────────────────────────────────────────
  const onRefresh = () => {
    setRefreshing(true);
    fetchWalletData().finally(() => setRefreshing(false));
  };

  const handleProceedToPay = () => {
    const amount = parseFloat(amountToAdd);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }

    setPaymentInProgress(true);
    popup.checkout({
      email,
      amount,
      onSuccess: async res => {
        try {
          const reference = res.transaction;
          const idToken = await auth.currentUser!.getIdToken();
          console.log('DEBUG: ID Token =', idToken);
          await verifyTopUp(reference, amount);
          Alert.alert('Success!', 'Payment verified.');
        } catch (err: any) {
          Alert.alert('Verification Failed', err.message);
        } finally {
          setAddFundsModalVisible(false);
          setAmountToAdd('');
          setPaymentInProgress(false);
        }
      },
      onCancel: () => {
        setPaymentInProgress(false);
        Alert.alert('Cancelled', 'Payment cancelled.');
      },
      onError: err => {
        setPaymentInProgress(false);
        Alert.alert('Error', err.message);
      },
    });
  };

  // ─── CONDITIONAL EARLY RENDERS ────────────────────────────────────────────────
  if (initializing) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (loading && !refreshing) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // ─── MAIN RENDER ──────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Add Funds Modal */}
      <Modal
        visible={addFundsModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAddFundsModalVisible(false)}
      >
        <View style={walletStyles.modalContainer}>
          <View style={[walletStyles.modalView, { backgroundColor: colors.cardBackground }]}>
            <Text style={[walletStyles.modalTitle, { color: colors.textPrimary }]}>
              Add Funds
            </Text>
            <TextInput
              style={[walletStyles.modalInput, { borderColor: colors.border, color: colors.text }]}
              placeholder="Amount (R)"
              placeholderTextColor={colors.placeholderText}
              keyboardType="numeric"
              value={amountToAdd}
              onChangeText={setAmountToAdd}
            />
            <TouchableOpacity
              onPress={handleProceedToPay}
              style={[styles.primaryButton, { opacity: paymentInProgress ? 0.7 : 1 }]}
            >
              {paymentInProgress ? (
                <ActivityIndicator color={colors.activeFilterText} />
              ) : (
                <Text style={styles.primaryButtonText}>Pay</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setAddFundsModalVisible(false)}>
              <Text style={walletStyles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Balance Header */}
      <View style={walletStyles.header}>
        <Text style={[walletStyles.balanceLabel, { color: colors.secondaryText }]}>
          Current Balance
        </Text>
        <Text style={[walletStyles.balanceAmount, { color: colors.textPrimary }]}>
          R {wallet?.balance.toFixed(2)}
        </Text>
        <TouchableOpacity
          onPress={() => setAddFundsModalVisible(true)}
          style={[styles.primaryButton, walletStyles.addButton]}
        >
          <Ionicons name="add-circle" size={20} color={colors.activeFilterText} />
          <Text style={styles.primaryButtonText}>Add Funds</Text>
        </TouchableOpacity>
      </View>

      {/* Transaction History */}
      <Text style={[walletStyles.historyHeader, { color: colors.textPrimary }]}>
        Transaction History
      </Text>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const isSent = item.fromId === uid;
          const isDeposit = item.type === 'deposit';
          const color = isDeposit ? colors.success : isSent ? colors.error : colors.success;
          const sign = isDeposit || !isSent ? '+' : '-';
          const icon = isDeposit || !isSent ? 'arrow-down-circle' : 'arrow-up-circle';

          return (
            <View style={walletStyles.transactionItem}>
              <Ionicons name={icon} size={30} color={color} />
              <View style={walletStyles.transactionDetails}>
                <Text style={[walletStyles.transactionType, { color: colors.textPrimary }]}>
                  {item.type}
                </Text>
                <Text style={[walletStyles.transactionDesc, { color: colors.secondaryText }]}>
                  {item.description}
                </Text>
              </View>
              <Text style={[walletStyles.transactionAmount, { color }]}>
                {sign} R {item.amount.toFixed(2)}
              </Text>
            </View>
          );
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: colors.secondaryText }}>
            No transactions yet.
          </Text>
        }
        contentContainerStyle={{ paddingHorizontal: 16 }}
>>>>>>> 19676a782321ebe9a783a6a59363415e2bad9248
      />
    </SafeAreaView>
  );
<<<<<<< HEAD
}
=======
};

const walletStyles = StyleSheet.create({
  header: { alignItems: 'center', padding: 24, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  balanceLabel: { fontSize: 18 },
  balanceAmount: { fontSize: 48, fontWeight: 'bold', marginVertical: 8 },
  addButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 8 },
  historyHeader: { fontSize: 22, fontWeight: 'bold', padding: 16 },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionDetails: { flex: 1, marginLeft: 12 },
  transactionType: { fontSize: 16, fontWeight: 'bold', textTransform: 'capitalize' },
  transactionDesc: { fontSize: 14 },
  transactionAmount: { fontSize: 16, fontWeight: 'bold' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    margin: 20,
    padding: 30,
    borderRadius: 12,
    elevation: 5,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  modalInput: {
    width: '100%',
    fontSize: 20,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    textAlign: 'center',
  },
  cancelText: { color: '#888', marginTop: 12 },
});

export default WalletScreen;
>>>>>>> 19676a782321ebe9a783a6a59363415e2bad9248
