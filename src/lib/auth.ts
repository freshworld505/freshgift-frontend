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
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { User } from '@/lib/types';

// Convert Firebase User to our User type
export const mapFirebaseUserToUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  try {
    // Get additional user data from Firestore
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data();

    const now = new Date();
    const newUser: User = {
      userId: firebaseUser.uid,
      name: firebaseUser.displayName || userData?.name || '',
      email: firebaseUser.email!,
      profilePicture: firebaseUser.photoURL || userData?.imageUrl || '',
      role: userData?.role || 'user',
      createdAt: userData?.createdAt || now,
      updatedAt: now,
      firebaseId: firebaseUser.uid,
      addresses: userData?.addresses || [],
      wishlist: userData?.wishlist || [],
    };
    
    return newUser;
  } catch (error) {
    console.warn('Failed to fetch user data from Firestore, using basic Firebase user data:', error);
    // If Firestore fails, return basic user data from Firebase Auth
    const now = new Date();
    const newUser: User = {
      userId: firebaseUser.uid,
      name: firebaseUser.displayName || '',
      email: firebaseUser.email!,
      profilePicture: firebaseUser.photoURL || '',
      role: 'user',
      createdAt: now,
      updatedAt: now,
      firebaseId: firebaseUser.uid,
      addresses: [],
      wishlist: [],
    };
    
    return newUser;
  }
};

// Sign up with email and password
export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user: firebaseUser } = userCredential;

    // Update the user's display name
    await updateProfile(firebaseUser, {
      displayName: name,
    });

    // Create user document in Firestore
    const userData = {
      name,
      email,
      createdAt: new Date(),
      addresses: [],
      wishlist: [],
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), userData);

    const now = new Date();
    const newUser: User = {
      userId: firebaseUser.uid,
      name: name,
      email: firebaseUser.email!,
      profilePicture: '',
      role: 'user',
      createdAt: now,
      updatedAt: now,
      firebaseId: firebaseUser.uid,
      addresses: [],
      wishlist: [],
    };
    
    return newUser;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

// Sign in with email and password
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return await mapFirebaseUserToUser(userCredential.user);
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const { user: firebaseUser } = userCredential;

    // Check if this is a new user and create Firestore document if needed
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    
    try {
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        const userData = {
          name: firebaseUser.displayName || '',
          email: firebaseUser.email!,
          imageUrl: firebaseUser.photoURL || '',
          createdAt: new Date(),
          addresses: [],
          wishlist: [],
        };
        await setDoc(userDocRef, userData);
      }
    } catch (firestoreError) {
      console.warn('Firestore operation failed, proceeding with basic user data:', firestoreError);
      // If Firestore fails, we can still return a basic user object
      const now = new Date();
      const newUser: User = {
        userId: firebaseUser.uid,
        name: firebaseUser.displayName || '',
        email: firebaseUser.email!,
        profilePicture: firebaseUser.photoURL || '',
        role: 'user',
        createdAt: now,
        updatedAt: now,
        firebaseId: firebaseUser.uid,
        addresses: [],
        wishlist: [],
      };
      return newUser;
    }

    return await mapFirebaseUserToUser(firebaseUser);
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (
  userData: Partial<User>
): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('No authenticated user');

    // Update Firebase Auth profile
    if (userData.name) {
      await updateProfile(currentUser, {
        displayName: userData.name,
      });
    }

    // Update Firestore document
    const userDocRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userDocRef, {
      ...userData,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Change password
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) throw new Error('No authenticated user');

    // Re-authenticate user before changing password
    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
    await reauthenticateWithCredential(currentUser, credential);

    // Update password
    await updatePassword(currentUser, newPassword);
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const user = await mapFirebaseUserToUser(firebaseUser);
        callback(user);
      } catch (error) {
        console.error('Error mapping Firebase user:', error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

// Helper function to get current user
export const getCurrentUser = async (): Promise<User | null> => {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) return null;
  
  try {
    return await mapFirebaseUserToUser(firebaseUser);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};
