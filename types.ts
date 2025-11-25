import React from 'react';

export type AccountType = 'personal' | 'professional';

export type VerificationType = 'none' | 'black' | 'blue' | 'golden';
export type VerificationStatus = 'none' | 'pending' | 'rejected' | 'approved';

export interface User {
  id: string;
  username: string;
  avatar: string;
  name: string;
  bio?: string;
  accountType: AccountType;
  category?: string;
  followers: number;
  verificationType: VerificationType;
  verificationStatus: VerificationStatus;
  isAdmin?: boolean;
  walletBalance: number; // Available to withdraw
  totalEarnings: number; // Lifetime earnings
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: number;
}

export interface Post {
  id: string;
  type: 'image' | 'video';
  url: string;
  user: User;
  caption: string;
  likes: number;
  views: number;
  comments: Comment[];
  timestamp: number;
  isLiked?: boolean;
}

export interface NavItem {
  icon: React.FC<any>;
  label: string;
  id: string;
}

export type View = 'home' | 'reels' | 'create' | 'search' | 'profile' | 'admin';