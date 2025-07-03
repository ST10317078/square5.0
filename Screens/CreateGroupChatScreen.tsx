import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useNavigation, RouteProp, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { db, auth } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { RootStackParamList } from "../types";
import { useTheme } from './context/ThemeContext';
import createStyles from './context/appStyles';

type CreateGroupChatScreenNavigationProp = StackNavigationProp<RootStackParamList, "CreateGroupChatScreen">;
type CreateGroupChatScreenRouteProp = RouteProp<RootStackParamList, "CreateGroupChatScreen">;

const CreateGroupChatScreen = () => {
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<CreateGroupChatScreenNavigationProp>();
  const route = useRoute<CreateGroupChatScreenRouteProp>();
  const { communityId } = route.params;
  const [user, setUser] = useState(auth.currentUser); // Initialize with current user

  const { colors } = useTheme();
  const styles = createStyles(colors).createGroupChatScreen;
  const globalStyles = createStyles(colors).global;

  // Listen for auth state changes to ensure `user` is always up-to-date
  useEffect(() => {
    console.log("CreateGroupChatScreen: Component Mounted/Auth State Changed Effect Running.");
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      console.log("onAuthStateChanged: currentUser received:", currentUser ? currentUser.uid : "null");
      setUser(currentUser);
    });
    return () => {
      unsubscribe(); // Cleanup subscription on unmount
      console.log("onAuthStateChanged: Subscription Unsubscribed.");
    };
  }, []);

  // Log user state whenever it changes
  useEffect(() => {
    console.log("CreateGroupChatScreen: 'user' state updated to:", user ? user.uid : "null");
  }, [user]);


  const handleCreateGroupChat = async () => {
    console.log("handleCreateGroupChat: Function started.");
    console.log("handleCreateGroupChat: Current 'user' value:", user ? user.uid : "null");

    if (!groupName.trim()) {
      Alert.alert("Input Error", "Please enter a name for the group chat.");
      return;
    }

    // Crucial check: Ensure user is valid before proceeding
    if (!user || !user.uid) {
      console.warn("handleCreateGroupChat: User is NOT logged in or user.uid is missing. Stopping creation.");
      Alert.alert("Authentication Error", "You must be logged in to create a group chat. Please log in and try again.");
      setLoading(false);
      return; // IMPORTANT: Ensure this return stops execution
    }

    console.log("handleCreateGroupChat: User check passed. User UID:", user.uid);
    setLoading(true);

    try {
      // This is the line group: 50 in your latest error.
      const newGroupChatRef = await addDoc(collection(db, "communities", communityId, "groupChats"), {
        name: groupName,
        createdBy: user.uid, // <-- Error reported here (or very close)
        createdAt: serverTimestamp(),
        members: [user.uid],
      });

      console.log("handleCreateGroupChat: Group chat created successfully.");
      Alert.alert("Success", `Group chat "${groupName}" created successfully!`);
      
      navigation.goBack(); 

    } catch (error: any) {
      console.error("handleCreateGroupChat: Error during addDoc or navigation:", error);
      Alert.alert("Error", `Failed to create group chat: ${error.message || "Please try again."}`);
    } finally {
      console.log("handleCreateGroupChat: Finally block executed. Setting loading to false.");
      setLoading(false);
    }
  };

  if (!user && !loading) {
    console.log("CreateGroupChatScreen: Rendering 'Not Logged In' UI.");
    return (
      <View style={globalStyles.centeredContainer}>
        <Text style={styles.errorText}>You must be logged in to create a group chat.</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AuthScreen")}>
          <Text style={styles.loginPromptText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  console.log("CreateGroupChatScreen: Rendering main form UI.");
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Group Chat</Text>
      <TextInput
        style={styles.input}
        placeholder="Group Chat Name"
        placeholderTextColor={colors.textSecondary}
        value={groupName}
        onChangeText={setGroupName}
      />
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateGroupChat}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.buttonText} />
        ) : (
          <Text style={styles.createButtonText}>Create Group</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CreateGroupChatScreen;