import { Timestamp } from 'firebase/firestore';


export type RootStackParamList = {
    AuthScreen: undefined;
    CommunityScreen: undefined; // ✅ Add this
    CommunityDetailScreen: { community: Community };
    CreateCommunityScreen: undefined;
    GroupChatScreen: { groupId: string; groupName: string; communityId: string }; // ✅ Add this
    ChatRoomScreen: { chatId: string; recipientId: string }; // <--- ADD recipientId here
    Community: undefined;
    VouchersScreen: undefined;
    ProfileScreen: undefined;
    UserProfileScreen: { userId: string };
    ChatScreen: undefined; // ✅ Ensure this exists
    EditCommunityScreen: { community: Community }
    CreateGroupChatScreen: { communityId: string };
    GroupDetailsScreen: { groupId: string; groupName: string; communityId: string };

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
  
export interface Message { // Changed from type to interface and exported
  id: string;
  text?: string;
  senderId: string;
  sender: string; // Display name of the sender
  timestamp: Date | Timestamp; // Use the imported Timestamp
  senderProfilePic?: string; // URL to sender's profile picture
  mediaUrl?: string; // URL for image/video/file
  mediaType?: 'image' | 'video' | 'file'; // Type of media
  fileName?: string; // For file messages
  fileSize?: number; // For file messages
  uploading?: boolean; // For optimistic UI: true if currently uploading
  uploadProgress?: number; // 0-100%
  uploadError?: string; // Error message if upload fails
  tempId?: string; // Temporary ID for optimistic updates before Firestore provides real ID
}