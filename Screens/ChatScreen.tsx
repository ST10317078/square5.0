import React, { useEffect, useState } from "react";
import { 
  View, Text, TouchableOpacity, FlatList, StyleSheet 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { collection, doc, getDocs, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db, auth } from "../firebaseConfig"; // Firebase setup
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";

type NavigationProp = StackNavigationProp<RootStackParamList, "ChatScreen">;

const ChatScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const currentUser = auth.currentUser; // Logged-in user

  const [pinnedChats, setPinnedChats] = useState<string[]>([]);
  const [recentChats, setRecentChats] = useState<{ id: string; name: string; type: "chat" | "community" }[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchChats = async () => {
      try {
        const chatRoomsSnapshot = await getDocs(collection(db, "chats"));
        const communitiesSnapshot = await getDocs(collection(db, "communities"));
    
        const chatRooms: { id: string; name: string; type: "chat" }[] = chatRoomsSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: `Chat with ${doc.id}`,
          type: "chat",
        }));
    
        const communities: { id: string; name: string; type: "community" }[] = communitiesSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name as string, // Ensure name is a string
          type: "community",
        }));
    
        setRecentChats([...chatRooms, ...communities]);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    

    fetchChats();
  }, [currentUser]);

  const handlePinChat = async (chatId: string) => {
    if (!currentUser) return;

    const userDocRef = doc(db, "users", currentUser.uid);
    const isPinned = pinnedChats.includes(chatId);
    try {
      await updateDoc(userDocRef, {
        pinnedChats: isPinned ? arrayRemove(chatId) : arrayUnion(chatId),
      });

      setPinnedChats((prev) => 
        isPinned ? prev.filter(id => id !== chatId) : [...prev, chatId]
      );
    } catch (error) {
      console.error("Error updating pinned chats:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pinned Chats</Text>
      <FlatList
        data={recentChats.filter(chat => pinnedChats.includes(chat.id))}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.chatItem} 
            onPress={() => {
              if (item.type === "chat") {
                navigation.navigate("ChatRoomScreen", { chatId: item.id });  // ✅ Matches RootStackParamList
              } else {
                navigation.navigate("CommunityDetailScreen", {
                  community: { id: item.id, name: item.name },
                });
              }
            }}
                      >
            <Text style={styles.chatText}>{item.name}</Text>
            <TouchableOpacity onPress={() => handlePinChat(item.id)}>
              <Text style={styles.unpinText}>Unpin</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.header}>Recent Chats</Text>
      <FlatList
        data={recentChats.filter(chat => !pinnedChats.includes(chat.id))}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.chatItem} 
            onPress={() => {
              if (item.type === "chat") {
                navigation.navigate("ChatRoomScreen", { chatId: item.id });
              } else {
                navigation.navigate("CommunityDetailScreen", {
                  community: { id: item.id, name: item.name },
                });
              }
            }}
            
                      >
            <Text style={styles.chatText}>{item.name}</Text>
            <TouchableOpacity onPress={() => handlePinChat(item.id)}>
              <Text style={styles.pinText}>Pin</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f5f5f5" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  chatItem: { 
    flexDirection: "row", justifyContent: "space-between", padding: 15, 
    backgroundColor: "#fff", borderRadius: 8, marginBottom: 10, 
    borderWidth: 1, borderColor: "#ddd" 
  },
  chatText: { fontSize: 16, fontWeight: "bold" },
  pinText: { color: "#6200EE", fontWeight: "bold" },
  unpinText: { color: "red", fontWeight: "bold" },
});

export default ChatScreen;
