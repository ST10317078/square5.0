// Screens/Communities/CommunityScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Image,
  Platform,
  ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, Community } from "../../types";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useTheme } from '../context/ThemeContext';
import createStyles from '../context/appStyles';
import { Ionicons } from '@expo/vector-icons';

const DEFAULT_COMMUNITY_LOGO = require("../../assets/community-placeholder.png");

type NavigationProp = StackNavigationProp<RootStackParamList, "ChatScreen">;

interface CommunityListItem extends Community {
  id: string;
}

const CommunityScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const styles = createStyles(colors).communityScreen;
  const globalStyles = createStyles(colors).global;

  const [communities, setCommunities] = useState<CommunityListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCommunities = async () => {
      setLoading(true);
      setError(null);

      try {
        const snapshot = await getDocs(collection(db, "communities"));
        const results: CommunityListItem[] = [];

        snapshot.forEach(docSnap => {
          const data = docSnap.data();
          results.push({
            id: docSnap.id,
            name: data.name || "Unnamed Community",
            description: data.description || "",
            logo: data.logo || undefined,
            createdBy: data.createdBy,
            createdAt: data.createdAt,
          });
        });

        // Optionally sort alphabetically
        results.sort((a, b) => a.name.localeCompare(b.name));
        setCommunities(results);
      } catch (err) {
        console.error("Error fetching communities:", err);
        setError("Failed to load communities. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  const handleOpenCommunity = (community: CommunityListItem) => {
    navigation.navigate("CommunityDetailScreen", { community });
  };

  const filteredCommunities = communities.filter((community) =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (community.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  const Wrapper = Platform.OS === 'web' ? View : require('react-native').SafeAreaView || View;

  return (
    <Wrapper style={styles.safeArea}>
      <ScrollView>

      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>Communities</Text>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Search communities..."
        placeholderTextColor={colors.placeholderText as string}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {error && <Text style={[globalStyles.loadingOverlayText, { color: colors.error }]}>{error}</Text>}

      {loading ? (
        <View style={styles.activityIndicatorContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading communities...</Text>
        </View>
      ) : (
        <FlatList
          nestedScrollEnabled
          style={styles.scrollViewContent}
          data={filteredCommunities}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.communityListRow}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.communityCard}
              onPress={() => handleOpenCommunity(item)}
            >
              <Image
                source={item.logo ? { uri: item.logo } : DEFAULT_COMMUNITY_LOGO}
                style={styles.communityLogo}
              />
              <View style={styles.communityCardContent}>
                <Text style={styles.communityCardTitle}>{item.name}</Text>
                <Text style={styles.lastMessagePreview} numberOfLines={1}>
                  {item.description || "No description available."}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.noResultsText}>No communities found.</Text>
          }
        />
      )}
      </ScrollView>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateCommunityScreen")}
      >
      <Ionicons name="add" size={32} color={colors.buttonText} />
      </TouchableOpacity>
    </Wrapper>
    
    
  );
};

export default CommunityScreen;
