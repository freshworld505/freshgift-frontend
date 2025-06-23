import axios from 'axios';
import { getAuth } from 'firebase/auth';

// Token caching
let cachedToken: string | null = null;
let tokenExpiration: number | null = null;

// Set auth token for API authorization
export const setAuthToken = (token: string | null) => {
  if (token) {
    // Apply token to every request if available
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    cachedToken = token;
    console.log("✅ Auth token set for API requests");
    // Set token expiration to 50 minutes from now (assuming 1 hour token validity)
    tokenExpiration = Date.now() + (50 * 60 * 1000);
  } else {
    // Delete auth header if token is not available
    delete axios.defaults.headers.common['Authorization'];
    cachedToken = null;
    tokenExpiration = null;
    console.log("⚠️ Auth token removed from API requests");
  }
}

// Check if current token is still valid
const isTokenValid = (): boolean => {
  console.log("Checking if token is valid...");
  return cachedToken !== null && tokenExpiration !== null && Date.now() < tokenExpiration;
}

// Generate jwt token for API authorization
export const generateJwtToken = async (userId: string): Promise<string> => {
  try {
    const response = await axios.post(`https://freshgiftbackend.onrender.com/api/auth/generatetoken`, { firebaseId: userId });
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
}

// get token for me to use in API calls
export const getTokenForApiCalls = async (): Promise<string | null> => {
  try {
    // Check if we have a valid cached token first
    if (isTokenValid()) {
      console.log("✅ Using cached JWT token");
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
}

// Helper function to ensure authentication before API calls
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
      setAuthToken(token);
      console.log("✅ New JWT token generated for authentication");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to get JWT token:", error);
    return false;
  }
};
