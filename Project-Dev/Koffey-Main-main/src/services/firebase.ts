import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDYBQhHDXtHiUZyuCPBPv_ntQB1_1STk-A",
  authDomain: "crm-demo-stackblitz.firebaseapp.com",
  projectId: "crm-demo-stackblitz",
  storageBucket: "crm-demo-stackblitz.appspot.com",
  messagingSenderId: "339877506974",
  appId: "1:339877506974:web:b9a8f9f9f9f9f9f9f9f9f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize providers
export const googleProvider = new GoogleAuthProvider();
export const microsoftProvider = new OAuthProvider('microsoft.com');

// Configure providers
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

microsoftProvider.setCustomParameters({
  prompt: 'consent',
  tenant: 'common'
});