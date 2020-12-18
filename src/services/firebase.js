import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"

const config = {
  apiKey: process.env.REACT_APP_FB_API_KEY,
  authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FB_DATABASE_URL
};

firebase.initializeApp(config);

export const auth = firebase.auth;
export const db = firebase.database();