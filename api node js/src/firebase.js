const firebase = require('firebase/app')
require('firebase/auth')
require('firebase/database')

let firebaseConfig = {
    apiKey: "AIzaSyAt2_J03t7p7z5_LP3NXdUWtiYjilnwkB4",
    authDomain: "while-dev.firebaseapp.com",
    projectId: "while-dev",
    storageBucket: "while-dev.appspot.com",
    messagingSenderId: "395110598229",
    appId: "1:395110598229:web:8cda2233613305da9736dc",
    measurementId: "G-21WQW7PE41"
}

firebase.initializeApp(firebaseConfig)

module.exports = firebase
