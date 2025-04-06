
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '../types';
import { login as apiLogin, register as apiRegister } from '../services/api';

// Convert Firebase user to our User type
export const mapFirebaseUserToAppUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  try {
    // First try to log in the user
    const { user } = await apiLogin(firebaseUser.email || '', `firebase_${firebaseUser.uid}`);
    return user;
  } catch (error) {
    // If login fails, register the user first
    console.log('User not found, registering new user with social login');
    
    // Register the new user
    const userData = {
      name: firebaseUser.displayName || 'User',
      email: firebaseUser.email || `${firebaseUser.uid}@firebase.user`,
      password: `firebase_${firebaseUser.uid}`,
    };
    
    const user = await apiRegister(userData);
    return user;
  }
};
