// src/theme/appStyles.ts
import { StyleSheet, Platform } from 'react-native';
import { ThemeColors } from './ThemeContext';


export const BOTTOM_TAB_BAR_HEIGHT = 70; // Adjust this value precisely if needed

export const SPACING = {
  xsmall: 4,
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
  xxlarge: 40,
};

export const FONT_SIZES = {
  xsmall: 12,
  small: 14,
  medium: 16,
  large: 18,
  xlarge: 20,
  xxlarge: 24,
  heading1: 28,
  heading2: 26,
  heading3: 20,
};

const createStyles = (colors: ThemeColors) => {
  return {
    // --- Global/Shared Styles ---
    global: StyleSheet.create({
      flex1: { flex: 1 },
      centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
      },
      safeArea: {
        flex: 1,
        backgroundColor: colors.background,
      },
      primaryButton: {
        backgroundColor: colors.primary,
        paddingVertical: SPACING.medium,
        paddingHorizontal: SPACING.large,
        borderRadius: SPACING.large,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 120,
        flexDirection: 'row',
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 8,
        ...Platform.select({
          web: {
            cursor: 'pointer',
            boxShadow: '0px 4px 6px rgba(0,0,0,0.2)',
          }
        })
      },
      primaryButtonText: {
        color: colors.activeFilterText,
        fontSize: FONT_SIZES.large,
        fontWeight: 'bold',
      },
      loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
      },
      loadingOverlayText: {
        marginTop: SPACING.small,
        fontSize: FONT_SIZES.medium,
        fontWeight: 'bold',
        color: colors.activeFilterText,
      },
    }),

    // --- CommunityScreen Styles ---
    communityScreen: StyleSheet.create({
      safeArea: {
        flex: 1,
        backgroundColor: colors.background,
      },
      scrollView: {
        flex: 1,
      },
      scrollViewContent: {
        flexGrow: 1,
        paddingBottom: BOTTOM_TAB_BAR_HEIGHT + SPACING.large, // <--- ADDED BOTTOM_TAB_BAR_HEIGHT here
      },
      container: {
        paddingHorizontal: SPACING.medium,
        paddingTop: SPACING.small,
      },
      headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.large,
      },
      pageTitle: {
        fontSize: FONT_SIZES.heading1,
        fontWeight: "bold",
        color: colors.text,
      },
      themeToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      themeToggleText: {
        fontSize: FONT_SIZES.medium,
        marginRight: SPACING.small,
        color: colors.secondaryText,
      },
      searchBar: {
        width: "100%",
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 25,
        borderWidth: 1,
        fontSize: FONT_SIZES.medium,
        marginBottom: SPACING.large,
        backgroundColor: colors.cardBackground,
        borderColor: colors.borderColor,
        color: colors.text,
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        ...Platform.select({
          web: {
            boxShadow: '0 2px 3px rgba(0,0,0,0.1)',
          },
        }),
      },
      filterContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: SPACING.large + SPACING.small,
        backgroundColor: colors.cardBackground,
        borderRadius: 10,
        padding: SPACING.xsmall,
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        ...Platform.select({
          web: {
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          },
        }),
      },
      filterButton: {
        flex: 1,
        paddingVertical: 10,
        marginHorizontal: 3,
        borderRadius: 8,
        alignItems: "center",
      },
      filterText: {
        fontWeight: "600",
        fontSize: FONT_SIZES.medium - 1,
      },
      activityIndicatorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        minHeight: 150,
      },
      loadingText: {
        marginTop: SPACING.small,
        fontSize: FONT_SIZES.medium,
        color: colors.secondaryText,
      },
      sectionHeader: {
        fontSize: FONT_SIZES.xlarge,
        fontWeight: "bold",
        marginBottom: SPACING.medium,
        marginTop: SPACING.small,
        borderBottomWidth: 1,
        paddingBottom: SPACING.xsmall,
        color: colors.text,
        borderBottomColor: colors.borderColor,
      },
      communityListRow: {
        justifyContent: "space-between",
        marginBottom: SPACING.small,
      },
      communityCard: {
        flex: 1,
        margin: SPACING.small,
        padding: 15,
        backgroundColor: colors.cardBackground,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.borderColor,
        alignItems: "center", // Changed to center for icon/logo placement
        justifyContent: "space-between",
        minHeight: 120,
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        ...Platform.select({
          web: {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            flexBasis: '48%',
          },
        }),
      },
      // New style for community logo
      communityLogo: {
        width: 60,
        height: 60,
        borderRadius: 30, // Make it circular
        marginBottom: SPACING.xsmall,
        backgroundColor: colors.placeholder, // Placeholder background
        borderWidth: 1,
        borderColor: colors.borderColor,
      },
      communityCardTitle: {
        fontSize: FONT_SIZES.medium + 1,
        fontWeight: "bold",
        color: colors.text,
        marginBottom: SPACING.xsmall,
        textAlign: 'center', // Center text below logo
      },
      communityCardDescription: {
        fontSize: FONT_SIZES.xsmall + 1,
        color: colors.secondaryText,
        textAlign: 'center', // Center text below logo
      },
      userCard: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginBottom: SPACING.small,
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: colors.cardBackground,
        borderColor: colors.borderColor,
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 3,
        ...Platform.select({
          web: {
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          },
        }),
      },
      userAvatar: { // Style for user profile pictures
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: SPACING.medium,
        backgroundColor: colors.placeholder,
        borderWidth: 1,
        borderColor: colors.borderColor,
      },
      userCardUsername: {
        fontSize: FONT_SIZES.medium,
        color: colors.text,
        fontWeight: "500",
      },
        userCardDescription: { // <--- ADDED style for user description
        fontSize: FONT_SIZES.small, // Slightly smaller font
        color: colors.secondaryText,
        marginTop: SPACING.xsmall / 2, // Small space above
        lineHeight: FONT_SIZES.medium,
      },
      noResultsText: {
        textAlign: "center",
        marginTop: SPACING.xlarge,
        fontSize: FONT_SIZES.medium,
        color: colors.secondaryText,
        paddingBottom: SPACING.large,
      },
            // NEW STYLE FOR FLOATING ACTION BUTTON
      fab: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        right: SPACING.large,
        top: 'auto',
        bottom: BOTTOM_TAB_BAR_HEIGHT + SPACING.large, // <--- FAB adjusted bottom position
        backgroundColor: colors.primary,
        borderRadius: 30,
        elevation: 20, // Android shadow
        shadowColor: colors.shadowColor, // iOS shadow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        zIndex: 999, // Ensure it's on top
      },
      fabText: {
        fontSize: FONT_SIZES.xxlarge, // Large plus sign
        color: colors.activeFilterText, // White/light color
        lineHeight: Platform.OS === 'ios' ? FONT_SIZES.xxlarge : FONT_SIZES.xxlarge + 5, // Adjust for centering on iOS/Android
        fontWeight: 'bold',
      },
    }),

  // NEW: CreateCommunityScreen Styles
    createCommunityScreen: StyleSheet.create({
      container: {
        flex: 1,
        padding: SPACING.large,
        backgroundColor: colors.background, // Themed
      },
      header: {
        fontSize: FONT_SIZES.heading2, // Themed font size
        fontWeight: "bold",
        marginBottom: SPACING.medium, // Themed spacing
        color: colors.text, // Themed
        textAlign: 'center',
      },
      logoContainer: {
        alignSelf: 'center', // Center it horizontally
        width: 120,
        height: 120,
        borderRadius: 60, // Circular
        backgroundColor: colors.cardBackground, // Themed background
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.large, // Themed spacing
        borderWidth: 2,
        borderColor: colors.borderColor, // Themed border
        overflow: 'hidden', // Clip image
      },
      logoImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
      },
      addLogoText: {
        color: colors.primary, // Themed color
        fontSize: FONT_SIZES.medium,
        fontWeight: '600',
        marginTop: SPACING.small, // Themed spacing
      },
      input: {
        // Reuse general textInput styles if available, or define new ones
        height: 50,
        backgroundColor: colors.cardBackground, // Themed
        paddingHorizontal: SPACING.small, // Themed
        borderRadius: SPACING.small, // Themed
        marginBottom: SPACING.medium, // Themed
        borderWidth: 1,
        borderColor: colors.borderColor, // Themed
        fontSize: FONT_SIZES.medium, // Themed
        color: colors.text, // Themed
        shadowColor: colors.shadowColor, // Themed
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      },
      textArea: {
        height: 100,
        textAlignVertical: "top",
      },
      createButton: {
        backgroundColor: colors.primary, // Themed
        padding: SPACING.medium, // Themed
        alignItems: "center",
        borderRadius: SPACING.small, // Themed
        marginTop: SPACING.medium, // Themed
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 8,
      },
      createButtonText: {
        color: colors.activeFilterText, // Themed (e.g., white text on primary button)
        fontWeight: "bold",
        fontSize: FONT_SIZES.large, // Themed
      },
      loadingOverlayScreen: { // For full-screen loading on create community
        ...StyleSheet.absoluteFillObject,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
      },
      loadingOverlayText: {
        marginTop: SPACING.medium,
        fontSize: FONT_SIZES.medium,
        color: colors.text,
      },
    }),

    // --- ProfileScreen Styles (existing) ---
    profileScreen: StyleSheet.create({
      safeArea: {
        flex: 1,
        backgroundColor: colors.background,
      },
      scrollViewContent: {
        flexGrow: 1,
        padding: SPACING.large,
        paddingBottom: BOTTOM_TAB_BAR_HEIGHT + SPACING.xxlarge, // <--- ADDED BOTTOM_TAB_BAR_HEIGHT here
      },
      loadingScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
      },
      loadingScreenText: {
        marginTop: SPACING.small,
        fontSize: FONT_SIZES.medium,
        fontWeight: 'bold',
        color: colors.text,
      },
      headerContainer: {
        marginBottom: SPACING.xlarge,
        alignItems: 'center',
      },
      headerTitle: {
        fontSize: FONT_SIZES.heading1,
        fontWeight: "bold",
        color: colors.text,
      },
      profilePicContainer: {
        alignItems: "center",
        marginBottom: SPACING.xlarge,
      },
      profilePic: {
        width: 130,
        height: 130,
        borderRadius: 65,
        borderWidth: 3,
        backgroundColor: colors.cardBackground,
      },
      changePicText: {
        marginTop: SPACING.small,
        fontSize: FONT_SIZES.medium,
        fontWeight: "600",
        color: colors.primary,
      },
      inputSection: {
        marginBottom: SPACING.large,
        width: '100%',
      },
      label: {
        fontSize: FONT_SIZES.medium,
        color: colors.text,
        marginBottom: SPACING.small,
        fontWeight: '600',
      },
      textInput: {
        borderRadius: SPACING.small,
        paddingVertical: SPACING.small + 2,
        paddingHorizontal: SPACING.medium,
        fontSize: FONT_SIZES.medium,
        borderWidth: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 4,
        backgroundColor: colors.cardBackground,
        borderColor: colors.borderColor,
        color: colors.text,
        shadowColor: colors.shadowColor,
        ...Platform.select({
          web: {
            outlineStyle: 'none' as 'none',
            boxShadow: '0px 2px 3px rgba(0,0,0,0.1)',
          }
        })
      },
      aboutMeInput: {
        height: 120,
        textAlignVertical: "top",
        lineHeight: FONT_SIZES.xlarge,
      },
      saveButton: {
        marginTop: SPACING.xlarge,
        backgroundColor: colors.primary,
        paddingVertical: SPACING.medium,
        borderRadius: SPACING.large,
        alignItems: "center",
        justifyContent: "center",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 12,
        shadowColor: colors.shadowColor,
        ...Platform.select({
          web: {
            cursor: 'pointer',
            boxShadow: '0px 6px 8px rgba(0,0,0,0.3)',
          }
        })
      },
      saveButtonText: {
        fontSize: FONT_SIZES.large,
        fontWeight: "bold",
        letterSpacing: 0.5,
        color: colors.activeFilterText,
      },
    }),
 // CommunityDetailScreen Styles (Adding settings button styles)
    communityDetailScreen: StyleSheet.create({
      scrollViewContent: {
        flexGrow: 1,
        padding: SPACING.medium,
        paddingBottom: BOTTOM_TAB_BAR_HEIGHT + SPACING.large,
        backgroundColor: colors.background,
      },
      loadingText: {
        marginTop: SPACING.medium,
        fontSize: FONT_SIZES.medium,
        color: colors.secondaryText,
        textAlign: 'center',
      },
      headerContainer: { // NEW: Container for title and settings button
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.medium,
      },
      communityLogo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: SPACING.medium,
        borderWidth: 2,
        borderColor: colors.borderColor,
        backgroundColor: colors.cardBackground,
      },
      header: {
        fontSize: FONT_SIZES.heading1,
        fontWeight: "bold",
        color: colors.text,
        flex: 1, // Allow text to take available space
        textAlign: 'center', // Center it within its flex space
      },
      settingsButton: { // NEW: Style for the settings icon button
        padding: SPACING.xsmall, // Padding around the icon
        // Position it if needed, but flex in headerContainer handles it
      },
      settingsIcon: { // NEW: Style for the icon color
        color: colors.primary, // Primary color for the icon
      },
      description: {
        fontSize: FONT_SIZES.medium,
        color: colors.secondaryText,
        marginBottom: SPACING.medium,
        textAlign: 'center',
      },
      creatorButtonsContainer: { // Existing, but will be removed from main view
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: SPACING.medium,
        paddingHorizontal: SPACING.small,
      },
      editButton: { // Existing, but will be used in EditCommunityScreen
        flex: 1,
        backgroundColor: colors.secondary,
        padding: SPACING.small,
        borderRadius: SPACING.small,
        alignItems: 'center',
        marginRight: SPACING.small,
      },
      editButtonText: {
        color: colors.textPrimary,
        fontWeight: 'bold',
        fontSize: FONT_SIZES.medium,
      },
      deleteButton: { // Existing, but will be used for actual delete logic
        flex: 1,
        backgroundColor: colors.error,
        padding: SPACING.small,
        borderRadius: SPACING.small,
        alignItems: 'center',
        marginLeft: SPACING.small,
      },
      deleteButtonText: {
        color: colors.activeFilterText,
        fontWeight: 'bold',
        fontSize: FONT_SIZES.medium,
      },
      joinButton: {
        backgroundColor: colors.primary,
        padding: SPACING.medium,
        borderRadius: SPACING.small,
        alignItems: "center",
        marginBottom: SPACING.medium,
      },
      joinButtonText: {
        color: colors.activeFilterText,
        fontWeight: "bold",
        fontSize: FONT_SIZES.large,
      },
      subHeader: {
        fontSize: FONT_SIZES.xlarge,
        fontWeight: "bold",
        color: colors.text,
        marginBottom: SPACING.small,
        marginTop: SPACING.medium,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderColor,
        paddingBottom: SPACING.xsmall,
      },
      groupChatItem: {
        padding: SPACING.medium,
        backgroundColor: colors.cardBackground,
        borderRadius: SPACING.small,
        marginBottom: SPACING.small,
        borderWidth: 1,
        borderColor: colors.borderColor,
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      },
      groupChatText: {
        fontSize: FONT_SIZES.medium,
        color: colors.text,
      },
      noGroupsText: {
        fontSize: FONT_SIZES.medium,
        color: colors.secondaryText,
        textAlign: "center",
        marginTop: SPACING.medium,
      },
      createGroupButton: {
        backgroundColor: colors.primary,
        padding: SPACING.medium,
        borderRadius: SPACING.small,
        alignItems: "center",
        marginTop: SPACING.large,
        marginBottom: SPACING.medium,
      },
      createGroupButtonText: {
        color: colors.activeFilterText,
        fontWeight: "bold",
        fontSize: FONT_SIZES.large,
      },
      flatListContent: {
        paddingBottom: SPACING.medium,
      },
    }),
   
     editCommunityScreen: StyleSheet.create({
      scrollViewContent: {
        flexGrow: 1,
        padding: SPACING.large,
        paddingBottom: BOTTOM_TAB_BAR_HEIGHT + SPACING.xxlarge, // Ensure space for bottom bar
        backgroundColor: colors.background, // Themed
      },
      header: {
        fontSize: FONT_SIZES.heading2,
        fontWeight: "bold",
        marginBottom: SPACING.medium,
        color: colors.text,
        textAlign: 'center',
      },
      logoContainer: {
        alignSelf: 'center',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.cardBackground,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.large,
        borderWidth: 2,
        borderColor: colors.borderColor,
        overflow: 'hidden',
      },
      logoImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
      },
      addLogoText: {
        color: colors.primary,
        fontSize: FONT_SIZES.medium,
        fontWeight: '600',
        marginTop: SPACING.small,
      },
      input: {
        height: 50,
        backgroundColor: colors.cardBackground,
        paddingHorizontal: SPACING.small,
        borderRadius: SPACING.small,
        marginBottom: SPACING.medium,
        borderWidth: 1,
        borderColor: colors.borderColor,
        fontSize: FONT_SIZES.medium,
        color: colors.text,
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      },
      textArea: {
        height: 100,
        textAlignVertical: "top",
      },
      saveButton: { // Renamed from createButton to saveButton for clarity
        backgroundColor: colors.primary,
        padding: SPACING.medium,
        alignItems: "center",
        borderRadius: SPACING.small,
        marginTop: SPACING.medium,
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 8,
      },
      saveButtonText: { // Renamed from createButtonText
        color: colors.activeFilterText,
        fontWeight: "bold",
        fontSize: FONT_SIZES.large,
      },
      loadingOverlayScreen: { // For full-screen loading on this screen
        ...StyleSheet.absoluteFillObject,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
      },
      loadingOverlayText: {
        marginTop: SPACING.medium,
        fontSize: FONT_SIZES.medium,
        color: colors.text,
      },
    }),
    
    // --- UserProfileScreen Styles (existing) ---
    userProfileScreen: StyleSheet.create({
      scrollViewContent: {
        flexGrow: 1,
        padding: SPACING.large,
        paddingBottom: SPACING.xxlarge,
        backgroundColor: colors.background,
        alignItems: "center",
      },
      profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: SPACING.large,
        borderWidth: 3,
        borderColor: colors.primary,
        backgroundColor: colors.cardBackground,
      },
      username: {
        fontSize: FONT_SIZES.heading2,
        fontWeight: "bold",
        marginBottom: SPACING.medium,
        color: colors.text,
      },
      sectionContainer: {
        width: "100%",
        alignItems: "center",
        marginTop: SPACING.medium,
        paddingHorizontal: SPACING.small,
      },
      sectionHeader: {
        fontSize: FONT_SIZES.large,
        fontWeight: "bold",
        marginBottom: SPACING.small,
        color: colors.text,
      },
      bioText: {
        fontSize: FONT_SIZES.medium,
        color: colors.secondaryText,
        textAlign: "center",
        marginBottom: SPACING.medium,
        lineHeight: FONT_SIZES.xlarge,
      },
      linkText: {
        color: colors.link,
        fontSize: FONT_SIZES.medium,
        textDecorationLine: "underline",
        marginTop: SPACING.xsmall,
      },
      errorText: {
        fontSize: FONT_SIZES.large,
        color: colors.error,
        textAlign: "center",
        marginBottom: SPACING.large,
      },
      loadingText: { 
        marginTop: SPACING.medium,
        fontSize: FONT_SIZES.medium,
        color: colors.secondaryText,
        textAlign: 'center',
      },
    }),
  };
};

export default createStyles;