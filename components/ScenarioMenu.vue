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
        <FormKitSchema :schema="schema"/>
      </FormKit>
      <!--      <pre>-->
      <!--        {{ data }}-->
      <!--      </pre>-->
    </div>
    <div v-else>
      <div class="columns">
        <div class="column is-three-quarters">
          <h2 class="subtitle">{{ scenario.title }}</h2>
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
        <div>Description: {{ scenario.description }}</div>
        <div class="card mt-2">
          <div class="card-header">
            <div class="card-header-title">
              Events
              <a class="ml-2 button is-pulled-right is-small is-primary" @click="showAddEvent=true">
                <i class="fas fa-plus"></i> Add New
              </a>
            </div>
          </div>
          <div class="card-content">
            <div class="content">
              <div class="list">
<!--                <div class="list-item" v-for="evt in scenario.events">-->
                <div class="list-item" v-for="evt in events">
                  <div class="list-item-content">
                    <div class="list-item-title" :class="isSelectedEvent(evt.id)">
                      <span class="tag mr-1" :class="evt.type=='Catalysing'?'is-link' : 'is-warning'">
                        {{ evt.type }}
                      </span>
                      {{ evt.description }}

                      <a class="is-pulled-right has-text-danger m-1" @click="deleteEvent(evt.id)">
                        <i class="fas fa-trash"></i>
                      </a>
                      <a class="is-pulled-right has-text-info m-1" @click="showUpdateEventForm(evt)">
                        <i class="fas fa-pencil"></i>
                      </a>
                    </div>
                    <div class="list-item-description">
                      <span class="tag">{{evt.timeline}}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="showAddEvent" class="mt-2 box">
                <div class="subtitle">
                  New Event
                </div>
                <div class="field is-horizontal">
                  <div class="field-label">
                    <label class="label">Type</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <div class="control">
                        <div class="select">
                          <select v-model="eventData.type">
                            <option>General</option>
                            <option>Catalysing</option>
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
                          <select v-model="eventData.timeline">
                            <option>Past</option>
                            <option>Present</option>
                          </select>
                        </div>
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
                        <textarea class="textarea" v-model="eventData.description" rows="2"></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="field is-grouped ">
                  <div class="control">
                    <button class="button is-link" @click="addEvent">Submit</button>
                  </div>
                  <div class="control">
                    <button class="button is-link is-light" @click="showAddEvent=false">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-header-title">
              Mental Model: {{mentalModel.title}}
            </div>
          </div>
          <div class="card-content">
            <div class="content">
              {{mentalModel.description}}
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import {doc, deleteDoc, updateDoc, getDoc, addDoc, collection, query, onSnapshot} from "firebase/firestore"
import * as bulmaToast from "bulma-toast";

const {$fireDB} = useNuxtApp()
const emit = defineEmits(['redraw']);
const props = defineProps(['scenario', 'path', 'mentalModelsPath', 'event'])
const showEditForm = ref(false)
const showAddEvent = ref(false)
const eventData = ref({type: '', description: ''})
const mentalModel = ref({title: '', description: ''})
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
const events = ref([])

const data = ref({
  title: 'title',
  description: 'description'
});

const addEvent = async () => {
  bulmaToast.toast({
    message: 'Adding/Updating Event',
    type: 'is-info',
    animate: {in: 'slideInRight', out: 'slideOutRight'}
  })
  // console.log(eventData.value)
  if (eventData.value.id) {
    await updateDoc(doc($fireDB, `${props.path}/events/${eventData.value.id}`), eventData.value).
    then(() => {
      showAddEvent.value = false
      bulmaToast.toast({
        message: 'Successfully Updated Event',
        type: 'is-primary',
        animate: {in: 'slideInRight', out: 'slideOutRight'}
      })

      emit('redraw')
    })
  } else {
    await addDoc(
        collection($fireDB, `${props.path}/events`), eventData.value)
        .then(() => {
          showAddEvent.value = false
          bulmaToast.toast({
            message: 'Successfully Created Event',
            type: 'is-primary',
            animate: {in: 'slideInRight', out: 'slideOutRight'}
          })

          emit('redraw')
        })
  }
}

const showUpdateEventForm = async (event) => {
  eventData.value = event
  showAddEvent.value = true
}

const deleteEvent = async (eventId) => {
  bulmaToast.toast({
    message: 'Removing Event',
    type: 'is-danger',
    animate: {in: 'slideInRight', out: 'slideOutRight'}
  })
  await deleteDoc(doc($fireDB, `${props.path}/events/${eventId}`)).
  then(() => {
    bulmaToast.toast({
      message: 'Successfully Removed Event',
      type: 'is-primary',
      animate: {in: 'slideInRight', out: 'slideOutRight'}
    })

    emit('redraw')
  });
}

const isSelectedEvent = (eventId) => {
  if (props.event && props.event.id == eventId)
    return 'has-text-primary'
}

const handleSubmit = async () => {
  await updateDoc(doc($fireDB, props.path), data.value)
};

const deleteScenario = async () => {
  console.log('deleting', props.path)
  await deleteDoc(doc($fireDB, props.path));
  emit('redraw')
}
onMounted(async () => {
  data.value = {
    title: props.scenario.title,
    description: props.scenario.description,
  }

  const docSnap = await getDoc(doc($fireDB, `${props.mentalModelsPath}/${props.scenario.mentalStateModelId}`))
  mentalModel.value = docSnap.data()

  const q = query(collection($fireDB, `${props.path}/events`))
  await onSnapshot(q, (querySnapshot) => {
    events.value = querySnapshot.docs.map((documentSnapshot) => {
      return {...documentSnapshot.data(), id: documentSnapshot.id}
    })
  })
})
</script>