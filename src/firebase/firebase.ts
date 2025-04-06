
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  OAuthProvider,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  UserCredential
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
  return signInWithPopup(auth, googleProvider);
};

// Sign in with Apple
export const signInWithApple = async (): Promise<UserCredential> => {
  return signInWithPopup(auth, appleProvider);
};

// Sign out
export const signOut = async (): Promise<void> => {
  return firebaseSignOut(auth);
};

// Get current user
export const getCurrentFirebaseUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

// Export auth instance
export { auth };
