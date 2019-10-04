import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/firebase-storage'
import getSecretsFirebase from '../../secrets'

// Initialize Firebase
var config = getSecretsFirebase()

firebase.initializeApp(config)

const firebaseDb = firebase.firestore()
const firebaseStorage = firebase.storage()

export { firebaseDb, firebaseStorage, firebase }