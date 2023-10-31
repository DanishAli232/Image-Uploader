import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDi3G6o03vTpvT7eCztZUMMZxpWsEWoJz8",
//   authDomain: "practice-ecd61.firebaseapp.com",
//   projectId: "practice-ecd61",
//   storageBucket: "practice-ecd61.appspot.com",
//   messagingSenderId: "106236860300",
//   appId: "1:106236860300:web:8d6d8b10538b84b93d68a9",
//   measurementId: "G-B628CXVSGS",
// };
const firebaseConfig = {
  apiKey: "AIzaSyAYRHbWC-rdL3kp4zoFdaq7yVtbjihx4uo",
  authDomain: "promptcreator360.firebaseapp.com",
  databaseURL: "https://promptcreator360-default-rtdb.firebaseio.com",
  projectId: "promptcreator360",
  storageBucket: "promptcreator360.appspot.com",
  messagingSenderId: "101189196820",
  appId: "1:101189196820:web:e2e2f7245b8f19b8fcdb01",
  measurementId: "G-B0VNQS5NF9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const provider = new GoogleAuthProvider();
