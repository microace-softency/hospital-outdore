// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { initializeFirestore, CACHE_SIZE_UNLIMITED } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbAwTvZfAB1x01r_qKsCU1PmIdNIwuLOY",
  authDomain: "hospital-f8af5.firebaseapp.com",
  projectId: "hospital-f8af5",
  storageBucket: "hospital-f8af5.appspot.com",
  messagingSenderId: "653301933009",
  appId: "1:653301933009:web:9540a55a312d0fddc336f0",
  measurementId: "G-JEMHJ29MBX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const storage = getStorage(app)
const rdb = getDatabase();
const db = initializeFirestore(app, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
});

export {
    auth,
    db,
    storage,
    rdb
}