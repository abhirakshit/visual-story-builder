// // https://www.youtube.com/watch?v=NoJa7FKqmhU
//https://www.youtube.com/watch?app=desktop&v=NoJa7FKqmhU
import { initializeApp, getApps } from "firebase/app"
import { getFirestore, initializeFirestore } from "firebase/firestore"
import { initializeAuth, browserLocalPersistence,
    browserSessionPersistence, indexedDBLocalPersistence, getAuth } from "firebase/auth";


export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()
    console.log('config', config.FIREBASE_API_KEY)
    const firebaseConfig = {
        apiKey: config.FIREBASE_API_KEY,
        projectId: config.FIREBASE_PROJECT_ID,
    }
    const apps = getApps()
    let firebaseApp = {}
    let auth = {}
    if (!apps.length) {
        firebaseApp = initializeApp(firebaseConfig, {})
        auth = initializeAuth(firebaseApp, {
            persistence: [indexedDBLocalPersistence, browserSessionPersistence, browserLocalPersistence] ,
        });
    } else {
        firebaseApp = apps[0]
    }

    initUser()
    auth = getAuth()
    nuxtApp.vueApp.provide('auth', auth)
    nuxtApp.provide('auth', auth)

    // const db = getFirestore(firebaseApp, {})
    const db = initializeFirestore(firebaseApp, {})
    nuxtApp.provide('fireDB', db)
})