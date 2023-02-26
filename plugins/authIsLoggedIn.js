export default defineNuxtPlugin(() => {
    addRouteMiddleware('isLoggedIn', ({to, from}) => {
        const {$auth} = useNuxtApp()
        if (!$auth || !$auth.currentUser || !$auth.currentUser.uid) {
            //TODO: save current url to session and redirect after login
            return navigateTo('/auth/login')
        }
    })
})