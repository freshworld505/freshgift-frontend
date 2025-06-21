import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { User } from '@/lib/types';

// 🔄 Call your backend to sync and get user data
const fetchUserFromBackend = async (firebaseUser: FirebaseUser): Promise<User> => {
  try {
    const idToken = await firebaseUser.getIdToken();

    const res = await fetch('https://freshgiftbackend.onrender.com/api/auth/verify', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (!res.ok) throw new Error('Failed to sync user with backend');

    const data = await res.json();
    return data.user;
  } catch (error) {
    console.error('❌ Failed to fetch user from backend:', error);
    throw error;
  }
};

// 🔐 Signup with email/password
export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user: firebaseUser } = userCredential;

    // Set display name in Firebase Auth
    await updateProfile(firebaseUser, { displayName: name });

    // Fetch or create user in your backend
    return await fetchUserFromBackend(firebaseUser);
  } catch (error) {
    console.error('❌ Error signing up:', error);
    throw error;
  }
};

// 🔐 Sign in with email/password
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return await fetchUserFromBackend(userCredential.user);
  } catch (error) {
    console.error('❌ Error signing in:', error);
    throw error;
  }
};

// 🔐 Sign in with Google
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return await fetchUserFromBackend(userCredential.user);
  } catch (error) {
    console.error('❌ Error signing in with Google:', error);
    throw error;
  }
};

// 🚪 Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('❌ Error signing out:', error);
    throw error;
  }
};

// 🔄 Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('❌ Error sending reset email:', error);
    throw error;
  }
};

// ⚙️ Update profile (via backend – recommend implementing a new API route for this)
export const updateUserProfile = async (
  _userData: Partial<User>
): Promise<void> => {
  console.warn('updateUserProfile should be handled via backend API');
};

// 🔒 Change password
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) throw new Error('No authenticated user');

    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
    await reauthenticateWithCredential(currentUser, credential);
    await updatePassword(currentUser, newPassword);
  } catch (error) {
    console.error('❌ Error changing password:', error);
    throw error;
  }
};

// 🔁 Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const user = await fetchUserFromBackend(firebaseUser);
        callback(user);
      } catch (error) {
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

// 🔍 Get current user from Firebase and backend
export const getCurrentUser = async (): Promise<User | null> => {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) return null;

  try {
    return await fetchUserFromBackend(firebaseUser);
  } catch (error) {
    return null;
  }
};