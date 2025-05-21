
// Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "admin" | "user";
  lastLogin?: Date;
  twoFactorEnabled: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sessionExpiry: Date | null;
}

// Marketing Platform Types
export type PlatformType = "instantly" | "google" | "meta";

export interface BaseCampaignMetrics {
  id: string;
  name: string;
  platform: PlatformType;
  startDate: string;
  endDate: string | null;
  budget: number;
  spend: number;
  status: "active" | "paused" | "completed" | "draft";
}

// Instantly Data Types
export interface InstantlyCampaign extends BaseCampaignMetrics {
  platform: "instantly";
  emailsSent: number;
  emailsDelivered: number;
  emailsOpened: number;
  emailsClicked: number;
  emailsReplied: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
  bounceRate: number;
  conversations: number;
  meetings: number;
}

// Google Ads Data Types
export interface GoogleAdsCampaign extends BaseCampaignMetrics {
  platform: "google";
  impressions: number;
  clicks: number;
  ctr: number;
  averageCpc: number;
  conversions: number;
  conversionRate: number;
  costPerConversion: number;
  roas: number;
  quality_score: number;
  adGroups: number;
}

// Meta Ads Data Types
export interface MetaAdsCampaign extends BaseCampaignMetrics {
  platform: "meta";
  impressions: number;
  reach: number;
  frequency: number;
  clicks: number;
  ctr: number;
  cpm: number;
  cpc: number;
  conversions: number;
  costPerResult: number;
  engagement: number;
  relevanceScore: number;
}

// Combined Campaign Type
export type Campaign = InstantlyCampaign | GoogleAdsCampaign | MetaAdsCampaign;

// Dashboard Data Types
export interface DashboardMetrics {
  totalCampaigns: number;
  activeCampaigns: number;
  totalSpend: number;
  remainingBudget: number;
  averageROI: number;
  campaignPerformance: {
    instantly: {
      totalEmails: number;
      openRate: number;
      replyRate: number;
      meetings: number;
    };
    google: {
      impressions: number;
      clicks: number;
      conversions: number;
      cpa: number;
    };
    meta: {
      reach: number;
      engagement: number;
      conversions: number;
      cpm: number;
    };
  };
  recentCampaigns: Campaign[];
  performanceOverTime: {
    dates: string[];
    spend: number[];
    results: number[];
  }[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
