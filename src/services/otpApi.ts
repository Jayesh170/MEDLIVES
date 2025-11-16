// OTP API service for Step2 component
import { Platform } from "react-native";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

class OtpApiService {
  private baseURL: string;

  constructor(baseURL?: string) {
    // Prefer env variable (configure via EXPO_PUBLIC_API_URL)
    // In Expo, EXPO_PUBLIC_* variables are available via process.env
    const envUrl = process.env.EXPO_PUBLIC_API_URL as string | undefined;
    
    console.log('=== OTP API Service Initialization ===');
    console.log('Environment variable EXPO_PUBLIC_API_URL:', envUrl);
    console.log('Platform:', Platform.OS);
    console.log('__DEV__:', __DEV__);
    
    if (baseURL) {
      this.baseURL = baseURL;
      console.log('Using provided baseURL:', this.baseURL);
    } else if (envUrl) {
      this.baseURL = envUrl.replace(/\/$/, '');
      console.log('✅ Using API URL from environment:', this.baseURL);
    } else if (__DEV__) {
      // Emulator-friendly defaults
      // Android emulator: 10.0.2.2 → host machine
      // iOS simulator: localhost
      this.baseURL = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';
      console.log('⚠️ Using default API URL for', Platform.OS, ':', this.baseURL);
      console.log('⚠️ WARNING: EXPO_PUBLIC_API_URL not found in environment!');
    } else {
      this.baseURL = 'https://your-production-server.com/api';
      console.log('Using production API URL:', this.baseURL);
    }
    console.log('Final baseURL:', this.baseURL);
    console.log('=====================================');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      console.log('=== OTP API REQUEST ===');
      console.log('Base URL:', this.baseURL);
      console.log('Full URL:', url);
      console.log('Environment variable:', process.env.EXPO_PUBLIC_API_URL);
      console.log('========================');

      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      console.log('Request config:', {
        method: config.method || 'GET',
        headers: config.headers,
        body: config.body
      });

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      let data: any;

      // Read response as text first to handle both JSON and non-JSON responses
      const responseText = await response.text();

      if (contentType && contentType.includes('application/json')) {
        try {
          data = JSON.parse(responseText);
          console.log('Response data:', data);
        } catch (jsonError) {
          // If JSON parsing fails, log the error
          console.error('Failed to parse JSON response:', responseText.substring(0, 200));
          return {
            success: false,
            error: `Invalid JSON response: ${response.status} ${response.statusText}`,
          };
        }
      } else {
        // Response is not JSON (likely HTML error page)
        console.error('Non-JSON response received:', responseText.substring(0, 200));
        return {
          success: false,
          error: `Server returned ${response.status} ${response.statusText}. Please check if the API endpoint is correct.`,
        };
      }

      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || `HTTP ${response.status}`,
        };
      }

      return {
        success: true,
        data,
        message: data.message,
      };
    } catch (error) {
      console.error('API request error:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        url: `${this.baseURL}${endpoint}`
      });
      
      // Handle specific error types for better user experience
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: 'Request timeout - please try again',
          };
        }
        if (error.message.includes('fetch')) {
          return {
            success: false,
            error: 'Network connection failed - please check your internet connection',
          };
        }
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async sendOtp(mobile: string): Promise<ApiResponse> {
    return this.request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile }),
    });
  }

  async verifyOtp(mobile: string, code: string): Promise<ApiResponse> {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile, code }),
    });
  }
}

export const otpApiService = new OtpApiService();
