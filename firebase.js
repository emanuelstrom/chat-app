import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: 'AIzaSyDNRWHChWo22dJw_a2Xa0s_ExvRIyQcad0',
    authDomain: 'chat-app-125f0.firebaseapp.com',
    projectId: 'chat-app-125f0',
    storageBucket: 'chat-app-125f0.appspot.com',
    messagingSenderId: '990169123369',
    appId: '1:990169123369:web:8384a7ee23ed1644146a38',
}

const app =
    getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const fs = getFirestore(app)
export const auth = getAuth(app)

export default app
