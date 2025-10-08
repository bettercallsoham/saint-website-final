import { API_CONFIG } from './api';

// Environment configuration
export const ENV_CONFIG = {
  // Development flags
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // API Configuration
  apiUrl: API_CONFIG.BASE_URL,
  externalApiUrl: import.meta.env.VITE_EXTERNAL_API_URL,
  
  // App Configuration
  appName: import.meta.env.VITE_APP_NAME || 'SAINT',
  appDescription: import.meta.env.VITE_APP_DESCRIPTION || 'Student Association of Information Technology',
  
  // Development Configuration
  devMode: import.meta.env.VITE_DEV_MODE === 'true',
  
  // Debug logging
  debug: import.meta.env.DEV && import.meta.env.VITE_DEV_MODE === 'true',
} as const;

// Connection health check
export const checkConnection = async (): Promise<{
  status: 'healthy' | 'unhealthy' | 'error';
  message: string;
  details?: any;
}> => {
  try {
    const response = await fetch(`${ENV_CONFIG.apiUrl}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Short timeout for health check
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      const health = await response.json();
      return {
        status: 'healthy',
        message: 'Backend connection is healthy',
        details: health,
      };
    } else {
      return {
        status: 'unhealthy',
        message: `Backend returned ${response.status}`,
        details: { status: response.status, statusText: response.statusText },
      };
    }
  } catch (error) {
    return {
      status: 'error',
      message: 'Unable to connect to backend',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Log environment info in development
if (ENV_CONFIG.debug) {
  console.log('🔧 Environment Configuration:', {
    isDevelopment: ENV_CONFIG.isDevelopment,
    apiUrl: ENV_CONFIG.apiUrl,
    appName: ENV_CONFIG.appName,
  });
}

export default ENV_CONFIG;