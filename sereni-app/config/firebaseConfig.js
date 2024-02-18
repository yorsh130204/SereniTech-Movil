// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBybfARo87KXHKZ8U9FgJyEXQFutMrpU1M",
  authDomain: "rntest-e31b8.firebaseapp.com",
  databaseURL: "https://rntest-e31b8-default-rtdb.firebaseio.com",
  projectId: "rntest-e31b8",
  storageBucket: "rntest-e31b8.appspot.com",
  messagingSenderId: "618540582711",
  appId: "1:618540582711:web:c69961b022c9bc1b6fbcb2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
