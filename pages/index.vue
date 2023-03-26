<template>
  <div>
    <NuxtLayout>
      <button class="button" @click="signOut" v-if="firebaseUser">SignOut</button>
      <div class="container mt-6" v-if="!firebaseUser">
        <div class="column is-half is-offset-one-quarter">
          <AuthFirebase
              class="box px-5 py-5 mx-4"
              title="Register"
              @submit="register"
              :form="registerForm"
              :message="registerMessage"
              v-if="showRegisterForm"
          />
          <AuthFirebase
              class="box px-5 py-5 mx-4"
              title="Sign in"
              @submit="signin"
              :form="signinForm"
              v-if="!firebaseUser && !showRegisterForm"
          />
        </div>
        <div class="level">
          <div class="level-item has-text-centered">
            <button class="button" @click="showRegisterForm = !showRegisterForm">
              {{ toggleButtonText }}
            </button>
          </div>
        </div>
      </div>
      <NuxtPage v-if="firebaseUser"/>
    </NuxtLayout>
  </div>
</template>

<script setup>
// definePageMeta({
//   middleware: ["auth"]
// })
import {signOutUser} from "../composables/useFirebase";

const firebaseUser = useFirebaseUser();
const showRegisterForm = ref(false);
const registerMessage = ref();
const registerForm = ref({email: "", password: ""});
const signinForm = ref({email: "", password: ""});

const toggleButtonText = computed(() => {
  return showRegisterForm.value ? "Sign in" : "Register";
});

const signin = () => {
  signInUser(signinForm.value.email, signinForm.value.password);
  signinForm.value = {email: "", password: ""};
};

const register = async () => {
  // console.log(registerForm.value);
  const credentials = await createUser(
      registerForm.value.email,
      registerForm.value.password
  );
  registerForm.value = {email: "", password: ""};

  if (credentials) {
    registerMessage.value = `Successfully registered: ${credentials.user.email}`;
    setTimeout(() => {
      registerMessage.value = "";
    }, 3000);
  }
};
const signOut = () => {
  console.log('hello')
  signOutUser();
};

</script>

<style>
@import "https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css";
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css";
@import "https://cdn.jsdelivr.net/npm/animate.css@4.0.0/animate.min.css";

/*.v-enter-active,*/
/*.v-leave-active {*/
/*  transition: opacity 0.5s ease;*/
/*}*/

/*.v-enter-from,*/
/*.v-leave-to {*/
/*  opacity: 0;*/
/*}*/
</style>