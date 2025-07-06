import React from "react";
import { NavigationContainer } from "@react-navigation/native";
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
import UserProfileScreen from "./Screens/userProfileScreen";
import EditCommunityScreen from "./Screens/EditCommunityScreen";
import ChatRoomScreen from "./Screens/ChatRoomScreen";
import CreateGroupChatScreen from "./Screens/CreateGroupChatScreen";
import GroupDetailsScreen from "./Screens/GroupDetailsScreen";

import { ThemeProvider } from './Screens/context/ThemeContext';
import AppLayout from "./AppLayout";  

const Stack = createStackNavigator();

const MainNavigator = () => {
  const { user } = useAuth();

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <>
              <Stack.Screen name="CommunityScreen">
                {() => (
                  <AppLayout>
                    <CommunityScreen />
                  </AppLayout>
                )}
              </Stack.Screen>

              <Stack.Screen name="CommunityDetailScreen">
                {() => (
                  <AppLayout>
                    <CommunityDetailScreen />
                  </AppLayout>
                )}
              </Stack.Screen>

              <Stack.Screen name="CreateCommunityScreen">
                {() => (
                  <AppLayout>
                    <CreateCommunityScreen />
                  </AppLayout>
                )}
              </Stack.Screen>

              <Stack.Screen name="GroupChatScreen">
                {() => (
                  <AppLayout>
                    <GroupChatScreen />
                  </AppLayout>
                )}
              </Stack.Screen>

              <Stack.Screen name="VouchersScreen">
                {() => (
                  <AppLayout>
                    <VouchersScreen />
                  </AppLayout>
                )}
              </Stack.Screen>

              <Stack.Screen name="ProfileScreen">
                {() => (
                  <AppLayout>
                    <ProfileScreen />
                  </AppLayout>
                )}
              </Stack.Screen>

              <Stack.Screen name="ChatScreen">
                {() => (
                  <AppLayout>
                    <ChatScreen />
                  </AppLayout>
                )}
              </Stack.Screen>

              <Stack.Screen name="UserProfileScreen">
                {() => (
                  <AppLayout>
                    <UserProfileScreen />
                  </AppLayout>
                )}
              </Stack.Screen>

              <Stack.Screen name="EditCommunityScreen">
                {() => (
                  <AppLayout>
                    <EditCommunityScreen />
                  </AppLayout>
                )}
              </Stack.Screen>

              <Stack.Screen name="ChatRoomScreen">
                {() => (
                  <AppLayout>
                    <ChatRoomScreen />
                  </AppLayout>
                )}
              </Stack.Screen>

              <Stack.Screen name="CreateGroupChatScreen">
                {() => (
                  <AppLayout>
                    <CreateGroupChatScreen />
                  </AppLayout>
                )}
              </Stack.Screen>

              <Stack.Screen name="GroupDetailsScreen">
                {() => (
                  <AppLayout>
                    <GroupDetailsScreen />
                  </AppLayout>
                )}
              </Stack.Screen>
            </>
          ) : (
            <Stack.Screen name="AuthScreen" component={AuthScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <MainNavigator />
    </AuthProvider>
  );
};

export default App;
