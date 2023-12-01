/**
 * Import the Firebase client modules
 */
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdE6XqSvDrKz3VWART5kgc9I1qEENkfMg",
  authDomain: "beaudible-da042.firebaseapp.com",
  databaseURL: "https://beaudible-da042-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "beaudible-da042",
  storageBucket: "beaudible-da042.appspot.com",
  messagingSenderId: "791337603222",
  appId: "1:791337603222:web:118f4044f10dddb09372b7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage();
export const auth = getAuth(app);

/**
 * For local testing add authentication emulator
 */
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, "http://localhost:9098");
}
