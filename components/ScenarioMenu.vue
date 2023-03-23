<template>
  <div>
    <div v-if="showEditForm">
      <div class="subtitle">
        Update Scenario
        <a class="icon has-text-danger is-pulled-right" @click="showEditForm=false">
          <i class="fas fa-times"></i>
        </a>
      </div>
      <FormKit type="form" v-model="data" @submit="handleSubmit" submit-label="Save">
        <FormKitSchema :schema="schema" />
      </FormKit>
<!--      <pre>-->
<!--        {{ data }}-->
<!--      </pre>-->
    </div>
    <div v-else>
      <div class="columns">
        <div class="column is-three-quarters">
          <h2 class="subtitle">{{scenario.title}}</h2>
        </div>
        <div class="column is-one-quarter">
          <div class="columns is-pulled-right">
            <div class="column is-half">
              <a class="icon has-text-info" @click="showEditForm=!showEditForm">
                <i class="fas fa-pencil"></i>
              </a>
            </div>
            <div class="column is-half">
              <a class="icon has-text-danger" @click="deleteScenario">
                <i class="fas fa-trash"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div>
        <p>Description: {{scenario.description}}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { doc, deleteDoc, updateDoc } from "firebase/firestore"
const {$fireDB} = useNuxtApp()
const emit = defineEmits(['redraw']);
const props = defineProps(['scenario', 'path'])
const showEditForm = ref(false)
const schema = [
  {
    $formkit: "text",
    name: "title",
    label: "Title",
    placeholder: "Enter your name..."
  },
  {
    $formkit: "text",
    name: "description",
    label: "Description",
    placeholder: "Enter your name..."
  }
];

const data = ref({
  title: 'title',
  description: 'description'
});

const handleSubmit = async () => {
  await updateDoc(doc($fireDB, props.path), data.value)
  // showEditForm.value = false
};

const deleteScenario = async () => {
  console.log('deleting', props.path)
  await deleteDoc(doc($fireDB, props.path));
  emit('redraw')
}
onMounted(async () => {
  // console.log('mounted sc', props.scenario)
  data.value = {
    title: props.scenario.title,
    description: props.scenario.description,
  }
})
</script>