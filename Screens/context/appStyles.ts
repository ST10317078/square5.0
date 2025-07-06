// Screens/context/appStyles.ts
import { StyleSheet, Platform, Dimensions } from 'react-native';
import { ThemeColors } from './ThemeContext'; // Ensure this import path is correct

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
      errorText: { // Defined here in global for wider use
        color: colors.error,
        fontSize: FONT_SIZES.medium,
        marginBottom: SPACING.medium,
        textAlign: 'center',
      },
      loginPromptText: { // Defined here in global for wider use
        color: colors.primary,
        fontSize: FONT_SIZES.medium,
        textDecorationLine: 'underline',
      },
    }),

    createGroupChatScreen: StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: SPACING.large,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: FONT_SIZES.heading2,
    color: colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: SPACING.large,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.cardBackground,
    color: colors.textPrimary,
    borderRadius: 8,
    padding: SPACING.medium,
    marginBottom: SPACING.medium,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: SPACING.medium,
    alignItems: 'center',
  },
  createButtonText: {
    color: colors.buttonText,
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
  },
   button: {
  backgroundColor: colors.primary,
  borderRadius: 8,
  paddingVertical: SPACING.medium,
  paddingHorizontal: SPACING.large,
  alignItems: 'center',
  marginTop: SPACING.medium,
},
buttonText: {
  color: colors.buttonText,
  fontSize: FONT_SIZES.medium,
  fontWeight: '600',
},
}),

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
  headerContainer: {
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
    flex: 1,
    textAlign: 'center',
  },
  settingsButton: {
    padding: SPACING.xsmall,
  },
  settingsIcon: {
    color: colors.primary,
  },
  description: {
    fontSize: FONT_SIZES.medium,
    color: colors.secondaryText,
    marginBottom: SPACING.medium,
    textAlign: 'center',
  },
  creatorButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: SPACING.medium,
    paddingHorizontal: SPACING.small,
  },
  editButton: {
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
  deleteButton: {
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
    textAlign: "center",
    color: colors.secondaryText,
    marginTop: SPACING.large,
  },
  createGroupButton: {
    backgroundColor: colors.accent,
    paddingVertical: SPACING.medium,
    marginTop: SPACING.medium,
  },
  createGroupButtonText: {
    color: colors.activeFilterText,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  flatListContent: {
    paddingBottom: 150,
  },
}),
    communityScreen: StyleSheet.create({
      scrollView: {
        flex: 1,
        backgroundColor: colors.background,
      },
      scrollViewContent: {
        flexGrow: 1,
        paddingBottom: BOTTOM_TAB_BAR_HEIGHT + SPACING.large,
      },
      safeArea: {
        flex: 1,
        backgroundColor: colors.background,
      },
      listHeaderContainer: {
        backgroundColor: colors.background,
        paddingBottom: SPACING.medium,
      },
      headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.large,
        paddingHorizontal: SPACING.medium,
        paddingTop: SPACING.small,
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
        marginHorizontal: SPACING.medium,
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
        marginHorizontal: SPACING.medium,
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
      communityListRow: {
        justifyContent: "space-between",
        marginBottom: SPACING.small,
        paddingHorizontal: SPACING.medium,
      },
      communityCard: {
        flex: 1,
        margin: SPACING.small,
        padding: 15,
        backgroundColor: colors.cardBackground,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.borderColor,
        alignItems: "center",
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
      communityLogo: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: SPACING.xsmall,
        backgroundColor: colors.placeholder,
        borderWidth: 1,
        borderColor: colors.borderColor,
      },
      communityCardTitle: {
        fontSize: FONT_SIZES.medium + 1,
        fontWeight: "bold",
        color: colors.text,
        flexShrink: 1,
        textAlign: 'left',
        marginRight: SPACING.xsmall,
      },
      communityCardDescription: {
        fontSize: FONT_SIZES.xsmall + 1,
        color: colors.secondaryText,
        textAlign: 'center',
      },
      communityCardContent: {
        flex: 1,
        width: '100%',
        marginTop: SPACING.xsmall,
        alignItems: 'flex-start',
        paddingHorizontal: SPACING.small,
        justifyContent: 'center',
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
        marginHorizontal: SPACING.medium,
      },
      userAvatar: {
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
        flexShrink: 1,
        textAlign: 'left',
        marginRight: SPACING.xsmall,
      },
      lastMessagePreview: {
        fontSize: FONT_SIZES.small,
        color: colors.secondaryText,
        marginTop: SPACING.xsmall / 2,
        lineHeight: FONT_SIZES.medium,
        textAlign: 'left',
      },
      cardTimestamp: {
        fontSize: FONT_SIZES.xsmall,
        color: colors.secondaryText,
        marginLeft: 'auto',
        alignSelf: 'flex-end',
      },
      cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        width: '100%',
        marginBottom: SPACING.xsmall / 2,
      },
      userCardContent: {
        flex: 1,
        justifyContent: 'center',
      },
      userCardDescription: {
        fontSize: FONT_SIZES.small,
        color: colors.secondaryText,
        marginTop: SPACING.xsmall / 2,
        lineHeight: FONT_SIZES.medium,
      },
      noResultsText: {
        textAlign: "center",
        marginTop: SPACING.xlarge,
        fontSize: FONT_SIZES.medium,
        color: colors.secondaryText,
        paddingBottom: SPACING.large,
      },
      fab: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        right: SPACING.large,
        top: 'auto',
        bottom: BOTTOM_TAB_BAR_HEIGHT + SPACING.large,
        backgroundColor: colors.primary,
        borderRadius: 30,
        elevation: 20,
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        zIndex: 999,
      },
      fabText: {
        fontSize: FONT_SIZES.xxlarge,
        color: colors.activeFilterText,
        lineHeight: Platform.OS === 'ios' ? FONT_SIZES.xxlarge : FONT_SIZES.xxlarge + 5,
        fontWeight: 'bold',
      },
      listFooterContainer: {
        paddingVertical: SPACING.medium,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
      },
      noMoreItemsText: {
        fontSize: FONT_SIZES.small,
        color: colors.secondaryText,
        marginTop: SPACING.small,
      },
      flatListContentContainer: {
        paddingBottom: BOTTOM_TAB_BAR_HEIGHT + SPACING.large,
        backgroundColor: colors.background,
      },
      flatListStyle: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: SPACING.medium,
      },
    }),

    createCommunityScreen: StyleSheet.create({
      container: {
        flex: 1,
        padding: SPACING.large,
        backgroundColor: colors.background,
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
      saveButton: {
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
      saveButtonText: {
        color: colors.activeFilterText,
        fontWeight: "bold",
        fontSize: FONT_SIZES.large,
      },
      loadingOverlayScreen: {
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

  userprofileScreen: StyleSheet.create({ // Ensure this exact name (lowercase 'p')
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: SPACING.large,
    paddingBottom: BOTTOM_TAB_BAR_HEIGHT + SPACING.xxlarge, // Adjust as needed
  },
  loadingScreen: { // For initial loading state
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: { // For loading messages
    marginTop: SPACING.small,
    fontSize: FONT_SIZES.medium,
    fontWeight: 'bold',
    color: colors.textPrimary, // Use theme color
  },
  profileHeader: { // Container for profile image and username
    alignItems: 'center',
    marginBottom: SPACING.xlarge,
    marginTop: SPACING.large,
  },
  profileImage: { // For the profile picture itself
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.placeholder, // Placeholder background color
    marginBottom: SPACING.medium,
    borderWidth: 2,
    borderColor: colors.border, // Border around the profile pic
  },
  username: { // For the username display
    fontSize: FONT_SIZES.heading2, // A larger font size for the username
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: SPACING.small,
  },
  sectionContainer: { // For sections like "About Me" or "Social Link"
    marginBottom: SPACING.large,
    padding: SPACING.medium,
    backgroundColor: colors.cardBackground, // Background for the section card
    borderRadius: SPACING.medium,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: { // For titles of sections (e.g., "About Me")
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: SPACING.small,
  },
  bioText: { // For the "About Me" text
    fontSize: FONT_SIZES.medium,
    color: colors.textPrimary,
    lineHeight: FONT_SIZES.xlarge, // Adjust line height for readability
  },
  linkText: { // For social links
    fontSize: FONT_SIZES.medium,
    color: colors.primary, // Primary color for links
    textDecorationLine: 'underline',
  },
  chatButton: { // For the "Chat" button
    backgroundColor: colors.primary,
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.large,
    borderRadius: SPACING.large,
    alignItems: 'center',
    marginTop: SPACING.large,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  chatButtonText: {
    color: colors.buttonText,
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
  },
  errorText: {
  color: colors.error, // Uses the 'error' color from your theme
  fontSize: FONT_SIZES.medium,
  marginBottom: SPACING.medium,
  textAlign: 'center',
},
  noProfileText: {
    fontSize: FONT_SIZES.medium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xlarge,
  },
}),

    profileScreen: StyleSheet.create({
      safeArea: {
        flex: 1,
        backgroundColor: colors.background,
      },
      scrollViewContent: {
        flexGrow: 1,
        padding: SPACING.large,
        paddingBottom: BOTTOM_TAB_BAR_HEIGHT + SPACING.xxlarge,
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
    groupChatScreen: StyleSheet.create({
      safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
        attachmentButton: {
        padding: SPACING.small,
        borderRadius: SPACING.medium,
        backgroundColor: colors.primaryLight,
        marginRight: SPACING.small,
        alignItems: 'center',
        justifyContent: 'center',
      },
      attachmentButtonText: {
        fontSize: FONT_SIZES.large,
      },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
    marginBottom: SPACING.small,
  },
  backButton: {
    padding: SPACING.xsmall,
    marginRight: SPACING.small,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.small,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatarFallback: {
    backgroundColor: colors.primary,
  },
  headerAvatarFallbackText: {
    color: colors.buttonText,
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: colors.textPrimary,
    flex: 1,
  },
  groupDetailsButton: {
    padding: SPACING.xsmall,
    marginLeft: SPACING.small,
  },
  messageScrollView: {
    flex: 1,
  },
  messageList: {
    flexGrow: 1,
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.small,
    paddingBottom: SPACING.xlarge * 2, // Adjust as needed for input area
  },
  messageBubbleWrapper: { // Wrapper for avatar + message bubble
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: SPACING.small,
    maxWidth: '85%', // Limits combined width of avatar + message
  },
  myMessageBubbleWrapper: {
    alignSelf: 'flex-end', // Align own messages to the right
    justifyContent: 'flex-end', // Pushes avatar to right if on that side
  },
  otherMessageBubbleWrapper: {
    alignSelf: 'flex-start', // Align other messages to the left
    justifyContent: 'flex-start', // Pushes avatar to left
  },
  messageAvatar: { // Avatar next to messages
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: SPACING.small,
    backgroundColor: colors.placeholder, // Fallback
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageAvatarFallback: { // Styles for the fallback avatar (initials)
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageAvatarFallbackText: {
    color: colors.buttonText,
    fontSize: FONT_SIZES.small,
    fontWeight: 'bold',
  },
  messageContainer: { // The actual message bubble content container
    padding: SPACING.small,
    borderRadius: 12,
    flexShrink: 1, // Allows bubble to shrink
  },
  myMessageContainer: {
    backgroundColor: colors.primary, // Primary color for own messages
    borderBottomRightRadius: 2, // Slight adjustment for chat bubble tail
  },
  otherMessageContainer: {
    backgroundColor: colors.cardBackground, // Card background for others' messages
    borderBottomLeftRadius: 2, // Slight adjustment for chat bubble tail
  },
  sender: { // Sender name above message
    fontWeight: "bold",
    color: colors.textSecondary,
    marginBottom: SPACING.small,
  },
  message: { // Text within the message bubble
    fontSize: FONT_SIZES.medium,
    color: colors.textPrimary,
  },
  myMessageText: { // Text color for own messages
    color: colors.buttonText,
  },
  timestamp: { // Timestamp text
    fontSize: FONT_SIZES.xsmall,
    color: colors.textSecondary,
    marginTop: SPACING.small,
    alignSelf: 'flex-end', // Align timestamp to the right within the bubble
  },

  // Media and File specific styles
  mediaMessageImage: {
    width: Dimensions.get('window').width * 0.6, // Adjust width as needed
    height: Dimensions.get('window').width * 0.45, // Maintain aspect ratio
    borderRadius: SPACING.medium,
    marginBottom: SPACING.xsmall,
    resizeMode: 'cover',
  },
  videoMessageContainer: {
    position: 'relative',
    borderRadius: SPACING.medium,
    overflow: 'hidden', // Ensures video thumbnail doesn't overflow
  },
  videoPlayText: {
    color: colors.buttonText,
    fontSize: FONT_SIZES.medium,
    textAlign: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)', // Dark overlay
    borderRadius: SPACING.medium,
  },
  fileMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.small,
    backgroundColor: colors.background, // Background for file bubble
    borderRadius: SPACING.medium,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fileIcon: { // Icon for file messages (e.g., from Ionicons)
    marginRight: SPACING.small,
  },
  fileDetails: { // Container for file name and size
    flex: 1,
  },
  fileNameText: {
    fontSize: FONT_SIZES.medium,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  fileSizeText: {
    fontSize: FONT_SIZES.small,
    color: colors.textSecondary,
  },

  // Upload progress indicators
  uploadProgressBarContainer: {
    width: '100%',
    height: SPACING.xsmall, // Thin progress bar
    backgroundColor: colors.borderColor,
    borderRadius: SPACING.xsmall / 2,
    overflow: 'hidden',
    marginTop: SPACING.xsmall,
  },
  uploadProgressBar: {
    height: '100%',
    backgroundColor: colors.primary, // Progress bar color
    borderRadius: SPACING.xsmall / 2,
  },
  uploadProgressText: {
    fontSize: FONT_SIZES.xsmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xsmall / 2,
  },
  messageErrorBubble: { // Style for messages that failed to upload
    backgroundColor: colors.error + '33', // Lighter error color with transparency
    borderColor: colors.error,
    borderWidth: 1,
  },
  uploadErrorText: {
    fontSize: FONT_SIZES.small,
    color: colors.error,
    marginTop: SPACING.xsmall,
  },

  // Input area styles
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.medium,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: { // Main text input field
    flex: 1,
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
    borderWidth: 1,
    borderRadius: 20, // Rounded corners
    borderColor: colors.border,
    color: colors.textPrimary,
    backgroundColor: colors.cardBackground, // Input field background
  },
  sendButton: { // Send button
    marginLeft: SPACING.small,
    backgroundColor: colors.primary,
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: colors.buttonText,
    fontWeight: "bold",
  },

  // Attachment options container (popping up above input)
  attachmentOptionsContainer: {
    position: 'absolute',
    bottom: '100%', // Position directly above inputContainer
    width: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.surface, // Background for the options tray
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingVertical: SPACING.small,
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow buttons to wrap if needed
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: SPACING.small,
    zIndex: 1, // Ensure it's above message list
    minHeight: 60,
  },
  attachmentOptionButton: { // Style for individual buttons within attachmentOptionsContainer
    padding: SPACING.small,
    borderRadius: SPACING.medium,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: SPACING.xsmall,
  },
  attachmentOptionButtonText: { // Text style for individual buttons
    fontSize: FONT_SIZES.medium,
    color: colors.textPrimary,
  },
  mediaUploadIndicator: { // For when media is uploading
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
    backgroundColor: colors.surface,
    borderRadius: SPACING.large,
    flex: 1,
  },
  mediaUploadText: {
    marginLeft: SPACING.small,
    color: colors.textSecondary,
    fontSize: FONT_SIZES.medium,
  },

  // Join Group Prompt (existing)
  joinPromptText: {
    fontSize: FONT_SIZES.medium,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.medium,
  },
  joinButton: {
    backgroundColor: colors.primary,
    padding: SPACING.medium,
    borderRadius: SPACING.small,
    alignItems: "center",
    marginBottom: SPACING.medium,
  },
  joinButtonText: {
    color: colors.buttonText,
    fontWeight: "bold",
    fontSize: FONT_SIZES.large,
  },
    }),

    groupDetailsScreen: StyleSheet.create({ // New style object for GroupDetailsScreen
      safeArea: {
        flex: 1,
        backgroundColor: colors.background,
      },
      scrollViewContent: {
        flexGrow: 1,
        padding: SPACING.medium,
        paddingBottom: SPACING.xxlarge,
      },
      headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: SPACING.medium,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        marginBottom: SPACING.large,
      },
      backButton: {
        padding: SPACING.xsmall,
        marginRight: SPACING.medium,
      },
      headerTitle: {
        fontSize: FONT_SIZES.heading3, // Smaller heading for detail screen
        fontWeight: 'bold',
        color: colors.textPrimary,
        flex: 1,
        textAlign: 'center',
      },
      editButton: {
        padding: SPACING.xsmall,
        marginLeft: SPACING.medium,
      },
      editButtonsContainer: {
        flexDirection: 'row',
        marginLeft: SPACING.medium,
      },
      saveButton: {
        backgroundColor: colors.primary,
        padding: SPACING.small,
        borderRadius: SPACING.small,
        alignItems: 'center',
        justifyContent: 'center',
      },
      cancelButton: {
        backgroundColor: colors.error,
        padding: SPACING.small,
        borderRadius: SPACING.small,
        alignItems: 'center',
        justifyContent: 'center',
      },
      detailSection: {
        marginBottom: SPACING.large,
        backgroundColor: colors.cardBackground,
        padding: SPACING.medium,
        borderRadius: SPACING.medium,
        borderWidth: 1,
        borderColor: colors.borderColor,
      },
      label: {
        fontSize: FONT_SIZES.medium,
        fontWeight: 'bold',
        color: colors.textSecondary,
        marginBottom: SPACING.small,
      },
      valueText: {
        fontSize: FONT_SIZES.large,
        color: colors.textPrimary,
      },
      input: {
        fontSize: FONT_SIZES.large,
        color: colors.textPrimary,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: SPACING.small,
        padding: SPACING.small,
        backgroundColor: colors.cardBackground,
      },
      descriptionInput: {
        minHeight: 100,
        textAlignVertical: 'top',
      },
      membersList: {
        marginTop: SPACING.small,
      },
      memberItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.small,
        paddingVertical: SPACING.xsmall,
        paddingHorizontal: SPACING.small,
        backgroundColor: colors.background,
        borderRadius: SPACING.small,
      },
      memberAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: SPACING.medium,
        backgroundColor: colors.placeholder,
        justifyContent: 'center',
        alignItems: 'center',
      },
      memberAvatarFallback: {
        backgroundColor: colors.secondary,
      },
      memberAvatarFallbackText: {
        color: colors.buttonText,
        fontSize: FONT_SIZES.medium,
        fontWeight: 'bold',
      },
      memberName: {
        fontSize: FONT_SIZES.medium,
        color: colors.textPrimary,
        fontWeight: '500',
      },
    }),
    chatRoomScreen: StyleSheet.create({ // Single, correct definition for chatRoomScreen
      container: {
        flex: 1,
        backgroundColor: colors.background,
      },
      headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.medium,
        paddingHorizontal: SPACING.large,
        backgroundColor: colors.primary,
        paddingTop: Platform.OS === 'android' ? SPACING.large : SPACING.xxlarge,
      },
      backButton: {
        paddingHorizontal: SPACING.small,
        paddingVertical: SPACING.small,
        marginRight: SPACING.medium,
      },
      backButtonText: {
        color: colors.activeFilterText,
        fontSize: FONT_SIZES.xxlarge,
        fontWeight: 'bold',
      },
      recipientProfilePic: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: SPACING.small,
        borderWidth: 1,
        borderColor: colors.activeFilterText,
      },
      headerTitle: {
        color: colors.activeFilterText,
        fontSize: FONT_SIZES.large,
        fontWeight: 'bold',
        flex: 1,
      },
      messagesList: {
        paddingVertical: SPACING.small,
        paddingHorizontal: SPACING.medium,
      },
      messageBubble: {
        padding: SPACING.small,
        borderRadius: SPACING.medium,
        marginBottom: SPACING.small,
        maxWidth: '80%',
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
      },
      myMessageBubble: {
        alignSelf: 'flex-end',
        backgroundColor: colors.primaryLight,
        borderBottomRightRadius: SPACING.xsmall,
      },
      otherMessageBubble: {
        alignSelf: 'flex-start',
        backgroundColor: colors.cardBackground,
        borderBottomLeftRadius: SPACING.xsmall,
      },
      myMessageText: {
        color: colors.text,
        fontSize: FONT_SIZES.medium,
      },
      otherMessageText: {
        color: colors.text,
        fontSize: FONT_SIZES.medium,
      },
      timestampText: {
        fontSize: FONT_SIZES.xsmall,
        color: colors.secondaryText,
        alignSelf: 'flex-end',
        marginTop: SPACING.xsmall / 2,
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.small,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderColor: colors.borderColor,
      },
      textInput: {
        flex: 1,
        maxHeight: 100,
        backgroundColor: colors.background,
        borderRadius: SPACING.xlarge,
        paddingHorizontal: SPACING.medium,
        paddingVertical: SPACING.small,
        marginRight: SPACING.small,
        fontSize: FONT_SIZES.medium,
        color: colors.text,
        borderWidth: 1,
        borderColor: colors.borderColor,
      },
      sendButton: {
        backgroundColor: colors.primary,
        borderRadius: SPACING.xlarge,
        paddingVertical: SPACING.medium - 2,
        paddingHorizontal: SPACING.large,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      sendButtonText: {
        color: colors.activeFilterText,
        fontWeight: 'bold',
        fontSize: FONT_SIZES.medium,
      },
      attachmentButton: {
        padding: SPACING.small,
        borderRadius: SPACING.medium,
        backgroundColor: colors.primaryLight,
        marginRight: SPACING.small,
        alignItems: 'center',
        justifyContent: 'center',
      },
      attachmentButtonText: {
        fontSize: FONT_SIZES.large,
      },
      emojiButton: {
        padding: SPACING.small,
        borderRadius: SPACING.medium,
        backgroundColor: colors.primaryLight,
        marginRight: SPACING.small,
        alignItems: 'center',
        justifyContent: 'center',
      },
      emojiButtonText: {
        fontSize: FONT_SIZES.large,
      },
      mediaMessageImage: {
        width: Dimensions.get('window').width * 0.6,
        height: Dimensions.get('window').width * 0.45,
        borderRadius: SPACING.medium,
        marginBottom: SPACING.xsmall,
        resizeMode: 'cover',
      },
      videoMessageContainer: {
        position: 'relative',
        borderRadius: SPACING.medium,
        overflow: 'hidden',
      },
      videoPlayText: {
        color: colors.activeFilterText,
        fontSize: FONT_SIZES.small,
        textAlign: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: SPACING.medium,
      },
      mediaUploadIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.small,
        paddingHorizontal: SPACING.medium,
        backgroundColor: colors.surface,
        borderRadius: SPACING.large,
        flex: 1,
      },
      mediaUploadText: {
        marginLeft: SPACING.small,
        color: colors.textSecondary,
        fontSize: FONT_SIZES.medium,
      },
      emojiPickerContainer: {
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderColor: colors.borderColor,
        height: 200,
        padding: SPACING.small,
      },
      emojiListContent: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      emojiItem: {
        padding: SPACING.xsmall,
        margin: SPACING.xsmall,
        borderRadius: SPACING.small,
        backgroundColor: colors.background,
      },
      emojiText: {
        fontSize: FONT_SIZES.xxlarge,
      },
      fileMessageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.small,
        backgroundColor: colors.background,
        borderRadius: SPACING.medium,
        borderWidth: 1,
        borderColor: colors.borderColor,
      },
      fileIcon: {
        fontSize: FONT_SIZES.xxlarge,
        marginRight: SPACING.small,
      },
      fileDetails: {
        flex: 1,
      },
      fileNameText: {
        fontSize: FONT_SIZES.medium,
        fontWeight: 'bold',
        color: colors.text,
      },
      fileSizeText: {
        fontSize: FONT_SIZES.small,
        color: colors.secondaryText,
      },
      uploadProgressBarContainer: {
        width: '100%',
        height: SPACING.small,
        backgroundColor: colors.borderColor,
        borderRadius: SPACING.small / 2,
        overflow: 'hidden',
        marginTop: SPACING.xsmall,
      },
      uploadProgressBar: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: SPACING.small / 2,
      },
      uploadProgressText: {
        fontSize: FONT_SIZES.xsmall,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: SPACING.xsmall / 2,
      },
      messageErrorBubble: {
        backgroundColor: colors.error + '33',
        borderColor: colors.error,
        borderWidth: 1,
      },
      uploadErrorText: {
        fontSize: FONT_SIZES.small,
        color: colors.error,
        marginTop: SPACING.xsmall,
      },
      attachmentOptionsContainer: {
        position: 'absolute',
        bottom: '100%',
        width: '100%',
        left: 0,
        right: 0,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderColor: colors.borderColor,
        paddingVertical: SPACING.small,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: SPACING.small,
        zIndex: 1,
        minHeight: 60,
      },
      attachmentOptionButton: {
        padding: SPACING.small,
        borderRadius: SPACING.medium,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.borderColor,
        marginHorizontal: SPACING.xsmall,
      },
      attachmentOptionButtonText: {
        fontSize: FONT_SIZES.medium,
        color: colors.text,
      },
    }),
  };
};

export default createStyles;