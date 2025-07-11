import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const vouchers = [
  { id: '1', title: '10% Off at Joe\'s Pizza', description: 'Valid until 30 Sept 2025' },
  { id: '2', title: 'Free Coffee with Breakfast', description: 'Valid at Cafe Aroma' },
  { id: '3', title: 'R50 Off Taxi Ride', description: 'For first-time riders only' },
];

const WalletScreen  = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Vouchers</Text>
      <FlatList
        data={vouchers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.voucherCard}>
            <Text style={styles.voucherTitle}>{item.title}</Text>
            <Text style={styles.voucherDescription}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default WalletScreen ;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  voucherCard: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  voucherTitle: { fontSize: 18, fontWeight: 'bold' },
  voucherDescription: { fontSize: 14, color: '#666' },
});
