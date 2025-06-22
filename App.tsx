import React from "react";
import { NavigationContainer, useNavigationState } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider, useAuth } from "./AuthContext";
import AuthScreen from "./Screens/AuthScreen";
import CommunityScreen from "./Screens/CommunityScreen";
import CommunityDetailScreen from "./Screens/CommunityDetailScreen";
import CreateCommunityScreen from "./Screens/CreateCommunityScreen";
import GroupChatScreen from "./Screens/GroupChatScreen";
import VouchersScreen from "./Screens/VouchersScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import ChatScreen from "./Screens/ChatScreen";
import BottomBar from "./Screens/Tabs/BottomTabsNavigator";
import UserProfileScreen from "./Screens/userProfileScreen";
import EditCommunityScreen from "./Screens/EditCommunityScreen";

import  {ThemeProvider} from './Screens/context/ThemeContext'; // Adjust path to your ThemeContext

const Stack = createStackNavigator();

const MainNavigator = () => {
  const { user } = useAuth();

  return (
        <ThemeProvider>

    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="CommunityScreen" component={CommunityScreen} />
            <Stack.Screen name="CommunityDetailScreen" component={CommunityDetailScreen} />
            <Stack.Screen name="CreateCommunityScreen" component={CreateCommunityScreen} />
            <Stack.Screen name="GroupChatScreen" component={GroupChatScreen} />
            <Stack.Screen name="VouchersScreen" component={VouchersScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
            <Stack.Screen name="EditCommunityScreen" component={EditCommunityScreen} />

          </>
        ) : (
          <Stack.Screen name="AuthScreen" component={AuthScreen} />
        )}
      </Stack.Navigator>

      {/* ✅ Show Bottom Bar only if user is logged in & NOT on GroupChatScreen */}
      {user && <BottomBarWrapper />}
    </NavigationContainer>
        </ThemeProvider>

  );
};

// Extract the BottomBar logic to a separate component
const BottomBarWrapper = () => {
  const currentScreen = useNavigationState((state) => state?.routes[state.index]?.name);

  if (currentScreen === "GroupChatScreen") return null; // Hide on GroupChatScreen
  return <BottomBar />;
};

const App = () => {
  return (
    <AuthProvider>
      <MainNavigator />
    </AuthProvider>
  );
};

export default App;
