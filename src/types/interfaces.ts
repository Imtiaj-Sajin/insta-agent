// src/types/interfaces.ts

export interface Message {
    from: { username: string; id: string };
    to: { data: { username: string; id: string }[] };
    message: string;
    created_time: string;
    id: string;
    attachments?: {
      data: {
        type?: string;
        image_data?: { url: string };
        video_data?: { width: number; height: number; url: string; preview_url: string };
      }[];
    };
}
  
export interface ParticipantDetails {
    id: string;
    name: string;
    username: string;
    profile_pic: string;
    is_verified_user: boolean;
    follower_count: number;
    is_user_follow_business: boolean;
    is_business_follow_user: boolean;
}
  
export interface Conversation {
    id: string;
    name: string;
    updated_time: string;
    last_message: string;
    participant_details: ParticipantDetails | null;
    status: string;
}

