// firebase.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from "firebase/database";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDAHKGxA7X7wN0TiP_hFzrIL_qAIbpEzqU",
  authDomain: "serenitech-7a4b6.firebaseapp.com",
  databaseURL: "https://serenitech-7a4b6-default-rtdb.firebaseio.com",
  projectId: "serenitech-7a4b6",
  storageBucket: "serenitech-7a4b6.appspot.com",
  messagingSenderId: "971151167264",
  appId: "1:971151167264:web:f95914be5124b48b811145"
};

// Inicializar Firebase App
const FIREBASE_APP = initializeApp(firebaseConfig);

// Inicializar Firebase Auth para esa aplicación inmediatamente
const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const FIREBASE_DB = getDatabase(FIREBASE_APP);

export { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB };