// Registration API service
import { Platform } from "react-native";

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    error?: string;
    data?: T;
  }
  
  export interface RegistrationResponse {
    success: boolean;
    tenantCode: number;
    ownerUserId: number;
    password: string;
    ownerName: string;
    businessName: string;
  }
  
  class RegistrationApiService {
    private baseURL: string;
  
    constructor(baseURL?: string) {
      if (baseURL) {
        this.baseURL = baseURL;
      } else if (__DEV__) {
        // Use emulator/device-friendly IP
        this.baseURL = Platform.select({
          android: "http://10.0.2.2:5000/api", // Android Emulator
          ios: "http://localhost:5000/api",   // iOS Simulator
          default: "http://192.168.1.5:5000/api" // Replace with your LAN IP for real device
        })!;
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
        const timeoutId = setTimeout(() => controller.abort(), 10000);
  
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
  
        const data = await response.json();
        console.log('Response data:', data);
  
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
        console.error('Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          url: `${this.baseURL}${endpoint}`
        });
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Network error',
        };
      }
    }
  
    async registerTenant(data: {
      businessName: string;
      ownerName: string;
      mobile: string;
      email: string;
      licenseNo: string;
      password: string;
    }): Promise<ApiResponse<RegistrationResponse>> {
      return this.request<RegistrationResponse>('/auth/register-tenant', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  }
  
  export const registrationApiService = new RegistrationApiService();