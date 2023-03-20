<template>
  <div>
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="container">
        <div class="navbar-brand">
          <a class="navbar-item is-size-5" href="/">
<!--            <img src="/logo-black.svg" width="100" height="28">-->
            Indra's Net Story Builder
            <!--          <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28">-->
          </a>

          <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false"
             data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
          <div class="navbar-start">
            <!--          <a class="navbar-item">-->
            <!--            Home-->
            <!--          </a>-->

            <!--          <a class="navbar-item">-->
            <!--            Documentation-->
            <!--          </a>-->


          </div>

          <div class="navbar-end">
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link">
<!--                <i class="fa fa-user"></i>-->
                <client-only>
                <font-awesome-icon icon="user" />&nbsp;
                <span>
                  Welcome {{ firebaseUser.email }}
                </span>
                </client-only>
              </a>
              <div class="navbar-dropdown">
                <a class="navbar-item">
                  Settings
                </a>
                <a class="navbar-item">
                  Profile
                </a>
                <hr class="navbar-divider">
                <a class="navbar-item" @click="signOut">
                  Sign Out
                </a>
              </div>
            </div>
            <!--          <div class="navbar-item">-->
            <!--            <div class="buttons">-->
            <!--&lt;!&ndash;              <a class="button is-primary">&ndash;&gt;-->
            <!--&lt;!&ndash;                <strong>Sign up</strong>&ndash;&gt;-->
            <!--&lt;!&ndash;              </a>&ndash;&gt;-->
            <!--              <a class="button is-light" @click="signOut">-->
            <!--                Log Out-->
            <!--              </a>-->
            <!--            </div>-->
            <!--          </div>-->
          </div>
        </div>
      </div>
    </nav>
    <div class="container">
      <div id="main">
        <slot/>
      </div>
    </div>
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
<!--          <strong>Conneczen</strong> by <a href="/">Abhishek Rakshit</a>. -->
          The source code is licensed
          <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import {signOutUser} from "../composables/useFirebase";

const firebaseUser = useFirebaseUser();
// console.log('Nav', firebaseUser.email)
const signOut = () => {
  signOutUser();
};
</script>