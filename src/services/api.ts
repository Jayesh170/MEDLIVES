import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    userId: number;
    tenantCode: number;
    role: string;
    name: string;
    businessName: string;
  };
}

export interface OtpResponse {
  success: boolean;
  message: string;
  mobile: string;
}

export interface TenantRegistrationResponse {
  success: boolean;
  message: string;
  tenantCode: number;
  ownerUserId: number;
  businessName: string;
  ownerName: string;
  loginCredentials: {
    tenantCode: number;
    userId: number;
    password: string;
  };
}

// API Service Class
class ApiService {
  private baseURL: string;

  constructor(baseURL?: string) {
    // Prefer env variable (configure via EXPO_PUBLIC_API_URL)
    const envUrl = (process as any)?.env?.EXPO_PUBLIC_API_URL as string | undefined;
    if (baseURL) {
      this.baseURL = baseURL;
    } else if (envUrl) {
      this.baseURL = envUrl.replace(/\/$/, '');
    } else if (__DEV__) {
      // Emulator-friendly defaults
      // Android emulator: 10.0.2.2 → host machine
      // iOS simulator: localhost
      this.baseURL = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';
    } else {
      this.baseURL = 'https://your-production-server.com/api';
    }
  }

  // Allow changing base URL at runtime if needed
  setBaseURL(url: string) {
    this.baseURL = url.replace(/\/$/, '');
  }

  // Get auth token from storage
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  // Set auth token in storage
  private async setAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Error setting auth token:', error);
    }
  }

  // Remove auth token from storage
  private async removeAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error removing auth token:', error);
    }
  }

  // Generic API request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = await this.getAuthToken();
      const url = `${this.baseURL}${endpoint}`;

      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}`,
        };
      }

      return {
        success: true,
        data,
        message: data.message,
      };
    } catch (error) {
      console.error('API request error:', error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timeout - please check your internet connection',
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Auth Methods
  async sendOtp(mobile: string): Promise<ApiResponse<OtpResponse>> {
    return this.request<OtpResponse>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile }),
    });
  }

  async verifyOtp(mobile: string, code: string): Promise<ApiResponse<OtpResponse>> {
    return this.request<OtpResponse>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile, code }),
    });
  }

  async registerTenant(data: {
    businessName: string;
    ownerName: string;
    mobile: string;
    email: string;
    licenseNo: string;
    password: string;
  }): Promise<ApiResponse<TenantRegistrationResponse>> {
    return this.request<TenantRegistrationResponse>('/auth/register-tenant', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(userId: number, password: string): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ userId, password }),
    });

    if (response.success && response.data?.token) {
      await this.setAuthToken(response.data.token);
      // Store user info for later use
      if (response.data.user) {
        await this.storeUserInfo(response.data.user);
      }
    }

    return response;
  }

  async logout(): Promise<void> {
    await this.removeAuthToken();
  }

  // User Methods
  async getUserProfile(): Promise<ApiResponse> {
    return this.request('/users/profile');
  }

  async updateUserProfile(data: { name?: string; email?: string }): Promise<ApiResponse> {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    return this.request('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async getUsers(): Promise<ApiResponse> {
    return this.request('/users');
  }

  async addUser(data: {
    name: string;
    mobile: string;
    email: string;
    role: string;
    password: string;
  }): Promise<ApiResponse> {
    return this.request('/users/add', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(userId: number): Promise<ApiResponse> {
    return this.request(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAuthToken();
    return !!token;
  }

  // Get current user info
  async getCurrentUser(): Promise<any> {
    try {
      const token = await this.getAuthToken();
      if (!token) return null;

      const response = await this.getUserProfile();
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Store user info in AsyncStorage
  async storeUserInfo(userInfo: any): Promise<void> {
    try {
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
    } catch (error) {
      console.error('Error storing user info:', error);
    }
  }

  // Get stored user info
  async getStoredUserInfo(): Promise<any> {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error('Error getting stored user info:', error);
      return null;
    }
  }

  // Orders Methods
  async getOrders(params?: {
    date?: string; // dd/MM/yy
    status?: 'all' | 'paid' | 'credit' | 'pending';
    q?: string;
  }): Promise<ApiResponse> {
    const qs = params
      ? '?' +
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== null && v !== '')
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
          .join('&')
      : '';
    return this.request(`/orders${qs}`);
  }

  async createOrder(order: any): Promise<ApiResponse> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();

