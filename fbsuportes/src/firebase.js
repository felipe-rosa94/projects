import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/messaging'
import 'firebase/storage'

var firebaseConfig = {
    apiKey: "AIzaSyCn65a8qdmndm27eY1Yp0KnjBm_2dm8-Ws",
    authDomain: "loja-roberto-pastelaria.firebaseapp.com",
    databaseURL: "https://loja-roberto-pastelaria.firebaseio.com",
    projectId: "loja-roberto-pastelaria",
    storageBucket: "loja-roberto-pastelaria.appspot.com",
    messagingSenderId: "559991112664",
    appId: "1:559991112664:web:6135ebdb7c3a19797268ad",
    measurementId: "G-2WV9LMV53R"
}
firebase.initializeApp(firebaseConfig)

export default firebase
