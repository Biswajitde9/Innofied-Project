// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAk66SD-euf9z78OABCOkDeUqaNehscliw",
  authDomain: "local-event-planner.firebaseapp.com",
  databaseURL: "https://local-event-planner-default-rtdb.firebaseio.com",
  projectId: "local-event-planner",
  storageBucket: "local-event-planner.appspot.com",
  messagingSenderId: "268572689829",
  appId: "1:268572689829:web:a3d5a117ecc5a9f678944c",
  measurementId: "G-NWH87TRCSV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);