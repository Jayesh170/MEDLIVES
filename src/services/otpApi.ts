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
    if (baseURL) {
      this.baseURL = baseURL;
    } else if (__DEV__) {
      // Use your computer's IP for mobile device testing with Expo Go
      this.baseURL = "http://10.21.92.158:5000/api";
    } else {
      this.baseURL = "https://your-production-server.com/api";
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      console.log('Making API request to:', url);

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
