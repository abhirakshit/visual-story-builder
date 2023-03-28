<template>
  <div>
    <h2 class="subtitle">
      Scenarios
      <button class="button is-outlined is-pulled-right" @click="createNewScenario()">
        <font-awesome-icon icon="plus"/>&nbsp;Add Scenario
      </button>
    </h2>
    <div class="list">
      <!--                <div class="list-item" v-for="evt in scenario.events">-->
      <div class="list-item" v-for="sc in props.scenarios">
        <div class="list-item-content">
          <div class="list-item-title">
            <a @click="$emit('showScenario', sc.id)">
              {{ sc.title }}
              <span class="tag mr-1 is-warning" v-if="setupInComplete(sc)">
                Setup Incomplete
              </span>
            </a>
          </div>
          <div class="list-item-description">
            <p>{{ sc.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {addDoc, collection} from "firebase/firestore";

const emit = defineEmits(['showScenario']);
const props = defineProps(['scenarios', 'scenarioCollPath'])
const setupInComplete = (sc) => {
  return sc.mentalStateModelId == null
}
// const showScenario = () => {
//   emit('show-scenario')
// }

const createNewScenario = async () => {
  await addDoc(
      collection($fireDB, props.scenarioCollPath),
      {
        title: 'New Scenario',
        description: 'New Scenario Description',
      }).then(function (docRef) {
    console.log("Document written with ID: ", docRef.id);
    // setupSelectedScenario(docRef.id)
    emit('showScenario', docRef.id)
  })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
}

onMounted(async () => {
  console.log('SCC', props.scenarios)
})
</script>