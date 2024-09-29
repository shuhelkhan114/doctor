// @ts-nocheck
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import Config from 'react-native-config';

const firebaseConfig = {
  apiKey: Config.FIREBASE_API_KEY,
  authDomain: Config.FIREBASE_AUTH_DOMAIN,
  projectId: Config.FIREBASE_PROJECT_ID,
  storageBucket: Config.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Config.FIREBASE_MESSAGING_SENDER_ID,
  appId: Config.FIREBASE_APP_ID,
  measurementId: Config.FIREBASE_MEASUREMENT_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.appId) {
  throw new Error('Missing Firebase configuration. Ensure environment variables are set.');
}

if (!firebaseConfig.measurementId) {
  delete firebaseConfig.measurementId;
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

export default app;
