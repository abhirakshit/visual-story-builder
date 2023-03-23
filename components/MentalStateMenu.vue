<template>
  <div>
    <div v-if="showEditForm">
      <div class="subtitle">
        Update Mental State
        <a class="is-pulled-right has-text-danger" @click="showEditForm=!showEditForm">
          <i class="fas fa-times"></i>
        </a>
      </div>

<!--      Title & Desc-->
      <div class="field is-horizontal">
        <div class="field-label">
          <label class="label">Title</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <input class="input" type="text" placeholder="Small sized input" v-model="mentalModel.title">
            </div>
          </div>
        </div>
      </div>
      <div class="field is-horizontal">
        <div class="field-label">
          <label class="label">Description</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
<!--              <input class="input" type="textarea" rows="2" placeholder="Small sized input" v-model="mentalModel.description">-->
              <textarea class="textarea" v-model="mentalModel.description" rows="2"></textarea>
            </div>
          </div>
        </div>
      </div>

<!--      HEXACO-->
      <div class="field is-horizontal">
        <div class="field-label">
          <label class="label">Honesty</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <input id="honesty" class="slider has-output is-fullwidth" step=".1" min="0" max="5" type="range" v-model="mentalModel.honesty">
              <output for="honesty" class="ml-1 tag is-dark">{{mentalModel.honesty}}</output>
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
              <input id="emotionality" class="slider has-output is-fullwidth" step=".1" min="0" max="5" type="range" v-model="mentalModel.emotionality">
              <output for="emotionality" class="ml-1 tag is-dark">{{mentalModel.emotionality}}</output>
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
              <input id="extraversion" class="slider has-output is-fullwidth" step=".1" min="0" max="5" type="range" v-model="mentalModel.extraversion">
              <output for="extraversion" class="ml-1 tag is-dark">{{mentalModel.extraversion}}</output>
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
              <input id="agreeableness" class="slider has-output is-fullwidth" step=".1" min="0" max="5" type="range" v-model="mentalModel.agreeableness">
              <output for="agreeableness" class="ml-1 tag is-dark">{{mentalModel.agreeableness}}</output>
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
              <input id="conscientiousness" class="slider has-output is-fullwidth" step=".1" min="0" max="5" type="range" v-model="mentalModel.conscientiousness">
              <output for="conscientiousness" class="ml-1 tag is-dark">{{mentalModel.conscientiousness}}</output>
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
              <input id="openness" class="slider has-output is-fullwidth" step=".1" min="0" max="5" type="range" v-model="mentalModel.openness">
              <output for="openness" class="ml-1 tag is-dark">{{mentalModel.openness}}</output>
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
          <button class="button is-link is-light" @click="showEditForm=false">Cancel</button>
        </div>
      </div>

    </div>
    <div v-else-if="showReplaceForm">
      <div class="subtitle">
        <span class="subtitle">Replace Mental State</span>
        <a class="is-pulled-right has-text-danger" @click="showReplaceForm=!showReplaceForm">
          <i class="fas fa-times"></i>
        </a>
      </div>

      <div class="select is-rounded is-success">
        <select v-model="selectedModelId">
          <option v-for="mModel in mentalModels" :key="mModel.id"
                  :value="mModel.id">{{mModel.title}}</option>
        </select>
      </div>

      <div class="field is-grouped mt-2">
        <div class="control">
          <button class="button is-link" @click="replaceModel">Submit</button>
        </div>
        <div class="control">
          <button class="button is-link is-light" @click="showReplaceForm=false">Cancel</button>
        </div>
      </div>

    </div>
    <div v-else>
      <span class="subtitle">{{ mentalModel.title }}</span>
      <a class="is-pulled-right icon has-text-danger" @click="showReplaceForm=!showReplaceForm">
        <i class="fas fa-retweet"></i>
      </a>
      <a class="is-pulled-right icon has-text-info" @click="showEditForm=!showEditForm">
        <i class="fas fa-pencil"></i>
      </a>

      <div>
        <p>Description: {{ mentalModel.description }}</p>
        <div class="box mt-2">
          <span class="title is-4">HEXACO Scores</span>
          <div class="list">
            <div class="list-item">
              <div class="list-item-title">Honesty: {{mentalModel.honesty}}</div>
            </div>
            <div class="list-item">
              <div class="list-item-title">Emotionality: {{mentalModel.emotionality}}</div>
            </div>
            <div class="list-item">
              <div class="list-item-title">Extraversion: {{mentalModel.extraversion}}</div>
            </div>
            <div class="list-item">
              <div class="list-item-title">Agreeableness: {{mentalModel.agreeableness}}</div>
            </div>
            <div class="list-item">
              <div class="list-item-title">Conscientiousness: {{mentalModel.conscientiousness}}</div>
            </div>
            <div class="list-item">
              <div class="list-item-title">Openness: {{mentalModel.openness}}</div>
            </div>

          </div>
        </div>
