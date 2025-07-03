// src/Screens/ChatScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, Community } from "../types";

type NavigationProp = StackNavigationProp<RootStackParamList, "ChatScreen">;

// One‐to‐one chat item
type ChatRoomItem = {
  id: string;
  name: string;
  type: "chat";
};
// Community item (must include all Community fields)
type CommunityItem = Community & {
  type: "community";
};
// Union of both
type RecentChatItem = ChatRoomItem | CommunityItem;

const ChatScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const currentUser = auth.currentUser;
  const [pinnedChats, setPinnedChats] = useState<string[]>([]);
  const [recentChats, setRecentChats] = useState<RecentChatItem[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchChats = async () => {
      try {
        // 1) one-to-one chats
        const chatSnap = await getDocs(collection(db, "chats"));
        const chatRooms: ChatRoomItem[] = chatSnap.docs.map((d) => ({
          id: d.id,
          name: `Chat with ${d.id}`,
          type: "chat",
        }));

        // 2) communities (full data)
        const commSnap = await getDocs(collection(db, "communities"));
        const communities: CommunityItem[] = commSnap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name as string,
            description: data.description as string,
            logo: data.logo as string | undefined,
            createdBy: data.createdBy as string,
            createdAt: data.createdAt as any,
            type: "community",
          };
        });

        setRecentChats([...chatRooms, ...communities]);
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };

    fetchChats();
  }, [currentUser]);

  const handlePinChat = async (chatId: string) => {
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser.uid);
    const isPinned = pinnedChats.includes(chatId);

    try {
      await updateDoc(userRef, {
        pinnedChats: isPinned
          ? arrayRemove(chatId)
          : arrayUnion(chatId),
      });
      setPinnedChats((prev) =>
        isPinned ? prev.filter((id) => id !== chatId) : [...prev, chatId]
      );
    } catch (err) {
      console.error("Error updating pinned chats:", err);
    }
  };

  const renderItem = ({ item }: { item: RecentChatItem }) => {
    const onPress = () => {
      if (item.type === "chat") {
        // derive recipientId from chatId "uid1_uid2"
        const [a, b] = item.id.split("_");
        const recipientId =
          a === currentUser?.uid ? b : a;
        navigation.navigate("ChatRoomScreen", {
          chatId: item.id,
          recipientId,
        });
      } else {
        // full CommunityItem
        navigation.navigate("CommunityDetailScreen", {
          community: item,
        });
      }
    };

    return (
      <TouchableOpacity style={styles.chatItem} onPress={onPress}>
        <Text style={styles.chatText}>{item.name}</Text>
        <TouchableOpacity onPress={() => handlePinChat(item.id)}>
          <Text
            style={
              pinnedChats.includes(item.id)
                ? styles.unpinText
                : styles.pinText
            }
          >
            {pinnedChats.includes(item.id) ? "Unpin" : "Pin"}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pinned Chats</Text>
      <FlatList
        data={recentChats.filter((c) =>
          pinnedChats.includes(c.id)
        )}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
      />

      <Text style={styles.header}>Recent Chats</Text>
      <FlatList
        data={recentChats.filter(
          (c) => !pinnedChats.includes(c.id)
        )}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  chatItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  chatText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  pinText: {
    color: "#6200EE",
    fontWeight: "bold",
  },
  unpinText: {
    color: "red",
    fontWeight: "bold",
  },
});

export default ChatScreen;
