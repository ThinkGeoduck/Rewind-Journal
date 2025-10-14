export interface EntryMedia {
  uri: string;
  type: 'audio' | 'video';
  duration?: number;
}

export interface Entry {
  id: string;
  title?: string;
  content: string;
  createdAt: Date;
  unlockDate: Date;
  isUnlocked: boolean;
  mediaUrls: string[];
}

export interface Response {
  id: string;
  entryId: string;
  content: string;
  createdAt: Date;
  mediaUrls: string[];
}

export interface User {
  id: string;
  name: string;
  age?: number;
  avatarUrl?: string;
  settings: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
} 