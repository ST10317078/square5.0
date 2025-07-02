export type RootStackParamList = {
    AuthScreen: undefined;
    CommunityScreen: undefined; // ✅ Add this
    CommunityDetailScreen: { community: Community };     CreateCommunityScreen: undefined; // ✅ Add this
    GroupChatScreen: { groupId: string; groupName: string; communityId: string }; // ✅ Add this
    ChatRoomScreen: { chatId: string; recipientId: string }; // <--- ADD recipientId here
    Community: undefined;
    VouchersScreen: undefined;
    ProfileScreen: undefined;
    UserProfileScreen: { userId: string };
    ChatScreen: undefined; // ✅ Ensure this exists
    EditCommunityScreen: { community: Community }
 
      Auth: undefined; // For the AuthScreen when not logged in
    BottomTabs: undefined; // For the BottomTabsNavigator
  
  };
  
  export type Community = {
    id: string;
    name: string;
    description?: string;
    createdBy: string;
    logo?: string;
    createdAt: Date; 
  };

  export type UserProfile = {
  id: string;
  username: string;
  profilePic?: string;
  description?: string;
};
  