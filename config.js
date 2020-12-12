import * as firebase from 'firebase';
require('@firebase/firestore')

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCEtjX-U0Jl9_E41OGaPzkUmRRgS-UK_rI",
    authDomain: "firestoredb-b6d31.firebaseapp.com",
    databaseURL: "https://firestoredb-b6d31.firebaseio.com",
    projectId: "firestoredb-b6d31",
    storageBucket: "firestoredb-b6d31.appspot.com",
    messagingSenderId: "467339216202",
    appId: "1:467339216202:web:ae509816490c88d08eadb3"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();