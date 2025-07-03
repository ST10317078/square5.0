import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { db, auth } from "../firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore";

type GroupChatScreenRouteProp = RouteProp<RootStackParamList, "GroupChatScreen">;
type GroupChatScreenNavigationProp = StackNavigationProp<RootStackParamList, "GroupChatScreen">;

const GroupChatScreen = () => {
  const route = useRoute<GroupChatScreenRouteProp>();
  const { groupId, groupName, communityId } = route.params;

  const [messages, setMessages] = useState<{ id: string; text: string; sender: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const messagesRef = collection(db, "communities", communityId, "groupChats", groupId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as { id: string; text: string; sender: string }[];
      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, [communityId, groupId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !auth.currentUser) return;

    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const username = userDoc.exists() ? userDoc.data()?.username : "Unknown User";

      await addDoc(collection(db, "communities", communityId, "groupChats", groupId, "messages"), {
        text: newMessage,
        sender: username,
        timestamp: new Date(),
      });

      setNewMessage(""); // Clear input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>{groupName}</Text>

        {/* ✅ Scrollable Message List */}
        <ScrollView style={styles.messageScrollView} contentContainerStyle={styles.messageList}>
          {messages.map((item) => (
            <View key={item.id} style={styles.messageContainer}>
              <Text style={styles.sender}>{item.sender}</Text>
              <Text style={styles.message}>{item.text}</Text>
            </View>
          ))}
        </ScrollView>

        {/* ✅ Fixed Input Field (Stays at Bottom) */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

/** 🔹 Styles */
const styles = StyleSheet.create({
  safeArea: {
    paddingTop: 10,
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  messageScrollView: {
    flex: 1, // Allows messages to fill the screen and scroll
  },
  messageList: {
    flexGrow: 1, // Ensures scrolling works properly
    paddingBottom: 20, // Adds space for input field
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  listContainer: {
    flexGrow: 1, // Ensures FlatList takes available space and remains scrollable
    paddingBottom: 60, // Space for input at the bottom
  },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
  },
  sender: {
    fontWeight: "bold",
  },
  message: {
    fontSize: 16,
  },
  inputContainer: {
    position: "absolute", // Fixed at the bottom
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#6200EE",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default GroupChatScreen;
