import {initializeApp} from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; 
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBmQSCrJhEaY8-EdAR_hK8Ttd5g2lbU7T8",
    authDomain: "curso-7f4e4.firebaseapp.com",
    projectId: "curso-7f4e4",
    storageBucket: "curso-7f4e4.appspot.com",
    messagingSenderId: "1018780881242",
    appId: "1:1018780881242:web:37f6eff6c1504db4c26363",
    measurementId: "G-J2CN4FYYRV"
  };

  const firebaseApp = initializeApp(firebaseConfig);

  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

  export { db, auth };