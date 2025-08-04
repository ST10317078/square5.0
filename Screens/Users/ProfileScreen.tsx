// src/Screens/Profile/ProfileScreen.tsx

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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth, db, storage } from "../../firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useTheme } from "../context/ThemeContext";
import createStyles, { FONT_SIZES } from "../context/appStyles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import { Ionicons } from "@expo/vector-icons";

const DEFAULT_AVATAR = require("../../assets/avatar-placeholder.png");

type ProfileNav = StackNavigationProp<RootStackParamList, "ProfileScreen">;

const ProfileScreen: React.FC = () => {
  const user = auth.currentUser;
  const { colors, isThemeLoading } = useTheme();
  const navigation = useNavigation<ProfileNav>();
  const { profileScreen: ps, global: gs } = createStyles(colors);

  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [socialLink, setSocialLink]   = useState("");
  const [aboutMe, setAboutMe]         = useState("");
  const [loading, setLoading]         = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch profile
  useEffect(() => {
    if (!user) {
      setDataLoading(false);
      navigation.navigate("AuthScreen");
      return;
    }
    (async () => {
      setDataLoading(true);
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const d = snap.data();
          setProfilePic(d.profilePic ?? null);
          setSocialLink(d.socialLink ?? "");
          setAboutMe(d.aboutMe ?? "");
        }
      } catch (err: any) {
        console.error(err);
        Alert.alert("Error", err.message || "Could not load profile.");
      } finally {
        setDataLoading(false);
      }
    })();
  }, [user, navigation]);

  // Pick & upload picture
  const handleImagePick = async () => {
    if (!user || loading) return;
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Grant media library access.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!res.canceled && res.assets.length) {
      await uploadProfilePicture(res.assets[0].uri);
    }
  };

  const uploadProfilePicture = async (uri: string) => {
    if (!user) return;
    setLoading(true);
    try {
      const blob = await (await fetch(uri)).blob();
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(storageRef, blob, { contentType: "image/jpeg" });
      const url = await getDownloadURL(storageRef);
      setProfilePic(url);
      await setDoc(doc(db, "users", user.uid), { profilePic: url }, { merge: true });
      Alert.alert("Success", "Profile picture updated!");
    } catch (err: any) {
      console.error(err);
      Alert.alert("Upload failed", err.message || "Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Save social/“about me”
  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          socialLink: socialLink.trim(),
          aboutMe:   aboutMe.trim(),
        },
        { merge: true }
      );
      Alert.alert("Success", "Profile updated!");
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Could not save.");
    } finally {
      setLoading(false);
    }
  };

  // Loading/UI guards
  if (isThemeLoading || dataLoading) {
    return (
      <View style={gs.centeredContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={gs.loadingOverlayText}>
          {isThemeLoading ? "Loading theme…" : "Loading profile…"}
        </Text>
      </View>
    );
  }
  if (!user) {
    return (
      <View style={gs.centeredContainer}>
        <Text style={gs.errorText}>Log in to view your profile.</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("AuthScreen")}
          style={gs.primaryButton}
        >
          <Text style={gs.primaryButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={gs.safeArea}>
      <ScrollView contentContainerStyle={ps.scrollViewContent}>
        {loading && (
          <View style={gs.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={gs.loadingOverlayText}>Saving…</Text>
          </View>
        )}

        {/* Header */}
        <View style={ps.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={gs.backButton || gs.primaryButton}
          >
            <Ionicons
              name="arrow-back"
              size={FONT_SIZES.xxlarge}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
          <Text style={ps.headerTitle}>Edit Profile</Text>
        </View>

        {/* Profile Pic */}
        <TouchableOpacity
          onPress={handleImagePick}
          style={ps.profilePicContainer}
          disabled={loading}
        >
          <Image
            source={profilePic ? { uri: profilePic } : DEFAULT_AVATAR}
            style={[ps.profilePic, { borderColor: colors.primary }]}
          />
          <Text style={ps.changePicText}>Change Profile Picture</Text>
        </TouchableOpacity>

        {/* Social Link */}
        <View style={ps.inputSection}>
          <Text style={ps.label}>Social Link (optional)</Text>
          <TextInput
            style={ps.textInput}
            placeholder="https://your-link"
            placeholderTextColor={colors.placeholderText}
            value={socialLink}
            onChangeText={setSocialLink}
            keyboardType="url"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        {/* About Me */}
        <View style={ps.inputSection}>
          <Text style={ps.label}>About Me</Text>
          <TextInput
            style={[ps.textInput, ps.aboutMeInput]}
            placeholder="Tell us about yourself…"
            placeholderTextColor={colors.placeholderText}
            value={aboutMe}
            onChangeText={setAboutMe}
            multiline
            numberOfLines={4}
            editable={!loading}
          />
        </View>

        {/* Save */}
        <TouchableOpacity
          onPress={handleSave}
          style={ps.saveButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.activeFilterText} />
          ) : (
            <Text style={ps.saveButtonText}>Save Profile</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
