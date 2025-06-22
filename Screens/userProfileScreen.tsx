import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { doc, getDoc, setDoc } from "firebase/firestore"; // setDoc is not used in this component, can be removed if not needed
import { db, auth } from "../firebaseConfig";
import { RootStackParamList } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";

// Import themed styles and constants
import createStyles, { SPACING } from './context/appStyles'; // Adjust path as needed
import { useTheme } from './context/ThemeContext'; // Adjust path as needed

// --- Types ---
type UserProfileRouteProp = RouteProp<RootStackParamList, "UserProfileScreen">;
type NavigationProp = StackNavigationProp<RootStackParamList, "UserProfileScreen">;

interface UserData { // Ensure this matches your Firestore 'users' document structure
  username: string;
  profilePic?: string;
  aboutMe?: string;
  socialLink?: string; // This is the most likely culprit for indexOf if it's not a string
  // Add other fields from your user document if you use them here
}

// --- Constants ---
const AVATAR_PLACEHOLDER = require("../assets/avatar-placeholder.png");

// --- Helper for content display ---
const renderContentOrPlaceholder = (content?: string) => {
  return content?.trim() ? content : "Nothing to show here";
};

// --- Main Component ---
const UserProfileScreen = () => {
  const route = useRoute<UserProfileRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { userId } = route.params;

  // Use the theme hook to get current colors
  const { colors } = useTheme();
  // Generate styles based on current theme colors
  const styles = createStyles(colors).userProfileScreen;
  const globalStyles = createStyles(colors).global;

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  // --- REVISED: fetchUserData ---
  const fetchUserData = async () => {
    setRefreshing(true);
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userDataFromFirestore = userDoc.data() as UserData;

        // Explicitly ensure socialLink is a string or undefined
        // Sometimes Firestore can return null or non-string types if data was written incorrectly.
        // The indexOf error on Linking.openURL often happens if the URL isn't a string.
        userDataFromFirestore.socialLink = typeof userDataFromFirestore.socialLink === 'string'
                                           ? userDataFromFirestore.socialLink
                                           : undefined;

        // Ensure aboutMe is a string or undefined
        userDataFromFirestore.aboutMe = typeof userDataFromFirestore.aboutMe === 'string'
                                        ? userDataFromFirestore.aboutMe
                                        : undefined;

        setUser(userDataFromFirestore);
      } else {
        setUser(null);
        console.warn(`User with ID ${userId} not found.`);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert(`Failed to load profile: ${(error as Error).message || "Please try again."}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const handleChat = async () => {
    setChatLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert("Error", "You need to be logged in to chat.");
        return; // Early exit
      }

      const chatId = [currentUser.uid, userId].sort().join("_");

      const chatRef = doc(db, "chats", chatId);
      const chatDoc = await getDoc(chatRef);

      if (!chatDoc.exists()) {
        await setDoc(chatRef, { // setDoc is used here for chats
          participants: { [currentUser.uid]: true, [userId]: true },
          createdAt: new Date(),
        });
      }

      navigation.navigate("ChatRoomScreen", { chatId, recipientId: userId });
    } catch (error: any) {
      console.error("Error starting chat:", error);
      Alert.alert(`Failed to start chat: ${error.message || "Please try again."}`);
    } finally {
      setChatLoading(false);
    }
  };

  // --- REVISED: handleOpenLink ---
  const handleOpenLink = () => {
    const link = user?.socialLink;
    if (link) {
      // Add a basic check for URL format before opening
      // Linking.openURL's internal implementation might use indexOf or similar checks
      // on the string. If it's malformed or not a string, it can throw.
      if (typeof link === 'string' && (link.startsWith('http://') || link.startsWith('https://'))) {
          Linking.openURL(link).catch(err => {
              console.error('Failed to open social link:', err);
              Alert.alert('Could not open the link.', 'It might be invalid or not a supported format.');
          });
      } else {
          Alert.alert('Invalid Link', 'The social link format is not supported (must start with http:// or https://).');
          console.warn('Attempted to open invalid social link:', link);
      }
    } else {
        console.warn('No social link available to open.');
    }
  };

  if (loading) {
    return (
      <View style={globalStyles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading user profile...</Text> {/* Changed from global.loadingOverlayText */}
      </View>
    );
  }

  if (!user) {
    return (
      <View style={globalStyles.centeredContainer}>
        <Text style={styles.errorText}>User profile not found.</Text>
        <TouchableOpacity onPress={fetchUserData} style={globalStyles.primaryButton}>
          <Text style={globalStyles.primaryButtonText}>Reload Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchUserData} colors={[colors.primary]} />
      }
    >
      <Image
        source={user.profilePic ? { uri: user.profilePic } : AVATAR_PLACEHOLDER}
        style={styles.profileImage}
      />

      <Text style={styles.username}>{user.username}</Text>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeader}>About Me</Text>
        <Text style={styles.bioText}>{renderContentOrPlaceholder(user.aboutMe)}</Text>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeader}>Social Link</Text>
        {user.socialLink ? (
          <TouchableOpacity onPress={handleOpenLink}>
            <Text style={styles.linkText}>{user.socialLink}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.bioText}>Nothing to show here</Text>
        )}
      </View>

      {auth.currentUser?.uid !== userId && (
        <TouchableOpacity
          style={[globalStyles.primaryButton, { marginTop: SPACING.xlarge }]}
          onPress={handleChat}
          disabled={chatLoading}
        >
          {chatLoading ? (
            <ActivityIndicator color={colors.activeFilterText} />
          ) : (
            <Text style={globalStyles.primaryButtonText}>Chat</Text>
          )}
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default UserProfileScreen;