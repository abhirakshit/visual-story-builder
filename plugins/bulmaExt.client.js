import * as bulmaToast from 'bulma-toast'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.provide('bulmaToast', bulmaToast)
    nuxtApp.provide('bulmaToast', bulmaToast)
})