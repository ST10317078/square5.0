import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Platform,
  ScrollView,
  Switch,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useTheme } from './context/ThemeContext';
import createStyles, { SPACING } from './context/appStyles';

const DEFAULT_AVATAR = require("../assets/avatar-placeholder.png");
const DEFAULT_COMMUNITY_LOGO = require("../assets/community-placeholder.png");

type NavigationProp = StackNavigationProp<RootStackParamList, "CommunityScreen">;

type Community = {
  id: string;
  name: string;
  description: string;
  logo?: string;
};

type UserProfile = {
  id: string;
  username: string;
  profilePic?: string;
  description?: string; // <--- ADDED description field
};

const CommunityScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { theme, colors, toggleTheme } = useTheme();

  const styles = createStyles(colors).communityScreen;
  const globalStyles = createStyles(colors).global;

  const [communityList, setCommunityList] = useState<Community[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [loadingCommunities, setLoadingCommunities] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "communities" | "users">("all");

  // --- Fetch Communities (Real-time with onSnapshot) ---
  useEffect(() => {
    setLoadingCommunities(true);
    setError(null);

    const q = query(collection(db, "communities"), orderBy("name"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedCommunities: Community[] = [];
      querySnapshot.forEach((doc) => {
        fetchedCommunities.push({
          id: doc.id,
          name: doc.data().name || "Unnamed Community",
          description: doc.data().description || "No description available",
          logo: doc.data().logo || undefined,
        });
      });
      setCommunityList(fetchedCommunities);
      setLoadingCommunities(false);
    }, (err) => {
      console.error("Error fetching communities:", err);
      setError("Failed to load communities. Please try again.");
      setLoadingCommunities(false);
    });

    return () => unsubscribe();
  }, []);

  // --- Fetch Users (Real-time with onSnapshot) ---
  useEffect(() => {
    setLoadingUsers(true);
    setError(null);

    const q = query(collection(db, "users"), orderBy("username"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedUsers: UserProfile[] = [];
      querySnapshot.forEach((doc) => {
        fetchedUsers.push({
          id: doc.id,
          username: doc.data().username || "Unknown User",
          profilePic: doc.data().profilePic || undefined,
          description: doc.data().aboutMe || doc.data().description || undefined, // <--- MAPPED description (from 'aboutMe' or 'description' if exists)
        });
      });
      setUsersList(fetchedUsers);
      setLoadingUsers(false);
    }, (err) => {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again.");
      setLoadingUsers(false);
    });

    return () => unsubscribe();
  }, []);


  const handleOpenCommunity = (community: Community) => {
    navigation.navigate("CommunityDetailScreen", { community: community });
  };

    const handleCreateCommunity = () => {
    // You'll need to define 'CreateCommunityScreen' in your RootStackParamList
    navigation.navigate("CreateCommunityScreen");
  };

  const handleOpenUserProfile = (user: UserProfile) => {
    navigation.navigate("UserProfileScreen", { userId: user.id });
  };

  const filteredCommunities = communityList.filter((community) =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (community.description && community.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredUsers = usersList.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.description && user.description.toLowerCase().includes(searchQuery.toLowerCase())) // <--- Also search by description
  );

  const WrapperComponent = Platform.OS === 'web' ? View : (require('react-native').SafeAreaView || View);

  const isLoading = loadingCommunities || loadingUsers;

  return (
    <WrapperComponent style={styles.safeArea}>
      <ScrollView
        style={[
          styles.scrollView,
          Platform.OS === 'web' && { overflow: 'auto' as 'scroll' }
        ]}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={Platform.OS !== 'web'}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.pageTitle}>Explore</Text>
            <View style={styles.themeToggleContainer}>
              <Text style={styles.themeToggleText}>Dark Mode</Text>
              <Switch
                trackColor={{ false: colors.secondaryText, true: colors.primary }}
                thumbColor={colors.cardBackground}
                ios_backgroundColor={colors.secondaryText}
                onValueChange={toggleTheme}
                value={theme === 'dark'}
              />
            </View>
          </View>

          <TextInput
            style={styles.searchBar}
            placeholder="Search communities or users..."
            placeholderTextColor={colors.placeholderText as string}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <View style={styles.filterContainer}>
            {["all", "communities", "users"].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  selectedFilter === filter && { backgroundColor: colors.activeFilterBackground },
                ]}
                onPress={() => setSelectedFilter(filter as "all" | "communities" | "users")}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: selectedFilter === filter ? colors.activeFilterText : colors.secondaryText },
                  ]}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {error && (
            <Text style={[globalStyles.loadingOverlayText, {color: colors.error, textAlign: 'center'}]}>{error}</Text>
          )}

          {isLoading ? (
            <View style={styles.activityIndicatorContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Loading data...</Text>
            </View>
          ) : (
            <>
              {/* Communities Section (no changes here) */}
              {(selectedFilter === "all" || selectedFilter === "communities") &&
                filteredCommunities.length > 0 ? (
                <>
                  <Text style={styles.sectionHeader}>Communities</Text>
                  <FlatList
                    data={filteredCommunities}
                    numColumns={2}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.communityCard}
                        onPress={() => handleOpenCommunity(item)}
                      >
                        <Image
                          source={item.logo ? { uri: item.logo } : DEFAULT_COMMUNITY_LOGO}
                          style={styles.communityLogo}
                        />
                        <Text style={styles.communityCardTitle}>
                          {item.name}
                        </Text>
                        <Text style={styles.communityCardDescription} numberOfLines={2}>
                          {item.description}
                        </Text>
                      </TouchableOpacity>
                    )}
                    columnWrapperStyle={styles.communityListRow}
                    scrollEnabled={false}
                  />
                </>
              ) : selectedFilter !== "users" && filteredCommunities.length === 0 && (
                <Text style={styles.noResultsText}>No communities found matching your search.</Text>
              )}

              {/* Users Section */}
              {(selectedFilter === "all" || selectedFilter === "users") &&
                filteredUsers.length > 0 ? (
                <>
                  <Text style={styles.sectionHeader}>Users</Text>
                  <FlatList
                    data={filteredUsers}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.userCard}
                        onPress={() => handleOpenUserProfile(item)}
                      >
                        {/* User Profile Picture */}
                        <Image
                          source={item.profilePic ? { uri: item.profilePic } : DEFAULT_AVATAR}
                          style={styles.userAvatar}
                        />
                        <View style={{ flex: 1 }}> {/* Flex to allow text to wrap */}
                            <Text style={styles.userCardUsername}>{item.username}</Text>
                            {item.description && ( // <--- Conditionally render description
                                <Text style={styles.userCardDescription} numberOfLines={2}>
                                    {item.description}
                                </Text>
                            )}
                        </View>
                      </TouchableOpacity>
                    )}
                    scrollEnabled={false}
                  />
                </>
              ) : selectedFilter !== "communities" && filteredUsers.length === 0 && (
                <Text style={styles.noResultsText}>No users found matching your search.</Text>
              )}

              {/* No results for "all" filter when both are empty */}
              {selectedFilter === "all" && filteredCommunities.length === 0 && filteredUsers.length === 0 && (
                <Text style={styles.noResultsText}>No communities or users found matching your search.</Text>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </WrapperComponent>
  );
};

export default CommunityScreen;