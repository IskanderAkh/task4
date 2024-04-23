import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC5ZGqMAhH8BmLga3Ykl8lefMfuiAxTNOo",
    authDomain: "authorization-akh.firebaseapp.com",
    projectId: "authorization-akh",
    storageBucket: "authorization-akh.appspot.com",
    messagingSenderId: "999834906389",
    appId: "1:999834906389:web:28302fe8d1dfcf755e431c"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
//   const analytics = getAnalytics(app);
  const db = getFirestore(app);

export {db}