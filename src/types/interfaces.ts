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


export interface MessageAttachment {
  type: string;
  payload: { url: string };
}

export interface MessagingEvent {
  sender: { id: string };
  recipient: { id: string };
  timestamp: number;
  message?: {
    mid: string;
    text?: string;
    attachments?: MessageAttachment[];
    is_echo?: boolean;
  };
  read?: {
    mid: string;
  };
}

export interface Entry {
  messaging?: MessagingEvent[];
  changes?: {
    field: string;
    value: {
      from: { id: string; username: string };
      media: { id: string };
      text: string;
    };
  }[];
  time: number;
}

export interface WebhookPayload {
  object: string;
  entry?: Entry[];
}

export type ParsedPayload =
  | {
      type: 'text_message';
      from: { username: string; id: string };
      to: { data: { username: string; id: string } };
      message: string;
      created_time: Date;
      id: string;
      is_echo?: boolean;
    }
  | {
      type: 'message_read';
      from: { username: string; id: string };
      to: { data: { username: string; id: string } };
      message: string;
      created_time: Date;
      id: string;
    }
  | {
      type: 'comment';
      commenterId: string;
      commenterUsername: string;
      mediaId: string;
      text: string;
      timestamp: number;
    }
  | {
      type: 'unknown_event';
      payload: WebhookPayload;
    };

