import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet } from "react-native";
import { fetchVouchers } from "../yoyoApi";

type Voucher = {
  id: string;
  name: string;
  discount: number;
  image: string;
};

const VouchersScreen = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getVouchers = async () => {
      try {
        const data = await fetchVouchers();
        setVouchers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getVouchers();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#9C3FE4" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={vouchers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.voucherCard}>
            <Image source={{ uri: item.image }} style={styles.voucherImage} />
            <Text style={styles.voucherTitle}>{item.name}</Text>
            <Text style={styles.voucherDiscount}>{item.discount}% Off</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#151316", padding: 10 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  voucherCard: { backgroundColor: "#222", padding: 15, marginVertical: 10, borderRadius: 10 },
  voucherImage: { width: "100%", height: 150, borderRadius: 8 },
  voucherTitle: { fontSize: 18, fontWeight: "bold", color: "#fff", marginTop: 10 },
  voucherDiscount: { fontSize: 16, color: "#9C3FE4", marginTop: 5 },
});

export default VouchersScreen;
