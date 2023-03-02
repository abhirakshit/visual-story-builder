// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    meta: {
        title: 'Conneczen'
    },
    css: [
        // Load a Node.js module directly (here it's a Sass file).
        // 'bulma',
        // CSS file in the project
        '@/assets/css/app.css',
        // SCSS file in the project
        '@/assets/css/admin.css'
    ],
    runtimeConfig: {
        FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
        FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
        public: {
            FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
            FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID
        }
    },
    plugins: [
        { src: "~/plugins/vueKonva.client", mode: 'client' }
    ],
    build: {
        transpile: ['konva']
    },
})
