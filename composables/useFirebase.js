// https://firebase.google.com/docs/auth/web/start
// https://www.youtube.com/watch?v=NoJa7FKqmhU
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import {useFirebaseUser} from "~/composables/useStates";

export const signInUser = async (email, password) => {
    const auth = getAuth();
    const credentials = await signInWithEmailAndPassword(auth, email, password)
        .catch((error) => {
            console.error(error)
        });
    return credentials
}

export const signOutUser = async () => {
    const auth = getAuth();
    const result = await auth.signOut();
    console.info('User signed out')
    return result;
}

export const initUser = async () => {
    console.log('Init User Observer')
    const auth = getAuth();

    // Save user to local ref variable
    const firebaseUser = useFirebaseUser();
    firebaseUser.value = auth.currentUser;

    const router = useRouter();
    const userCookie = useCookie('userCookie')
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            console.log('Auth changed', user)
            // console.log('Auth changed', auth.currentUser    )
            user.getIdTokenResult()
                .then((idTokenResult) => {
                    // Confirm the user is an Admin.
                    console.log('Claims', idTokenResult.claims)
                    if (idTokenResult.claims.role == 'admin') {
                        // Show admin UI.
                        // showAdminUI();
                        console.log(idTokenResult.claims)
                    } else {
                        // Show regular user UI.
                        // showRegularUI();
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            console.log('Routing...')
            router.push("/stories");
        } else {
            // User is signed out
            // ...
            console.log('Auth Signed Out', user)
            router.push("/");
            // router.push("/auth/login");
        }

        // Updated user with state
        firebaseUser.value = user;

        userCookie.value = user; // ignore error as nuxt will serialize to json

        // $fetch("/api/auth", {
        //     method: "POST",
        //     body: { user },
        // });
    });
}




