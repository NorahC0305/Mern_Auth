import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyAbyYKZPzfwE7InF2Mryi2Pt33maSqaDSA",
	authDomain: "test-auth-41e52.firebaseapp.com",
	projectId: "test-auth-41e52",
	storageBucket: "test-auth-41e52.appspot.com",
	messagingSenderId: "968020805908",
	appId: "1:968020805908:web:ddf9fdddb66f49cd7a1a01",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
export { app, auth, storage };
