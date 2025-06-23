// Screens/ChatRoomScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { doc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { RootStackParamList } from '../types';

// Import themed styles and constants
import createStyles, { SPACING, FONT_SIZES } from './context/appStyles'; // Adjust path as needed
import { useTheme } from './context/ThemeContext'; // Adjust path as needed

// Define the route and navigation props for ChatRoomScreen
type ChatRoomScreenRouteProp = RouteProp<RootStackParamList, 'ChatRoomScreen'>;
// Use StackNavigationProp for better type safety with navigation methods like goBack
type ChatRoomScreenNavigationProp = any; // Assuming StackNavigationProp<RootStackParamList, 'ChatRoomScreen'>;

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: any; // Firestore Timestamp
}

const ChatRoomScreen = () => {
  const route = useRoute<ChatRoomScreenRouteProp>();
  const navigation = useNavigation<ChatRoomScreenNavigationProp>();
  const { chatId, recipientId } = route.params;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [recipientUsername, setRecipientUsername] = useState('Loading...');

  const currentUser = auth.currentUser;

  // Use the theme hook to get current colors
  const { colors } = useTheme();
  // Generate styles based on current theme colors and spacing
  const styles = createStyles(colors).chatRoomScreen; // We'll define chatRoomScreen styles in appStyles
  const globalStyles = createStyles(colors).global; // For global styles like centered containers


  useEffect(() => {
    if (!currentUser) {
      console.warn("User not logged in for chat.");
      navigation.goBack();
      return;
    }

    // Fetch recipient's username for the chat header
    const fetchRecipientUsername = async () => {
      if (recipientId) {
        try {
          const userDocRef = doc(db, 'users', recipientId);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setRecipientUsername(userDoc.data().username || 'Unknown User');
          } else {
            setRecipientUsername('User Not Found');
          }
        } catch (error) {
          console.error("Error fetching recipient username:", error);
          setRecipientUsername('Error');
        }
      }
    };
    fetchRecipientUsername();

    // Set up real-time listener for messages
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as Message);
      setMessages(msgs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching messages:", error);
      Alert.alert("Error", `Failed to load messages: ${(error as Error).message}`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId, currentUser, recipientId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !currentUser) return;

    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text: newMessage,
        senderId: currentUser.uid,
        createdAt: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", `Could not send message: ${(error as Error).message}`);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderId === currentUser?.uid;
    return (
      <View style={[
        styles.messageBubble,
        isCurrentUser ? styles.myMessageBubble : styles.otherMessageBubble
      ]}>
        <Text style={isCurrentUser ? styles.myMessageText : styles.otherMessageText}>
          {item.text}
        </Text>
        {/* Optional: Add timestamp */}
        <Text style={styles.timestampText}>
          {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={globalStyles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text }}>Loading messages...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? SPACING.xlarge : 0} // Adjust offset with SPACING
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          {/* Using a simple text arrow, consider an icon library like FontAwesome if available */}
          <Text style={styles.backButtonText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat with {recipientUsername}</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        inverted={false}
        contentContainerStyle={styles.messagesList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
          placeholderTextColor={colors.textSecondary}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatRoomScreen;
