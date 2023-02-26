// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    meta: {
        title: 'Conneczen'
    },
    runtimeConfig: {
        FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
        FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
        public: {
            FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
            FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID
        }
    }
})
