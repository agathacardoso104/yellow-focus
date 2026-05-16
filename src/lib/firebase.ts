import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import defaultConfig from '../../firebase-applet-config.json';

const firebaseConfig = {
	apiKey: (import.meta.env.VITE_FIREBASE_API_KEY as string) || defaultConfig.apiKey,
	authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string) || defaultConfig.authDomain,
	projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID as string) || defaultConfig.projectId,
	storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string) || defaultConfig.storageBucket,
	messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string) || defaultConfig.messagingSenderId,
	appId: (import.meta.env.VITE_FIREBASE_APP_ID as string) || defaultConfig.appId,
	measurementId: (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string) || defaultConfig.measurementId,
	firestoreDatabaseId: (import.meta.env.VITE_FIREBASE_DATABASE_ID as string) || defaultConfig.firestoreDatabaseId,
};

const app = initializeApp(firebaseConfig as any);
export const db = getFirestore(app);
export const auth = getAuth(app);
