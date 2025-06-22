import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RootStackParamList } from "../../types";
import { ThemeColors } from '../context/ThemeContext';

const BottomBar = () => {
  const navigation = useNavigation<BottomTabNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate("CommunityScreen")}>
        <Ionicons name="people-outline" size={24} color="white" />
        <Text style={styles.tabText}>Community</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate("ChatScreen")}>
        <Ionicons name="chatbubble-outline" size={24} color="white" />
        <Text style={styles.tabText}>Chat</Text>
      </TouchableOpacity>

      {/* Spacer to make room for FAB */}
      <View style={styles.fabSpacer} />

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("CreateCommunityScreen")}>
        <Ionicons name="add-outline" size={30} color="white" />
      </TouchableOpacity>

      {/* Spacer to make room for FAB */}
      <View style={styles.fabSpacer} />

      <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate("VouchersScreen")}>
        <Ionicons name="wallet-outline" size={24} color="white" />
        <Text style={styles.tabText}>Wallet</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate("ProfileScreen")}>
        <Ionicons name="person-outline" size={24} color="white" />
        <Text style={styles.tabText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "0px 2px 3px rgb(34, 34, 39)",
    paddingVertical: 12,
    width: "100%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    position: "absolute",
    bottom: 0,
    zIndex: 10,
  },
    fabLabel: {
    marginTop: 4,
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  tabText: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
  },
  fab: {
    position: "absolute",
    bottom: 25,
    alignSelf: "center",
    width: 54,
    height: 54,
    borderRadius: 32,
    backgroundColor: "#6200EE",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6.27,
  },

  fabSpacer: {
    width: 15, // Equal to FAB width to push buttons outward
  },
});

export default BottomBar;
