import { FirebaseApp, getApp, getApps,initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA2lo63Bj2haxu9t4JfvW_LbjTLiTrrTvA",
  authDomain: "marketdesk-mfa.firebaseapp.com",
  projectId: "marketdesk-mfa",
  storageBucket: "marketdesk-mfa.firebasestorage.app",
  messagingSenderId: "1002514957330",
  appId: "1:1002514957330:web:7ef84b96c30642d1ce44cb"
};

let app:FirebaseApp;

if(getApps().length===0){
    app=initializeApp(firebaseConfig)
}else{
    app=getApp()
}

export {app}

export const auth = getAuth(app)