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
            </div>
            <div class="card-header-icon">
              <a class="ml-2 button is-small is-primary" @click="showAddEvent=true">
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
                      <span class="tag mr-1" :class="getEventTagColor(evt.type)">
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

        <div class="card" v-if="showReplaceForm">
          <div class="card-header">
            <div class="card-header-title subtitle">Update Mental Model</div>
            <div class="card-header-icon">
              <a class="has-text-danger" @click="showReplaceForm=false">
                <i class="fas fa-times"></i>
              </a>
            </div>
          </div>
          <div class="card-content">
            <div class="select is-rounded is-success">
              <select v-model="selectedModelId">
                <option v-for="mModel in mentalModels" :key="mModel.id"
                        :value="mModel.id">{{ mModel.title }}
                </option>
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
        </div>
        <div class="card" v-else>
          <div class="card-header">
            <div class="card-header-title">
              Mental Model: <a @click="$emit('showMentalModel', scenario)">{{mentalModel.title}}</a>
            </div>
            <button class="card-header-icon">
              <a class="icon has-text-danger" @click="showReplaceForm=!showReplaceForm">
                <i class="fas fa-retweet"></i>
              </a>
            </button>
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
import {doc, deleteDoc, updateDoc, getDoc, addDoc, collection, query, onSnapshot, getDocs} from "firebase/firestore"
import * as bulmaToast from "bulma-toast";

const {$fireDB} = useNuxtApp()
const emit = defineEmits(['redraw', 'redrawReselectScenario', 'showMentalModel']);
const props = defineProps(['scenario', 'path', 'mentalModelsPath', 'event', 'scenarioCollPath'])
const showEditForm = ref(false)
const showAddEvent = ref(false)
const showReplaceForm = ref(false)
const eventData = ref({type: '', description: ''})
const mentalModel = ref({title: '', description: ''})
const selectedModelId = ref('');
const mentalModels = ref([])
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

const getEventTagColor = (type) => {
  switch (type) {
    case 'Excitation':
      return 'is-success';
    case 'Catalysing':
      return 'is-warning';
    case 'Inhibition':
      return 'is-danger';
  }
}

const resetEventDataValue = () => {
  eventData.value = {description: '', timeline: '', type: ''}
}
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
      resetEventDataValue()
      emit('redrawReselectScenario', props.scenario)
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
          resetEventDataValue()
          emit('redrawReselectScenario', props.scenario)
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
    return 'has-text-primary-dark'
}

const handleSubmit = async () => {
  await updateDoc(doc($fireDB, props.path), data.value)
};

const deleteScenario = async () => {
  console.log('deleting', props.path)
  //TODO remove all events first
  bulmaToast.toast({
    message: 'Please Wait...',
    type: 'is-warning',
    animate: {in: 'slideInRight', out: 'slideOutRight'}
  })
  events.value.map(async (evt) => {
    await deleteDoc(doc($fireDB, `${props.path}/events/${evt.id}`))
  })
  await deleteDoc(doc($fireDB, props.path)).then(() => {
    bulmaToast.toast({
      message: 'Successfully Removed Scenario and Events',
      type: 'is-primary',
      animate: {in: 'slideInRight', out: 'slideOutRight'}
    })
    emit('redraw')
  });
}

const replaceModel = async () => {
  bulmaToast.toast({
    message: 'Updating Model',
    type: 'is-info',
    animate: {in: 'slideInRight', out: 'slideOutRight'}
  })
  if (props.scenario.mentalStateModelId == selectedModelId.value) {
    // do nothing and show toast
    bulmaToast.toast({
      message: 'This model is currently associated to the scenario', type: 'is-warning',
      animate: {in: 'slideInRight', out: 'slideOutRight'}
    })
  } else {
    await updateDoc(doc($fireDB, props.path), {
      mentalStateModelId: selectedModelId.value
    }).then(() => {
      // Show toast
      bulmaToast.toast({
        message: 'Successfully updated model.', type: 'is-success',
        animate: {in: 'slideInRight', out: 'slideOutRight'}
      })
      emit('redraw')
    });
  }
}

onMounted(async () => {
  if (props.scenario) {
    console.log(props.scenario)
    data.value = {
      title: props.scenario.title,
      description: props.scenario.description,
    }

    // Scenario Mental Model
    if (props.scenario.mentalStateModelId) {
      const docSnap = await getDoc(doc($fireDB, `${props.mentalModelsPath}/${props.scenario.mentalStateModelId}`))
      mentalModel.value = docSnap.data()
    }

    // Events
    const q = query(collection($fireDB, `${props.path}/events`))
    await onSnapshot(q, (querySnapshot) => {
      events.value = querySnapshot.docs.map((documentSnapshot) => {
        return {...documentSnapshot.data(), id: documentSnapshot.id}
      })
    })

    // All Mental Models
    const snapshot = await getDocs(collection($fireDB, props.mentalModelsPath))
    mentalModels.value = snapshot.docs.map(documentSnapshot => {
      return {...documentSnapshot.data(), id: documentSnapshot.id}
    })
  } else {
    console.error('No scenario provided')
    bulmaToast.toast({
      message: 'Scenario Error',
      type: 'is-danger',
      animate: {in: 'slideInRight', out: 'slideOutRight'}
    })
  }
})
</script>