export default defineNuxtPlugin(() => {
    addRouteMiddleware('auth', () => {
        console.log('Auth Middleware')
        const { $auth } = useNuxtApp()
        console.log($auth?.currentUser)
        if(!$auth?.currentUser?.uid) {
            return navigateTo('/')
        }
    })
})