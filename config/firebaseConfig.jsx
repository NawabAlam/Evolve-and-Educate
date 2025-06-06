import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // <-- Added

// Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyBYBITidCHrsiy7doQKN1h9FMcBXnHLp44',
  authDomain: 'evoed-c763e.firebaseapp.com',
  projectId: 'evoed-c763e',
  storageBucket: 'evoed-c763e.firebasestorage.app',
  messagingSenderId: '605360201897',
  appId: '1:605360201897:web:8bbb91084a676398bb89b8',
  measurementId: 'G-PF4YN7L6QJ',
};

// Initialize Firebase app only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Auth only once with AsyncStorage persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (e) {
  // If already initialized, fallback to getAuth
  auth = getAuth(app);
}

// Firestore instance
const db = getFirestore(app);

// Firebase Storage instance (added)
const storage = getStorage(app);

// Conditionally initialize analytics
let analytics = null;
isSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  })
  .catch((error) => {
    console.log('Analytics not supported:', error);
  });

export { analytics, app, auth, db, storage };

