import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD1S9r4Qq0jalpiVvPGi3eikrx8aPlV-Nk",
  authDomain: "qr-medico-710e7.firebaseapp.com",
  projectId: "qr-medico-710e7",
  storageBucket: "qr-medico-710e7.firebasestorage.app",
  messagingSenderId: "219302916943",
  appId: "1:219302916943:web:1237a62d7f1468f1818b3a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
