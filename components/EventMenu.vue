<template>
  <div>
    <div v-if="showEditForm">
      <div class="subtitle">
        Update Event
        <!--        <a class="icon has-text-danger is-pulled-right" @click="showEditForm=false">-->
        <!--          <i class="fas fa-times"></i>-->
        <!--        </a>-->
      </div>

      <div class="field is-horizontal">
        <div class="field-label">
          <label class="label">Description</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <input class="input" type="text" placeholder="Small sized input" v-model="event.description">
            </div>
          </div>
        </div>
      </div>
      <div class="field is-horizontal">
        <div class="field-label">
          <label class="label">Type</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <div class="select">
                <select v-model="event.type">
                  <option>Excitation</option>
                  <option>Catalysing</option>
                  <option>Inhibition</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label">
          <label class="label">Timeline</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <div class="select">
                <select v-model="event.timeline">
                  <option>Past</option>
                  <option>Present</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="field is-grouped ">
        <div class="control">
          <button class="button is-link" @click="handleSubmit">Submit</button>
        </div>
        <div class="control">
          <button class="button is-link is-light" @click="showEditForm=false">Cancel</button>
        </div>
      </div>


      <!--      <FormKit type="form" v-model="data" @submit="handleSubmit">-->
      <!--        <FormKitSchema :schema="schema" />-->
      <!--      </FormKit>-->

    </div>
    <div v-else>
      <div class="columns">
        <div class="column is-three-quarters">
          <h2 class="subtitle">Event</h2>
        </div>
        <div class="column is-one-quarter">
          <div class="columns is-pulled-right">
            <div class="column is-half">
              <a class="icon has-text-info" @click="showEditForm=!showEditForm">
                <i class="fas fa-pencil"></i>
              </a>
            </div>
            <div class="column is-half">
              <a class="icon has-text-danger" @click="deleteEvent">
                <i class="fas fa-trash"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div>
        <p>Description: {{ event.description }}</p>
        <p>Type: {{ event.type }}</p>
        <p>Timeline: {{ event.timeline }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {doc, deleteDoc, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore"

const {$fireDB} = useNuxtApp()
const emit = defineEmits(['redraw']);
const props = defineProps(['scenario', 'event', 'path'])
const showEditForm = ref(false)
const schema = [
  {
    $formkit: "text",
    name: "description",
    label: "Description",
  },
  {
    $formkit: "dropdown",
    name: "timeline",
    label: "Timeline",
    placeholder: "Enter your name..."
  },
  {
    $formkit: "dropdown",
    name: "type",
    label: "Type",
    placeholder: "Enter your name..."
  }
];

const data = ref({});

const handleSubmit = async () => {
  console.log(props.event)
  const eventsArr = props.scenario.events
  const index = eventsArr.findIndex(x => x.id == props.event.id)
  eventsArr[index] = props.event
  await updateDoc(doc($fireDB, props.path), {
    events: eventsArr
  });
  emit('redraw')
};

const deleteEvent = async () => {
  console.log('deleting', props.path)
  await updateDoc(doc($fireDB, props.path), {
    events: arrayRemove(props.event)
  });
  emit('redraw')
}

onMounted(async () => {
  console.log('mounted sc', props.scenario)
  // data.value = props.scenario
})
</script>