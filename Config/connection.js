// const { initializeApp, cert , sto} = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const admin = require('firebase-admin');
const serviceAccount = require('./FirebaseConnection.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "graduation-project-414621.appspot.com"
});

// Get a reference to the Firebase Storage bucket
const bucket = admin.storage().bucket();
const db = admin.firestore();
// const db = getFirestore();



module.exports = {db, bucket};
