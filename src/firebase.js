import firebase from 'firebase/app';
import 'firebase/app'; 
import 'firebase/database'; 
import 'firebase/auth'; 
import 'firebase/storage'; 


const firebaseConfig = {
    apiKey: "AIzaSyD2QB_J9Va6g6i9eAclIw_oEK0h-_QQ_Cc",
    authDomain: "m-city-97ece.firebaseapp.com",
    databaseURL: "https://m-city-97ece.firebaseio.com",
    projectId: "m-city-97ece",
    storageBucket: "m-city-97ece.appspot.com",
    messagingSenderId: "355594488734",
    appId: "1:355594488734:web:95c6b348fc848d9bfe648f",
    measurementId: "G-JKC7BJF6R2"
  };

firebase.initializeApp(firebaseConfig);

const firebaseDB = firebase.database();
const firebaseMatches = firebaseDB.ref('matches');
const firebasePromotions = firebaseDB.ref('promotions');
const firebaseTeams = firebaseDB.ref('teams');
const firebasePlayers = firebaseDB.ref('players');

export{
    firebase,
    firebaseMatches,
    firebasePromotions,
    firebaseTeams,
    firebasePlayers,
    firebaseDB
}
