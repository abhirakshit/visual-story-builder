<template>
  <div>
    <NuxtLayout name="logged-in">
      <div class="box">
        <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <span class="subtitle">Stories</span>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <button class="button is-primary"><i class="fa fa-plus"></i>&nbsp;Add</button>
          </div>
        </div>
        </nav>
      </div>
      <div class="container">
        <div class="columns">
          <div class="column is-one-quarter" v-for="story in stories">
            <NuxtLink :to="`stories/${story.id}`">
            <div class="card">
              <div class="card-header">
                <p class="card-header-title">
                  {{story.title}}
                </p>
              </div>
              <div class="card-content">
                <div class="content">
                  {{story.description}}
                </div>
              </div>
            </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
  layout: false
})

const firebaseUser = useFirebaseUser();
const stories = ref()
import {
  addDoc,
  updateDoc,
  setDoc,
  getDocs,
  getDoc,
  doc,
  collection,
  onSnapshot,
  query,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore"

onMounted(async () => {
  const {$fireDB} = useNuxtApp()
  console.log('mounted', firebaseUser.value.uid, $fireDB)
  const querySnapshot = await getDocs(query(collection($fireDB, `users/${firebaseUser.value.uid}/stories`)));
  stories.value = querySnapshot.docs.map((documentSnapshot) => {
    return {...documentSnapshot.data(), id: documentSnapshot.id}
  })
})
</script>