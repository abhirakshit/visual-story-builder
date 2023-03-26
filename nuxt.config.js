// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    theme: 'genesis',
    meta: {
        title: 'Indras Net Story Builder'
    },
    css: [
        // Load a Node.js module directly (here it's a Sass file).
        // 'bulma',
        // CSS file in the project
        '@/assets/css/app.css',
        // SCSS file in the project
        '@/assets/css/admin.css',
        '@fortawesome/fontawesome-svg-core/styles.css',
        '@/node_modules/bulma-list/css/bulma-list.css',
        // '@/node_modules/@creativebulma/bulma-collapsible/dist/css/bulma-collapsible.min.css'
    ],
    loading: {
        color: 'blue',
        height: '5px'
    },
    runtimeConfig: {
        FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
        FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
        public: {
            FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
            FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID
        }
    },
    plugins: [
        // { src: "~/plugins/vueKonva.client", mode: 'client' }
    ],
    modules: [
        '@formkit/nuxt',
    ],
    buildModules: [
        '@nuxtjs/style-resources',
        '@nuxtjs/fontawesome',
    ],
    fontawesome: {
        component: 'fa',
        icons: {
            solid: true,
            brands: true
        }
    },
    build: {
        transpile: ['konva']
    },

})
