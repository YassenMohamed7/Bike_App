const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");

const firebaseConfig = {
    apiKey: "AIzaSyCHQkMVckVPe3smyB4oWeoiXYWyTtsPfwY",
    authDomain: "graduation-project-414621.firebaseapp.com",
    projectId: "graduation-project-414621",
    storageBucket: "graduation-project-414621.appspot.com",
    messagingSenderId: "844125637046",
    appId: "1:844125637046:web:30d3e3855b3a1c09b71917",
    measurementId: "G-5JQYHTNRV7"
    };

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

module.exports = { firebaseApp, auth };
