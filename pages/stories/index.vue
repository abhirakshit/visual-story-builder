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
              <button class="button is-primary" @click="showAddEditForm=true"><i class="fa fa-plus"></i>&nbsp;Add
              </button>
            </div>
          </div>
        </nav>
      </div>
      <div class="container">
        <div class="columns">
          <div class="column is-three-quarters">
            <div class="columns">
              <div class="column is-one-third" v-for="story in stories">
                  <div class="card">
                    <div class="card-header">
                      <div class="card-header-title">
                        {{ story.title }}
                      </div>
                      <!--                <a class="is-pulled-right icon has-text-danger" @click="showReplaceForm=!showReplaceForm">-->
                      <!--                  <i class="fas fa-trash"></i>-->
                      <!--                </a>-->
                      <a class="is-pulled-right icon has-text-info m-3" @click="showEditForm(story.id)">
                        <i class="fas fa-pencil"></i>
                      </a>
                    </div>
                    <div class="card-content">
                      <div class="content">
                        {{ story.description }}
                      </div>
                    </div>
                    <div class="card-footer">
                      <div class="m-2">
                        <span class="is-pulled-right">
                          <NuxtLink :to="`stories/${story.id}`">
                            <button class="button is-outlined is-primary is-small is-rounded">Open</button>
                          </NuxtLink>
                        </span>
                      </div>
                    </div>
                  </div>

              </div>
            </div>
          </div>

          <!--          Add Update form-->
          <div class="column is-one-quarter">
            <div class="box" v-if="showAddEditForm">
              <div class="subtitle">
                Add/Update Story
              </div>

              <div class="field">
                <label class="label">Title</label>
                <div class="control">
                  <input class="input" type="text" placeholder="Text input" v-model="storyData.title">
                </div>
              </div>
              <div class="field">
                <label class="label">Message</label>
                <div class="control">
                  <textarea class="textarea" placeholder="Textarea" v-model="storyData.description" rows="2"></textarea>
                </div>
              </div>

              <!--      Buttons-->
              <div class="field is-grouped ">
                <div class="control">
                  <button class="button is-link" @click="handleSubmit">Submit</button>
                </div>
                <div class="control">
                  <button class="button is-link is-light" @click="hideForm()">Cancel</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup>
import * as bulmaToast from "bulma-toast";

definePageMeta({
  middleware: ["auth"],
  layout: false
})

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
const {$fireDB} = useNuxtApp()
const firebaseUser = useFirebaseUser();
const stories = ref()
const showAddEditForm = ref(false)
const storiesColumnCSS = ref("")
const storyData = ref({title: "New Story", description: "New Desc"})

const handleSubmit = async () => {
  console.log('submit', storyData.value)

  if (storyData.value.id) {
    bulmaToast.toast({
      message: 'Updating...',
      type: 'is-info',
      animate: { in: 'slideInRight', out: 'slideOutRight'}
    })
    await updateDoc(
        doc($fireDB, `users/${firebaseUser.value.uid}/stories/${storyData.value.id}`),
        storyData.value
    ).then((err) => {
      console.log(err)
      hideForm()
      bulmaToast.toast({
        message: 'Successfully Updated',
        type: 'is-primary',
        animate: { in: 'slideInRight', out: 'slideOutRight'}
      })
    })
  } else {
    bulmaToast.toast({
      message: 'Creating story...',
      type: 'is-info',
      animate: { in: 'slideInRight', out: 'slideOutRight'}
    })
    await addDoc(
        collection($fireDB,`users/${firebaseUser.value.uid}/stories`), storyData.value
    ).then(() => {
      hideForm()
      bulmaToast.toast({
        message: 'Successfully Created Story',
        type: 'is-primary',
        animate: { in: 'slideInRight', out: 'slideOutRight'}
      })
    })
  }

}
const showEditForm = (storyId) => {
  console.log('ss', storyId, stories.value)
  const stry = stories.value.find((s)=> {
    return s.id == storyId
  })
  storyData.value = stry
  showAddEditForm.value = true
}

const hideForm = () => {
  storyData.value =  {title: "New Story", description: "New Desc"}
  showAddEditForm.value = false
}

onMounted(async () => {
  // console.log('mounted', firebaseUser.value.uid, $fireDB)
  const q = query(collection($fireDB, `users/${firebaseUser.value.uid}/stories`))
  await onSnapshot(q, (querySnapshot) => {
    stories.value = querySnapshot.docs.map((documentSnapshot) => {
      return {...documentSnapshot.data(), id: documentSnapshot.id}
    })
  })
  // const querySnapshot = await getDocs(query(collection($fireDB, `users/${firebaseUser.value.uid}/stories`)));
  // stories.value = querySnapshot.docs.map((documentSnapshot) => {
  //   return {...documentSnapshot.data(), id: documentSnapshot.id}
  // })
})
</script>