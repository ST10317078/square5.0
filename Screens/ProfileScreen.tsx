import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleProp,
  TextStyle
} from "react-native";
import * as ImagePicker from "expo-image-picker"; // KEEP THIS IMPORT AS IS

import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, storage } from "../firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useTheme } from './context/ThemeContext';
import createStyles from './context/appStyles';

const DEFAULT_AVATAR = require("../assets/avatar-placeholder.png");

const ProfileScreen = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const { colors, isThemeLoading } = useTheme();

  const styles = createStyles(colors).profileScreen;
  const globalStyles = createStyles(colors).global;

  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [socialLink, setSocialLink] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [loading, setLoading] = useState(false);

  const [isProfileDataLoading, setIsProfileDataLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    } else {
      setIsProfileDataLoading(false);
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    setIsProfileDataLoading(true);
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setSocialLink(data.socialLink || "");
        setAboutMe(data.aboutMe || "");
        setProfilePic(data.profilePic || null);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Failed to load profile data.");
    } finally {
      setIsProfileDataLoading(false);
    }
  };

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant media library permissions to choose a profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // <--- CHANGE BACK TO THIS LINE
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      uploadProfilePicture(result.assets[0].uri);
    }
  };

  const uploadProfilePicture = async (imageUri: string) => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to upload a profile picture.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      setProfilePic(downloadURL);

      await setDoc(
        doc(db, "users", user.uid),
        { profilePic: downloadURL },
        { merge: true }
      );
      Alert.alert("Success", "Profile picture updated!");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      Alert.alert("Upload failed", "Could not upload profile picture. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to save your profile.");
      return;
    }
    setLoading(true);
    try {
      await setDoc(
        doc(db, "users", user.uid),
        { socialLink, aboutMe },
        { merge: true }
      );
      Alert.alert("Success", "Profile updated!");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isThemeLoading || isProfileDataLoading) {
    return (
      <View style={globalStyles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={globalStyles.loadingOverlayText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {loading && (
          <View style={globalStyles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={globalStyles.loadingOverlayText}>Saving...</Text>
          </View>
        )}

        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>

        <TouchableOpacity
          onPress={handleImagePick}
          style={styles.profilePicContainer}
          disabled={loading}
        >
          <Image
            source={profilePic ? { uri: profilePic } : DEFAULT_AVATAR}
            style={[styles.profilePic, { borderColor: colors.primary }]}
          />
          <Text style={styles.changePicText}>Change Profile Picture</Text>
        </TouchableOpacity>

        <View style={styles.inputSection}>
          <Text style={styles.label}>Social Link (optional)</Text>
          <TextInput
            style={styles.textInput as StyleProp<TextStyle>}
            placeholder="https://your-social-profile"
            placeholderTextColor={colors.placeholderText as string}
            value={socialLink}
            onChangeText={setSocialLink}
            keyboardType="url"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>About Me</Text>
          <TextInput
            style={[styles.textInput, styles.aboutMeInput] as StyleProp<TextStyle>}
            placeholder="Write something about yourself..."
            placeholderTextColor={colors.placeholderText as string}
            value={aboutMe}
            onChangeText={setAboutMe}
            multiline
            numberOfLines={4}
            editable={!loading}
          />
        </View>

        <TouchableOpacity onPress={handleSave} style={styles.saveButton} disabled={loading}>
          <Text style={styles.saveButtonText}>
            Save Profile
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;