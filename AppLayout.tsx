import React from "react";
import { View, StyleSheet } from "react-native";
import BottomBar from "./Screens/Tabs/BottomTabsNavigator";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {children}
      </View>
      <BottomBar />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: 60,  // Space for BottomBar
  },
});

export default AppLayout;
