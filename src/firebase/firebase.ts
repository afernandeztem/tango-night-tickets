
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  OAuthProvider,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  UserCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { firebaseConfig } from './config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Google provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Apple provider
const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

// Sign in with Google
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    return signInWithPopup(auth, googleProvider);
  } catch (error: any) {
    console.error('Google login error:', error);
    
    // Check for unauthorized domain error
    if (error.code === 'auth/unauthorized-domain') {
      throw new Error('This domain is not authorized for Firebase authentication. Please add it to your Firebase console under Authentication > Sign-in method > Authorized domains.');
    }
    
    throw error;
  }
};

// Sign in with Apple
export const signInWithApple = async (): Promise<UserCredential> => {
  try {
    return signInWithPopup(auth, appleProvider);
  } catch (error: any) {
    console.error('Apple login error:', error);
    
    // Check for unauthorized domain error
    if (error.code === 'auth/unauthorized-domain') {
      throw new Error('This domain is not authorized for Firebase authentication. Please add it to your Firebase console under Authentication > Sign-in method > Authorized domains.');
    }
    
    throw error;
  }
};

// Sign out
export const signOut = async (): Promise<void> => {
  return firebaseSignOut(auth);
};

// Get current user
export const getCurrentFirebaseUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

// Email/password sign in
export const signInWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Email/password registration
export const createUserWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Export auth instance
export { auth };
