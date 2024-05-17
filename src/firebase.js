import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBjGLOIIHkdMDB3SjH_-jnNpUrFqKJ-vkk",
  authDomain: "sadashiva-weatherapp.firebaseapp.com",
  projectId: "sadashiva-weatherapp",
  storageBucket: "sadashiva-weatherapp.appspot.com",
  messagingSenderId: "832550846879",
  appId: "1:832550846879:web:03ee0ba98991e4c4d17daa",
  measurementId: "G-VTKWCVQ9EE"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();

export { app, auth };