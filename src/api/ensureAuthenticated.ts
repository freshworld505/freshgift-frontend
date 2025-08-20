import axios from 'axios';
import { getAuth } from 'firebase/auth';

// Token caching
let cachedToken: string | null = null;
let tokenExpiration: number | null = null;

/**
 * Set auth token for API authorization with Bearer token format
 * @param token - JWT token to set for authorization
 */
export const setAuthToken = (token: string | null): void => {
  if (token) {
    // Apply Bearer token to every request
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    cachedToken = token;
    // Set token expiration to 50 minutes from now (assuming 1 hour token validity)
    tokenExpiration = Date.now() + (50 * 60 * 1000);
    console.log("✅ Bearer token set for API requests");
  } else {
    // Delete auth header if token is not available
    delete axios.defaults.headers.common['Authorization'];
    cachedToken = null;
    tokenExpiration = null;
    console.log("⚠️ Bearer token removed from API requests");
  }
};

/**
 * Check if current token is still valid
 * @returns boolean indicating if token is valid
 */
const isTokenValid = (): boolean => {
  return cachedToken !== null && tokenExpiration !== null && Date.now() < tokenExpiration;
};

/**
 * Generate JWT token for API authorization
 * @param userId - Firebase user ID
 * @returns Promise<string> - JWT token
 */
export const generateJwtToken = async (userId: string): Promise<string> => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/generatetoken`, { 
      firebaseId: userId 
    });
    
    if (response.data && response.data.jwt) {
      setAuthToken(response.data.jwt);
      console.log("✅ JWT token generated and set for API authorization");
      return response.data.jwt;
    } else {
      console.error("❌ Failed to generate JWT token:", response.data);
      throw new Error("Failed to generate JWT token");
    }
  } catch (error) {
    console.error("❌ Error generating JWT token:", error);
    throw error;
  }
};

/**
 * Get token for API calls with caching support
 * @returns Promise<string | null> - JWT token or null if not authenticated
 */
export const getTokenForApiCalls = async (): Promise<string | null> => {
  try {
    // Check if we have a valid cached token first
    if (isTokenValid()) {
      console.log("✅ Using cached JWT token");
      //console.log("Cached Token:", cachedToken);
      return cachedToken;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      const token = await generateJwtToken(user.uid);
      if (!token) {
        console.error("❌ Failed to generate token for API calls");
        throw new Error("Failed to generate token for API calls");
      }
      // Set the JWT token for API calls
      setAuthToken(token);
      console.log("✅ New JWT Token retrieved and set for API calls");
      return token;
    } else {
      console.log("⚠️ No user is signed in, cannot retrieve token");
      setAuthToken(null);
      return null;
    }
  } catch (error) {
    console.error("❌ Error retrieving token for API calls:", error);
    setAuthToken(null);
    throw error;
  }
};

/**
 * Ensure user is authenticated before making API calls
 * @returns Promise<boolean> - true if authenticated, false otherwise
 */
export const ensureAuthenticated = async (): Promise<boolean> => {
  try {
    // Check if we have a valid cached token first
    if (isTokenValid()) {
      console.log("✅ Using cached token for authentication");
      return true;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      // Only generate new token if cached one is invalid/expired
      const token = await generateJwtToken(user.uid);
      if (token) {
        setAuthToken(token);
        console.log("✅ New JWT Bearer token generated for authentication");
        return true;
      }
    }
    
    console.log("⚠️ User is not authenticated");
    return false;
  } catch (error) {
    console.error("❌ Failed to authenticate for API calls:", error);
    return false;
  }
};

/**
 * Get authorization headers with Bearer token
 * @returns Promise<object> - Headers object with Authorization Bearer token
 */
export const getAuthHeaders = async (): Promise<{ Authorization: string; 'Content-Type': string }> => {
  const token = await getTokenForApiCalls();
  if (!token) {
    throw new Error("No authentication token available");
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

/**
 * Wrapper function for authenticated API calls
 * @param apiCall - Function that makes the API call
 * @returns Promise<T> - Result of the API call
 */
export const withAuthentication = async <T>(
  apiCall: () => Promise<T>
): Promise<T> => {
  const isAuthenticated = await ensureAuthenticated();
  if (!isAuthenticated) {
    console.error("❌ User is not authenticated, cannot make API call");
  }
  
  return apiCall();
};

/**
 * Clear cached token and remove authorization header
 */
export const clearAuthToken = (): void => {
  setAuthToken(null);
  console.log("✅ Authentication token cleared");
};
