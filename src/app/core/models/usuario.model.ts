export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  currency: string;
  theme: string;
  notificationsEnabled: boolean;
}

export interface UserProfileRequest {
  name: string;
  currency?: string;
}

export interface UserPreferencesRequest {
  notificationsEnabled?: boolean;
  theme?: string;
  currency?: string;
}
