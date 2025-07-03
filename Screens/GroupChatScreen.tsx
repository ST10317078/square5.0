import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { RootStackParamList, Message } from "../types"; // Assuming Message interface is in types.ts
import { useTheme } from './context/ThemeContext';
import createStyles, { SPACING } from './context/appStyles'; // Import SPACING

type GroupChatScreenNavigationProp = StackNavigationProp<RootStackParamList, "GroupChatScreen">;
type GroupChatScreenRouteProp = RouteProp<RootStackParamList, "GroupChatScreen">;

const GroupChatScreen = () => {
  const route = useRoute<GroupChatScreenRouteProp>();
  const { groupId, groupName, communityId } = route.params;
  const navigation = useNavigation<GroupChatScreenNavigationProp>();
  const user = auth.currentUser;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isGroupMember, setIsGroupMember] = useState(false);
  const [groupMembers, setGroupMembers] = useState<string[]>([]); // To store UIDs of group members
  const [senderDisplayName, setSenderDisplayName] = useState("Anonymous"); // To store current user's display name

  const { colors } = useTheme();
  const styles = createStyles(colors).groupChatScreen; // New styles for this screen
  const globalStyles = createStyles(colors).global;

  const flatListRef = useRef<FlatList<Message>>(null); // Ref for auto-scrolling

  // Set header title dynamically
  useEffect(() => {
    navigation.setOptions({ title: groupName });
  }, [groupName, navigation]);

  // Fetch group details and messages
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const groupDocRef = doc(db, "communities", communityId, "groupChats", groupId);
    const messagesCollectionRef = collection(groupDocRef, "messages");

    // Fetch user's display name once
    const fetchSenderDisplayName = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists() && userSnap.data().displayName) {
          setSenderDisplayName(userSnap.data().displayName);
        } else if (user.displayName) {
          setSenderDisplayName(user.displayName);
        }
      } catch (error) {
        console.error("Error fetching sender display name:", error);
      }
    };
    fetchSenderDisplayName();

    // Listen for group membership changes
    const unsubscribeGroup = onSnapshot(groupDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const members = data.members || [];
        setGroupMembers(members); // Update group members state
        setIsGroupMember(members.includes(user.uid));
        console.log("Group members updated:", members);
        console.log("Is current user a group member:", members.includes(user.uid));
      } else {
        console.log("Group chat does not exist.");
        Alert.alert("Error", "Group chat not found.");
        navigation.goBack();
      }
      setLoading(false);
    }, (error) => {
      console.error("Error listening to group document:", error);
      Alert.alert("Error", "Failed to load group details.");
      setLoading(false);
    });

    // Listen for messages in real-time
    // NOTE: orderBy is used here. If you encounter Firestore index errors,
    // you might need to create an index in your Firebase console for 'createdAt'
    const messagesQuery = query(messagesCollectionRef, orderBy("createdAt", "asc"));
    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      const fetchedMessages: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(), // Convert Firestore Timestamp to Date object
      })) as Message[];
      setMessages(fetchedMessages);
      // Scroll to bottom when new messages arrive
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, (error) => {
      console.error("Error listening to messages:", error);
      Alert.alert("Error", "Failed to load messages.");
    });

    // Cleanup function
    return () => {
      unsubscribeGroup();
      unsubscribeMessages();
    };
  }, [user, groupId, communityId, navigation]); // Dependencies

  const handleJoinGroup = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to join this group.");
      return;
    }
    setLoading(true);
    try {
      const groupDocRef = doc(db, "communities", communityId, "groupChats", groupId);
      await updateDoc(groupDocRef, {
        members: arrayUnion(user.uid),
      });
      setIsGroupMember(true); // Optimistically update UI
      Alert.alert("Success", `You have joined "${groupName}"!`);
    } catch (error) {
      console.error("Error joining group:", error);
      Alert.alert("Error", "Failed to join group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      Alert.alert("Input Error", "Message cannot be empty.");
      return;
    }
    if (!user || !user.uid) {
      Alert.alert("Authentication Error", "You must be logged in to send messages.");
      return;
    }
    if (!isGroupMember) {
      Alert.alert("Permission Denied", "You must join this group to send messages.");
      return;
    }

    try {
      const groupDocRef = doc(db, "communities", communityId, "groupChats", groupId);
      const messagesCollectionRef = collection(groupDocRef, "messages");

      await addDoc(messagesCollectionRef, {
        text: newMessage,
        senderId: user.uid,
        senderName: senderDisplayName, // Use the fetched display name
        createdAt: serverTimestamp(),
      });
      setNewMessage(""); // Clear input field
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message. Please try again.");
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage = item.senderId === user?.uid;
    const messageTime = item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    return (
      <View style={[styles.messageBubble, isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble]}>
        <Text style={styles.senderName}>{isMyMessage ? "You" : item.senderName || "Unknown"}</Text>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageTime}>{messageTime}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={globalStyles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading group chat...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={globalStyles.centeredContainer}>
        <Text style={styles.errorText}>You must be logged in to view this group chat.</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AuthScreen")}>
          <Text style={styles.loginPromptText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} // Adjust this offset as needed for your header/tab bar
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesListContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {!isGroupMember && (
        <View style={styles.joinGroupContainer}>
          <Text style={styles.joinGroupText}>Join this group to send messages!</Text>
          <TouchableOpacity style={styles.joinButton} onPress={handleJoinGroup}>
            <Text style={styles.joinButtonText}>Join Group</Text>
          </TouchableOpacity>
        </View>
      )}

      {isGroupMember && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type your message..."
            placeholderTextColor={colors.textSecondary}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default GroupChatScreen;
