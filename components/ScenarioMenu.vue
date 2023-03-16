<template>
  <div>
    <div class="columns">
      <div class="column is-three-quarters">
        <h2 class="subtitle">{{scenario.title}}</h2>
      </div>
      <div class="column is-one-quarter">
        <div class="columns is-pulled-right">
          <div class="column is-half">
            <a class="icon has-text-info">
              <i class="fas fa-pencil"></i>
            </a>
<!--            <button class="button m-1 is-outlined is-pulled-right is-small" @click="editScenario">-->
<!--              <font-awesome-icon icon="pencil" />-->
<!--            </button>-->
          </div>
          <div class="column is-half">
            <a class="icon has-text-danger" @click="deleteScenario">
              <i class="fas fa-trash"></i>
            </a>
<!--            <button class="button m-1 is-outlined is-pulled-right is-small" @click="deleteScenario">-->
<!--              <font-awesome-icon icon="trash" />-->
<!--            </button>-->
          </div>
        </div>


      </div>
    </div>
    <div>
      <p>Description: {{scenario.description}}</p>
    </div>
  </div>
</template>

<script setup>
import { doc, deleteDoc } from "firebase/firestore"
const {$fireDB} = useNuxtApp()
const emit = defineEmits(['redraw']);
const props = defineProps(['scenario', 'path'])

const deleteScenario = async () => {
  console.log('deleting', props.path)
  await deleteDoc(doc($fireDB, props.path));
  emit('redraw')
}
onMounted(async () => {
  console.log('mounted sc', props)
})

</script>