import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  increment,
  serverTimestamp,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD-Oiz4RXEY4yW6_A3xuLOmsv3mw3urZDU",
  authDomain: "encurta-67ddd.firebaseapp.com",
  projectId: "encurta-67ddd",
  storageBucket: "encurta-67ddd.firebasestorage.app",
  messagingSenderId: "497432750979",
  appId: "1:497432750979:web:5454503ebdbf6ac30424b6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  increment,
  serverTimestamp,
  query,
  orderBy
};