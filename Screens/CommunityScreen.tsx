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
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, Community } from "../types";
import { collection, onSnapshot, query, orderBy, where, getDocs, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { useTheme } from './context/ThemeContext';
import createStyles, { SPACING, FONT_SIZES } from './context/appStyles';

const DEFAULT_AVATAR = require("../assets/avatar-placeholder.png");
const DEFAULT_COMMUNITY_LOGO = require("../assets/community-placeholder.png");

type NavigationProp = StackNavigationProp<RootStackParamList, "CommunityScreen">;

type CommunityListItem = Community & {
  type: "community";
  lastMessageText?: string;
  lastMessageTimestamp?: any;
};

type UserListItem = {
  id: string; // User UID
  username: string;
  profilePic?: string;
  aboutMe?: string;
  type: "user";
  lastMessageText?: string;
  lastMessageTimestamp?: any;
  chatId?: string;
};

type CombinedListItem = CommunityListItem | UserListItem;

const CommunityScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { theme, colors, toggleTheme } = useTheme();

  const styles = createStyles(colors).communityScreen;
  const globalStyles = createStyles(colors).global;

  const [combinedList, setCombinedList] = useState<CombinedListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"communities" | "users">("communities");

  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      setError("Please log in to see activities.");
      return;
    }

    const fetchCombinedData = async () => {
      setLoading(true);
      setError(null);
      const tempCombinedList: CombinedListItem[] = [];

      try {
        const communitiesCollectionRef = collection(db, "communities");
        const communitiesSnapshot = await getDocs(communitiesCollectionRef);

        for (const commDoc of communitiesSnapshot.docs) {
          const commData = commDoc.data();
          const communityId = commDoc.id;
          let lastMessageText: string | undefined = undefined;
          let lastMessageTimestamp: any = null;

          const groupChatDocRef = doc(db, "chats", communityId);
          const groupChatDoc = await getDoc(groupChatDocRef);
          if (groupChatDoc.exists() && groupChatDoc.data().lastMessageTimestamp) {
            lastMessageText = groupChatDoc.data().lastMessageText || undefined;
            lastMessageTimestamp = groupChatDoc.data().lastMessageTimestamp;
          }

          tempCombinedList.push({
            id: communityId,
            name: commData.name || "Unnamed Community",
            description: commData.description || "No description available",
            logo: commData.logo || undefined,
            createdBy: commData.createdBy || undefined,
            createdAt: commData.createdAt || undefined,
            type: "community",
            lastMessageText: lastMessageText,
            lastMessageTimestamp: lastMessageTimestamp,
          });
        }

        const usersCollectionRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollectionRef);

        for (const userDoc of usersSnapshot.docs) {
          if (userDoc.id === currentUser.uid) {
            continue;
          }

          const userData = userDoc.data();
          const userId = userDoc.id;
          let lastMessageText: string | undefined = undefined;
          let lastMessageTimestamp: any = null;
          let chatDocumentId: string | undefined;

          const potentialChatId = [currentUser.uid, userId].sort().join("_");
          const oneToOneChatDocRef = doc(db, "chats", potentialChatId);
          const oneToOneChatDoc = await getDoc(oneToOneChatDocRef);

          if (oneToOneChatDoc.exists() && oneToOneChatDoc.data().lastMessageTimestamp) {
            lastMessageText = oneToOneChatDoc.data().lastMessageText || undefined;
            lastMessageTimestamp = oneToOneChatDoc.data().lastMessageTimestamp;
            chatDocumentId = potentialChatId;
          }

          tempCombinedList.push({
            id: userId,
            username: userData.username || "Unknown User",
            profilePic: userData.profilePic || undefined,
            aboutMe: userData.aboutMe || undefined,
            type: "user",
            lastMessageText: lastMessageText,
            lastMessageTimestamp: lastMessageTimestamp,
            chatId: chatDocumentId,
          });
        }

        tempCombinedList.sort((a, b) => {
          const tsA = a.lastMessageTimestamp?.toDate ? a.lastMessageTimestamp.toDate().getTime() : 0;
          const tsB = b.lastMessageTimestamp?.toDate ? b.lastMessageTimestamp.toDate().getTime() : 0;

          if (tsB !== tsA) {
            return tsB - tsA;
          } else {
            const nameA = a.type === "community" ? a.name : a.username;
            const nameB = b.type === "community" ? b.name : b.username;
            return nameA.localeCompare(nameB);
          }
        });

        setCombinedList(tempCombinedList);

      } catch (err) {
        console.error("Error fetching combined activity data:", err);
        setError("Failed to load activities. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCombinedData();
  }, [currentUser]);

  const handleOpenActivity = (item: CombinedListItem) => {
    if (item.type === "community") {
      navigation.navigate("CommunityDetailScreen", { community: item });
    } else if (item.type === "user") {
      const userItem = item as UserListItem;
      const currentUserUid = auth.currentUser?.uid;

      if (!currentUserUid || !userItem.id) {
        Alert.alert("Error", "Cannot start chat. User not logged in or recipient ID missing.");
        return;
      }

      const chatIdForNavigation = userItem.chatId || [currentUserUid, userItem.id].sort().join("_");
      const chatRef = doc(db, "chats", chatIdForNavigation);

      getDoc(chatRef).then((chatDoc) => {
        if (!chatDoc.exists()) {
          setDoc(chatRef, {
            participants: { [currentUserUid]: true, [userItem.id]: true },
            createdAt: serverTimestamp(),
          }).then(() => {
            navigation.navigate("ChatRoomScreen", { chatId: chatIdForNavigation, recipientId: userItem.id });
          }).catch(createError => {
            console.error("Error creating chat document for new user:", createError);
            Alert.alert("Error", "Failed to create chat. Please check network/permissions.");
          });
        } else {
          navigation.navigate("ChatRoomScreen", { chatId: chatIdForNavigation, recipientId: userItem.id });
        }
      }).catch(getError => {
        console.error("Error checking chat document existence:", getError);
        Alert.alert("Error", "Failed to verify chat existence.");
      });
    }
  };

  const handleCreateCommunity = () => {
    navigation.navigate("CreateCommunityScreen");
  };

  const filteredActivityList = combinedList.filter((item) => {
    const searchTerm = searchQuery.toLowerCase();

    let primaryContent = '';
    if (item.type === 'community') {
      primaryContent = item.name;
    } else {
      primaryContent = item.username;
    }
    const nameMatch = primaryContent.toLowerCase().includes(searchTerm);

    let secondaryContent = '';
    if (item.type === 'community') {
      secondaryContent = item.lastMessageText || item.description || '';
    } else {
      secondaryContent = item.lastMessageText || item.aboutMe || '';
    }
    const contentMatch = secondaryContent.toLowerCase().includes(searchTerm);

    const matchesSearch = nameMatch || contentMatch;

    if (selectedFilter === "communities") {
      return item.type === "community" && matchesSearch;
    } else {
      return item.type === "user" && matchesSearch;
    }
  });

  const WrapperComponent = Platform.OS === 'web' ? View : (require('react-native').SafeAreaView || View);

  const shouldRenderTwoColumns = selectedFilter === "communities";
  const flatListKey = shouldRenderTwoColumns ? "two-columns" : "one-column";

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
        <View>
          <View style={styles.headerContainer}>
            <Text style={styles.pageTitle}>Explore & Chat</Text>
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
            placeholder="Search communities, users, or messages..."
            placeholderTextColor={colors.placeholderText as string}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <View style={styles.filterContainer}>
            {["communities", "users"].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  selectedFilter === filter && { backgroundColor: colors.activeFilterBackground },
                ]}
                onPress={() => setSelectedFilter(filter as "communities" | "users")}
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

          {loading ? (
            <View style={styles.activityIndicatorContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Loading activities...</Text>
            </View>
          ) : (
            <>
              {filteredActivityList.length > 0 ? (
                <FlatList
                  key={flatListKey}
                  data={filteredActivityList}
                  keyExtractor={(item) => `${item.type}-${item.id}`}
                  renderItem={({ item }) => {
                    if (item.type === "community") {
                      const community = item as CommunityListItem;
                      return (
                        <TouchableOpacity
                          style={styles.communityCard}
                          onPress={() => handleOpenActivity(community)}
                        >
                          <Image
                            source={community.logo ? { uri: community.logo } : DEFAULT_COMMUNITY_LOGO}
                            style={styles.communityLogo}
                          />
                          <View style={styles.communityCardContent}> {/* New View for text content */}
                            <View style={styles.cardHeaderRow}> {/* Name and Timestamp row */}
                              <Text style={styles.communityCardTitle}>
                                {community.name}
                              </Text>
                              {community.lastMessageTimestamp && (
                                <Text style={styles.cardTimestamp}>
                                  {community.lastMessageTimestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                              )}
                            </View>
                            <Text style={styles.lastMessagePreview} numberOfLines={1}>
                              {community.lastMessageText || community.description || "No description available."}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    } else { // item.type === "user"
                      const userItem = item as UserListItem;
                      return (
                        <TouchableOpacity
                          style={styles.userCard}
                          onPress={() => handleOpenActivity(userItem)}
                        >
                          <Image
                            source={userItem.profilePic ? { uri: userItem.profilePic } : DEFAULT_AVATAR}
                            style={styles.userAvatar}
                          />
                          <View style={styles.userCardContent}> {/* New View for text content */}
                            <View style={styles.cardHeaderRow}> {/* Name and Timestamp row */}
                              <Text style={styles.userCardUsername}>{userItem.username}</Text>
                              {userItem.lastMessageTimestamp && (
                                <Text style={styles.cardTimestamp}>
                                  {userItem.lastMessageTimestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                              )}
                            </View>
                            <Text style={styles.lastMessagePreview} numberOfLines={1}>
                              {userItem.lastMessageText || "Start a chat..."}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    }
                  }}
                  scrollEnabled={false}
                  numColumns={shouldRenderTwoColumns ? 2 : 1}
                  columnWrapperStyle={shouldRenderTwoColumns ? styles.communityListRow : null}
                />
              ) : (
                <Text style={styles.noResultsText}>No activities found matching your search.</Text>
              )}
            </>
          )}
        </View>
      </ScrollView>

    </WrapperComponent>
  );
};

export default CommunityScreen;
