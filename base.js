import Rebase from 're-base'
import firebase from 'firebase/app'
import 'firebase/database'

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAwG3klojyHyDhl0ce3RnEDmjnOv3UEP0c",
    authDomain: "trickyroad-24e90.firebaseapp.com",
    databaseURL: "https://trickyroad-24e90.firebaseio.com",
    projectId: "trickyroad-24e90",
    storageBucket: "trickyroad-24e90.appspot.com",
    messagingSenderId: "851064839297",
    appId: "1:851064839297:web:48cf48c7d4e922601cc180"
})

const base = Rebase.createClass(firebase.database())

export {firebaseApp}
export default base