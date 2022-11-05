import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, updateProfile } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyAeBKoQ9HkYPWGYafQ2pF9yE7Uti5T3xRo",
    authDomain: "p3version3.firebaseapp.com",
    projectId: "p3version3",
    storageBucket: "p3version3.appspot.com",
    messagingSenderId: "1016558479611",
    appId: "1:1016558479611:web:ff6fbe26fe2bddcd37285e"
};

initializeApp(firebaseConfig)

// init services
const db = getFirestore()
const auth = getAuth()

export {db, auth}


