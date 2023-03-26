import * as bulmaToast from 'bulma-toast'
// import bulmaCollapsible from '@creativebulma/bulma-collapsible';
// import { BulmaAccordion, BulmaAccordionItem } from 'vue-bulma-accordion'
import { useAccordion } from "vue3-rich-accordion";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.provide('bulmaToast', bulmaToast)
    nuxtApp.provide('bulmaToast', bulmaToast)

    nuxtApp.vueApp.provide('useAccordion', useAccordion)
    nuxtApp.provide('useAccordion', useAccordion)

    // nuxtApp.vueApp.provide('BulmaAccordionItem', BulmaAccordionItem)
    // nuxtApp.provide('BulmaAccordionItem', BulmaAccordionItem)
    // nuxtApp.provide('bulmaCollapsible', bulmaCollapsible)
})