<!--        <p>Type: {{ event.type }}</p>-->
<!--        <p>Timeline: {{ event.timeline }}</p>-->
      </div>
    </div>


  </div>
</template>

<script setup>
import * as bulmaToast from 'bulma-toast'
import {doc, getDoc, getDocs, deleteDoc, updateDoc, arrayUnion, arrayRemove, query, collection} from "firebase/firestore"
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const {$fireDB} = useNuxtApp()
const emit = defineEmits(['redraw']);
const props = defineProps(['scenario', 'path', 'scenarioPath'])
const showEditForm = ref(false)
const showReplaceForm = ref(false)
const mentalModel = ref({
  title: "",
  description: "",
  honesty: 2.5,
  emotionality: 2.5,
  extraversion: 2.5,
  agreeableness: 2.5,
  conscientiousness: 2.5,
  openness: 2.5,
})
const mentalModels = ref()
const data = ref({});
const selectedModelId = ref({});

const handleSubmit = async () => {
  bulmaToast.toast({ message: 'Hello There' })
  await updateDoc(doc($fireDB, `${props.path}/${props.scenario.mentalStateModelId}`), mentalModel.value)
  // console.log(props.event)
  // const eventsArr = props.scenario.events
  // const index = eventsArr.findIndex(x => x.id == props.event.id)
  // eventsArr[index] = props.event
  // await updateDoc(doc($fireDB, props.path), {
  //   events: eventsArr
  // });
  emit('redraw')
};

const replaceModel = async () => {
  console.log('repl', selectedModelId.value)
  bulmaToast.toast({
    message: 'Updating Model',
    type: 'is-info',
    animate: { in: 'slideInRight', out: 'slideOutRight' }
  })
  if (props.scenario.mentalStateModelId == selectedModelId.value) {
    // do nothing and show toast
    bulmaToast.toast({ message: 'This model is currently associated to the scenario', type: 'is-warning',
      animate: { in: 'slideInRight', out: 'slideOutRight' }})
  } else {
    await updateDoc(doc($fireDB, props.scenarioPath), {
      mentalStateModelId: selectedModelId.value
    }).then(() => {
      // Show toast
      bulmaToast.toast({ message: 'Successfully updated model.', type: 'is-success',
        animate: { in: 'slideInRight', out: 'slideOutRight' }})
      emit('redraw')
    });

  }
}

onMounted(async () => {
  console.log('mounted ms', props.scenario, props.path)
  selectedModelId.value = props.scenario.mentalStateModelId
  // data.value = props.scenario
  const docSnap = await getDoc(doc($fireDB, `${props.path}/${props.scenario.mentalStateModelId}`))
  mentalModel.value = docSnap.data()
  console.log(mentalModel.value)

  // const querySnapshot = await getDocs(collection($, "cities"));
  // querySnapshot.forEach((doc) => {
  //   // doc.data() is never undefined for query doc snapshots
  //   console.log(doc.id, " => ", doc.data());
  // });

  const snapshot = await getDocs(collection($fireDB, props.path))
  // console.log(snapshot)
  // snapshot.forEach(doc => {
  //   console.log(doc.id, '=>', doc.data());
  // });
  mentalModels.value = snapshot.docs.map(documentSnapshot => {
    return {...documentSnapshot.data(), id: documentSnapshot.id}
  })

  console.log(mentalModels.value)
})
</script>