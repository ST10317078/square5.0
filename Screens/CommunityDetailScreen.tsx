import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, Community } from "../types"; //
import { db, auth, storage } from "../firebaseConfig";
import { doc, getDoc, updateDoc, setDoc, arrayUnion, collection, getDocs, deleteDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { Ionicons } from "@expo/vector-icons"; //

import { useTheme } from './context/ThemeContext'; //
import createStyles, { SPACING, BOTTOM_TAB_BAR_HEIGHT } from './context/appStyles'; //

const DEFAULT_COMMUNITY_LOGO = require("../assets/community-placeholder.png");

type CommunityDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, "CommunityDetailScreen">;
type CommunityDetailScreenRouteProp = RouteProp<RootStackParamList, "CommunityDetailScreen">;

const CommunityDetailScreen = () => {
  const route = useRoute<CommunityDetailScreenRouteProp>();
  const { community } = route.params;

  const [communityData, setCommunityData] = useState<Community>(community);
  const [isMember, setIsMember] = useState(false);
  const [groupChats, setGroupChats] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigation = useNavigation<CommunityDetailScreenNavigationProp>();

  const user = auth.currentUser;

  const { colors } = useTheme();
  const styles = createStyles(colors).communityDetailScreen; // THIS LINE IS CORRECT
  const globalStyles = createStyles(colors).global;

  const isCreator = user && communityData.createdBy === user.uid;

  useEffect(() => {

  const fetchFullCommunityData = async () => {
  try {
    const communityDocRef = doc(db, "communities", community.id);
    const communitySnap = await getDoc(communityDocRef);
    if (communitySnap.exists()) {
      setCommunityData({
        ...(communitySnap.data() as Community),
        id: communitySnap.id
      });
    }
  } catch (error: any) {
    console.error("Error fetching full community data:", error);
  }
};


    fetchFullCommunityData();
    checkMembership();
    fetchGroupChats();
  }, [user, community.id]);

  const checkMembership = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const joinedCommunities = userSnap.data().joinedCommunities || [];
        setIsMember(joinedCommunities.includes(community.id));
      }
    } catch (error: any) { // ADDED :any
      console.error("Error checking membership:", error);
    }
  };

  const fetchGroupChats = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "communities", community.id, "groupChats"));
      
      if (querySnapshot.empty) {
        setGroupChats([]);
        return;
      }
  
      const groups = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as { id: string; name: string }[];
  
      setGroupChats(groups);
    } catch (error: any) { // ALREADY HAD :any, just confirming
      if (error.code === "permission-denied") {
        console.warn("You do not have permission to access group chats.");
      } else {
        console.error("Error fetching group chats:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCommunity = async () => {
    if (!user?.uid) {
      Alert.alert("Error", "You must be logged in to join a community.");
      return;
    }
  
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
  
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          joinedCommunities: [community.id], 
        });
      } else {
        await updateDoc(userRef, {
          joinedCommunities: arrayUnion(community.id),
        });
      }
  
      setIsMember(true);
      Alert.alert("Success", "You have joined the community!");
  
    } catch (error: any) { // ADDED :any
      console.error("Error joining community:", error);
      Alert.alert("Error", "Failed to join the community. Please try again.");
    }
  };

  const handleEditCommunity = () => {
    navigation.navigate("EditCommunityScreen", { community: communityData });
  };

  const handleDeleteCommunity = async () => {
    if (!user || !isCreator) {
      Alert.alert("Permission Denied", "You are not authorized to delete this community.");
      return;
    }

    Alert.alert(
      "Delete Community",
      `Are you sure you want to delete "${communityData.name}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              if (communityData.logo) {
                const imagePath = `community_logos/${communityData.id}.jpg`;
                const logoRef = ref(storage, imagePath);
                await deleteObject(logoRef);
                console.log("Community logo deleted from Storage.");
              }

              const communityDocRef = doc(db, "communities", communityData.id);
              await deleteDoc(communityDocRef);
              console.log("Community document deleted from Firestore.");

              Alert.alert("Success", `Community "${communityData.name}" deleted successfully.`);
              navigation.goBack(); 

            } catch (error: any) { // ADDED :any
              console.error("Error deleting community:", error);
              Alert.alert("Error", "Failed to delete community. Please try again.");
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };


  if (loading) {
    return (
      <View style={globalStyles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        {/* Make sure loadingText is defined in communityDetailScreen in appStyles.ts */}
        <Text style={styles.loadingText}>Loading community details...</Text> 
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      {isDeleting && (
        <View style={globalStyles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={globalStyles.loadingOverlayText}>Deleting community...</Text>
        </View>
      )}

      <View style={styles.headerContainer}>
        <Text style={styles.header}>{communityData.name}</Text>
        {isCreator && (
          <TouchableOpacity style={styles.settingsButton} onPress={handleEditCommunity}>
            <Ionicons name="settings-outline" size={24} style={styles.settingsIcon} />
          </TouchableOpacity>
        )}
      </View>
      
      <Image
        source={communityData.logo ? { uri: communityData.logo } : DEFAULT_COMMUNITY_LOGO}
        style={styles.communityLogo}
      />

      <Text style={styles.description}>{communityData.description || "No description available."}</Text>

      {!isMember && !isCreator && (
        <TouchableOpacity style={styles.joinButton} onPress={handleJoinCommunity}>
          <Text style={styles.joinButtonText}>Join Community</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.subHeader}>Group Chats</Text>
      {groupChats.length > 0 ? (
        <FlatList
          data={groupChats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.groupChatItem}
              onPress={() => navigation.navigate("GroupChatScreen", { groupId: item.id, groupName: item.name, communityId: community.id })}
            >
              <Text style={styles.groupChatText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          scrollEnabled={false}
          contentContainerStyle={styles.flatListContent}
        />
      ) : (
        <Text style={styles.noGroupsText}>No group chats available.</Text>
      )}

      {(isMember || isCreator) && (
        <TouchableOpacity
          style={styles.createGroupButton}
          onPress={() => {
            console.log("NAVIGATING to CreateGroupChatScreen with communityId:", communityData.id);
            navigation.navigate("CreateGroupChatScreen", {
              communityId: communityData.id
            });
          }}
        >
          <Text style={styles.createGroupButtonText}>+ Create Group Chat</Text>
        </TouchableOpacity>
      )}

    </ScrollView>
  );
};

export default CommunityDetailScreen;