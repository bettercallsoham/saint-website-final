import { API_CONFIG } from '../config/api';

// Request/Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: string;
}

export interface ApiError {
  message: string;
  status: number;
  error?: string;
  details?: string;
}

// HTTP Methods
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

class ApiService {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.defaultHeaders = { ...API_CONFIG.HEADERS };
    this.defaultTimeout = API_CONFIG.TIMEOUT;
  }

  // Get authentication token from localStorage
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Set authentication token
  public setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  // Remove authentication token
  public removeAuthToken(): void {
    localStorage.removeItem('auth_token');
  }

  // Build headers with authentication if available
  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers = { ...this.defaultHeaders, ...customHeaders };
    
    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Make HTTP request
  private async makeRequest<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers: customHeaders,
      body,
      timeout = this.defaultTimeout,
    } = options;

    const url = `${this.baseURL}${endpoint}`;
    let headers = this.buildHeaders(customHeaders);

    // Handle FormData - don't set Content-Type, let browser handle it
    let requestBody: any = body;
    if (body instanceof FormData) {
      // Remove Content-Type header for FormData to let browser set boundary
      const { 'Content-Type': contentType, ...headersWithoutContentType } = headers;
      headers = headersWithoutContentType;
      requestBody = body;
    } else if (body) {
      requestBody = JSON.stringify(body);
    }

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: requestBody,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse response
      const responseData = await response.json();

      if (!response.ok) {
        throw {
          message: responseData.message || `HTTP Error: ${response.status}`,
          status: response.status,
          error: responseData.error,
          details: responseData.details,
        } as ApiError;
      }

      return responseData;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw {
            message: 'Request timeout',
            status: 408,
            error: 'TIMEOUT_ERROR',
          } as ApiError;
        }

        throw {
          message: error.message || 'Network error',
          status: 0,
          error: 'NETWORK_ERROR',
        } as ApiError;
      }

      // Re-throw ApiError
      throw error;
    }
  }

  // GET request
  public async get<T = any>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET', headers });
  }

  // POST request
  public async post<T = any>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'POST', body, headers });
  }

  // PUT request
  public async put<T = any>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'PUT', body, headers });
  }

  // DELETE request
  public async delete<T = any>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE', headers });
  }

  // PATCH request
  public async patch<T = any>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'PATCH', body, headers });
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;