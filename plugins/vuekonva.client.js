import VueKonva from 'vue-konva';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.provide('VueKonva', VueKonva)
    nuxtApp.provide('VueKonva', VueKonva)
})