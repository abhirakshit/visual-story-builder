<template>
  <div>
    <NuxtLayout name="logged-in">
      <div class="box">
        <nav class="level">
          <div class="level-left">
            <div class="level-item">
              <span class="subtitle">Mental Models</span>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <button class="button is-primary" @click="showEditForm()"><i class="fa fa-plus"></i>&nbsp;Add
              </button>
            </div>
          </div>
        </nav>
      </div>
      <div class="container">
        <div class="columns">
          <div class="column is-half">
            <div class="columns is-multiline">
              <div class="column is-half" v-for="mm in mentalStateModels">
                <div class="card">
                  <div class="card-header">
                    <div class="card-header-title">
                      {{ mm.title }}
                    </div>
                    <!--                <a class="is-pulled-right icon has-text-danger" @click="showReplaceForm=!showReplaceForm">-->
                    <!--                  <i class="fas fa-trash"></i>-->
                    <!--                </a>-->
                    <a class="is-pulled-right icon has-text-info m-3" @click="showEditForm(mm.id)">
                      <i class="fas fa-pencil"></i>
                    </a>
                  </div>
                  <div class="card-content">
                    <div class="content">
                      {{ mm.description }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!--          Add Update form-->
          <div class="column is-half">
            <div class="box" v-if="showAddEditForm">
              <div class="subtitle">
                Add/Update Mental Model
              </div>

              <div class="field">
                <label class="label">Title</label>
                <div class="control">
                  <input class="input" type="text" placeholder="Text input" v-model="mentalModelData.title">
                </div>
              </div>
              <div class="field">
                <label class="label">Message</label>
                <div class="control">
                  <textarea class="textarea" placeholder="Textarea" v-model="mentalModelData.description"
                            rows="2"></textarea>
                </div>
              </div>

              <!--      Emotional States-->
              <div class="box">
                <div class="subtitle">
                  Emotional States
                  <a class="is-pulled-right icon has-text-info m-1" v-if="!showEmStates" @click="showEmStates=true">
                    <i class="fas fa-plus"></i>
                  </a>
                  <a class="is-pulled-right icon has-text-danger m-1" v-if="showEmStates" @click="showEmStates=false">
                    <i class="fas fa-minus"></i>
                  </a>
                </div>
                <div v-if="showEmStates">
                  <div class="field is-horizontal">
                    <div class="field-label">
                      <label class="label">Anger</label>
                    </div>
                    <div class="field-body">
                      <div class="field">
                        <div class="control">
                          <input id="honesty" class="slider has-output is-fullwidth" step=".1" min="0" max="5" type="range"
                                 v-model="mentalModelData.emotionalData.anger">
                          <output for="honesty" class="ml-1 tag is-dark">{{ mentalModelData.emotionalData.anger }}</output>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="field is-horizontal">
                    <div class="field-label">
                      <label class="label">Fear</label>
                    </div>
                    <div class="field-body">
                      <div class="field">
                        <div class="control">
                          <input id="emotionality" class="slider has-output is-fullwidth" step=".1" min="0" max="5"
                                 type="range" v-model="mentalModelData.emotionalData.fear">
                          <output for="emotionality" class="ml-1 tag is-dark">{{ mentalModelData.emotionalData.fear }}</output>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="field is-horizontal">
                    <div class="field-label">
                      <label class="label">Disgust</label>
                    </div>
                    <div class="field-body">
                      <div class="field">
                        <div class="control">
                          <input id="extraversion" class="slider has-output is-fullwidth" step=".1" min="0" max="5"
                                 type="range" v-model="mentalModelData.emotionalData.disgust">
                          <output for="extraversion" class="ml-1 tag is-dark">{{ mentalModelData.emotionalData.disgust }}</output>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="field is-horizontal">
                    <div class="field-label">
                      <label class="label">Happiness</label>
                    </div>
                    <div class="field-body">
                      <div class="field">
                        <div class="control">
                          <input id="agreeableness" class="slider has-output is-fullwidth" step=".1" min="0" max="5"
                                 type="range" v-model="mentalModelData.emotionalData.happiness">
                          <output for="agreeableness" class="ml-1 tag is-dark">{{ mentalModelData.emotionalData.happiness }}</output>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="field is-horizontal">
                    <div class="field-label">
                      <label class="label">Sadness</label>
                    </div>
                    <div class="field-body">
                      <div class="field">
                        <div class="control">
                          <input id="conscientiousness" class="slider has-output is-fullwidth" step=".1" min="0" max="5"
                                 type="range" v-model="mentalModelData.emotionalData.sadness">
                          <output for="conscientiousness" class="ml-1 tag is-dark">{{ mentalModelData.emotionalData.sadness }}
                          </output>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="field is-horizontal">
                    <div class="field-label">
                      <label class="label">Surprise</label>
                    </div>
                    <div class="field-body">
                      <div class="field">
                        <div class="control">
                          <input id="openness" class="slider has-output is-fullwidth" step=".1" min="0" max="5" type="range"
                                 v-model="mentalModelData.emotionalData.surprise">
                          <output for="openness" class="ml-1 tag is-dark">{{ mentalModelData.emotionalData.surprise }}</output>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="field is-horizontal">
                    <div class="field-label">
                      <label class="label">Contempt</label>
                    </div>
                    <div class="field-body">
                      <div class="field">
                        <div class="control">
                          <input id="openness" class="slider has-output is-fullwidth" step=".1" min="0" max="5" type="range"
                                 v-model="mentalModelData.emotionalData.contempt">
                          <output for="openness" class="ml-1 tag is-dark">{{ mentalModelData.emotionalData.contempt }}</output>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!--      HEXACO-->
              <div class="box">
                <div class="subtitle">
                  Personality Scores
                  <a class="is-pulled-right icon has-text-info m-1" v-if="!showHEXACO" @click="showHEXACO=true">
                    <i class="fas fa-plus"></i>
                  </a>
                  <a class="is-pulled-right icon has-text-danger m-1" v-if="showHEXACO" @click="showHEXACO=false">
                    <i class="fas fa-minus"></i>
                  </a>
                </div>
                <div v-if="showHEXACO">
                <div class="field is-horizontal">
                  <div class="field-label">
                    <label class="label">Honesty</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <div class="control">
                        <input id="honesty" class="slider has-output is-fullwidth" step=".1" min="0" max="5" type="range"
                               v-model="mentalModelData.personalityData.honesty">
                        <output for="honesty" class="ml-1 tag is-dark">{{ mentalModelData.personalityData.honesty }}</output>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="field is-horizontal">
                  <div class="field-label">
                    <label class="label">Emotionality</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <div class="control">
                        <input id="emotionality" class="slider has-output is-fullwidth" step=".1" min="0" max="5"
                               type="range" v-model="mentalModelData.personalityData.emotionality">
                        <output for="emotionality" class="ml-1 tag is-dark">{{ mentalModelData.personalityData.emotionality }}</output>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="field is-horizontal">
                  <div class="field-label">
                    <label class="label">Extraversion</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <div class="control">
                        <input id="extraversion" class="slider has-output is-fullwidth" step=".1" min="0" max="5"
                               type="range" v-model="mentalModelData.personalityData.extraversion">
                        <output for="extraversion" class="ml-1 tag is-dark">{{ mentalModelData.personalityData.extraversion }}</output>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="field is-horizontal">
                  <div class="field-label">
                    <label class="label">Agreeableness</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <div class="control">
                        <input id="agreeableness" class="slider has-output is-fullwidth" step=".1" min="0" max="5"
                               type="range" v-model="mentalModelData.personalityData.agreeableness">
                        <output for="agreeableness" class="ml-1 tag is-dark">{{ mentalModelData.personalityData.agreeableness }}</output>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="field is-horizontal">
                  <div class="field-label">
                    <label class="label">Conscientiousness</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <div class="control">
                        <input id="conscientiousness" class="slider has-output is-fullwidth" step=".1" min="0" max="5"
                               type="range" v-model="mentalModelData.personalityData.conscientiousness">
                        <output for="conscientiousness" class="ml-1 tag is-dark">{{ mentalModelData.personalityData.conscientiousness }}
                        </output>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="field is-horizontal">
                  <div class="field-label">
                    <label class="label">Openness</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <div class="control">
                        <input id="openness" class="slider has-output is-fullwidth" step=".1" min="0" max="5" type="range"
                               v-model="mentalModelData.personalityData.openness">
                        <output for="openness" class="ml-1 tag is-dark">{{ mentalModelData.personalityData.openness }}</output>
                      </div>
                    </div>
                  </div>
                </div>
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
import { AccordionList, AccordionItem } from "vue3-rich-accordion"
const {$fireDB} = useNuxtApp()
const firebaseUser = useFirebaseUser();
const mentalStateModels = ref()
const showAddEditForm = ref(false)
const showHEXACO = ref(false)
const showEmStates = ref(false)
const storiesColumnCSS = ref("")
const mentalModelData = ref({
  title: "New Mental State", description: "",
  emotionalData: {},
  personalityData: {}
})

const handleSubmit = async () => {
  console.log('submit', mentalModelData.value)

  if (mentalModelData.value.id) {
    bulmaToast.toast({
      message: 'Updating...',
      type: 'is-info',
      animate: {in: 'slideInRight', out: 'slideOutRight'}
    })
    await updateDoc(
        doc($fireDB, `users/${firebaseUser.value.uid}/mentalStateModels/${mentalModelData.value.id}`),
        mentalModelData.value
    ).then((err) => {
      console.log(err)
      hideForm()
      bulmaToast.toast({
        message: 'Successfully Updated',
        type: 'is-primary',
        animate: {in: 'slideInRight', out: 'slideOutRight'}
      })
    })
  } else {
    bulmaToast.toast({
      message: 'Creating mental model...',
      type: 'is-info',
      animate: {in: 'slideInRight', out: 'slideOutRight'}
    })
    await addDoc(
        collection($fireDB, `users/${firebaseUser.value.uid}/mentalStateModels`), mentalModelData.value
    ).then(() => {
      hideForm()
      bulmaToast.toast({
        message: 'Successfully Created Mental Model',
        type: 'is-primary',
        animate: {in: 'slideInRight', out: 'slideOutRight'}
      })
    })
  }

}

const showEditForm = (mmId) => {
  if (mmId) {
    const mentalModel = mentalStateModels.value.find((s) => {
      return s.id == mmId
    })
    mentalModelData.value = {...mentalModelData.value, ...mentalModel}
  }
  showAddEditForm.value = true
}

const hideForm = () => {
  mentalModelData.value = {title: "New Story", description: "New Desc"}
  showAddEditForm.value = false
}

onMounted(async () => {
  const q = query(collection($fireDB, `users/${firebaseUser.value.uid}/mentalStateModels`))
  await onSnapshot(q, (querySnapshot) => {
    mentalStateModels.value = querySnapshot.docs.map((documentSnapshot) => {
      return {...documentSnapshot.data(), id: documentSnapshot.id}
    })
  })
})
</script>