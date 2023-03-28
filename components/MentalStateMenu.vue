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

      <!--      Emotional States-->
      <div class="box">
        <div class="subtitle">
          Emotional States
          <a class="is-pulled-right icon has-text-info m-1" v-if="!showEmStatesForm" @click="showEmStatesForm=true">
            <i class="fas fa-plus"></i>
          </a>
          <a class="is-pulled-right icon has-text-danger m-1" v-if="showEmStatesForm" @click="showEmStatesForm=false">
            <i class="fas fa-minus"></i>
          </a>
        </div>
        <div v-if="showEmStatesForm">
          <div class="field is-horizontal">
            <div class="field-label">
              <label class="label">Anger</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input id="honesty" class="slider has-output is-fullwidth" step=".1" min="0" max="5" type="range"
                         v-model="mentalModel.emotionalData.anger">
                  <output for="honesty" class="ml-1 tag is-dark">{{ mentalModel.emotionalData.anger }}</output>
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
                         type="range" v-model="mentalModel.emotionalData.fear">
                  <output for="emotionality" class="ml-1 tag is-dark">{{ mentalModel.emotionalData.fear }}</output>
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
                         type="range" v-model="mentalModel.emotionalData.disgust">
                  <output for="extraversion" class="ml-1 tag is-dark">{{ mentalModel.emotionalData.disgust }}</output>
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
                         type="range" v-model="mentalModel.emotionalData.happiness">
                  <output for="agreeableness" class="ml-1 tag is-dark">{{
                      mentalModel.emotionalData.happiness
                    }}
                  </output>
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
                         type="range" v-model="mentalModel.emotionalData.sadness">
                  <output for="conscientiousness" class="ml-1 tag is-dark">{{ mentalModel.emotionalData.sadness }}
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
                         v-model="mentalModel.emotionalData.surprise">
                  <output for="openness" class="ml-1 tag is-dark">{{ mentalModel.emotionalData.surprise }}</output>
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
                         v-model="mentalModel.emotionalData.contempt">
                  <output for="openness" class="ml-1 tag is-dark">{{ mentalModel.emotionalData.contempt }}</output>
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
          <a class="is-pulled-right icon has-text-info m-1" v-if="!showHEXACOForm" @click="showHEXACOForm=true">
            <i class="fas fa-plus"></i>
          </a>
          <a class="is-pulled-right icon has-text-danger m-1" v-if="showHEXACOForm" @click="showHEXACOForm=false">
            <i class="fas fa-minus"></i>
          </a>
        </div>
        <div v-if="showHEXACOForm">
          <div class="field is-horizontal">
            <div class="field-label">
              <label class="label">Honesty</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input id="honesty" class="slider has-output is-fullwidth" step=".1" min="0" max="5" type="range"
                         v-model="mentalModel.personalityData.honesty">
                  <output for="honesty" class="ml-1 tag is-dark">{{ mentalModel.personalityData.honesty }}</output>
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
                         type="range" v-model="mentalModel.personalityData.emotionality">
                  <output for="emotionality" class="ml-1 tag is-dark">{{
                      mentalModel.personalityData.emotionality
                    }}
                  </output>
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
                         type="range" v-model="mentalModel.personalityData.extraversion">
                  <output for="extraversion" class="ml-1 tag is-dark">{{
                      mentalModel.personalityData.extraversion
                    }}
                  </output>
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
                         type="range" v-model="mentalModel.personalityData.agreeableness">
                  <output for="agreeableness" class="ml-1 tag is-dark">{{
                      mentalModel.personalityData.agreeableness
                    }}
                  </output>
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
                         type="range" v-model="mentalModel.personalityData.conscientiousness">
                  <output for="conscientiousness" class="ml-1 tag is-dark">
                    {{ mentalModel.personalityData.conscientiousness }}
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
                         v-model="mentalModel.personalityData.openness">
                  <output for="openness" class="ml-1 tag is-dark">{{ mentalModel.personalityData.openness }}</output>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--      HEXACO-->
      <!--      <div class="field is-horizontal">-->
      <!--        <div class="field-label">-->
      <!--          <label class="label">Honesty</label>-->
      <!--        </div>-->
      <!--        <div class="field-body">-->
      <!--          <div class="field">-->
      <!--            <div class="control">-->
      <!--              <input id="honesty" class="slider has-output is-fullwidth" step=".1" min="0" max="5" type="range" v-model="mentalModel.honesty">-->
      <!--              <output for="honesty" class="ml-1 tag is-dark">{{mentalModel.honesty}}</output>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="field is-horizontal">-->
      <!--        <div class="field-label">-->
      <!--          <label class="label">Emotionality</label>-->
      <!--        </div>-->
      <!--        <div class="field-body">-->
      <!--          <div class="field">-->
      <!--            <div class="control">-->
      <!--              <input id="emotionality" class="slider has-output is-fullwidth" step=".1" min="0" max="5" type="range" v-model="mentalModel.emotionality">-->
      <!--              <output for="emotionality" class="ml-1 tag is-dark">{{mentalModel.emotionality}}</output>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="field is-horizontal">-->
      <!--        <div class="field-label">-->
      <!--          <label class="label">Extraversion</label>-->
      <!--        </div>-->
      <!--        <div class="field-body">-->
      <!--          <div class="field">-->
      <!--            <div class="control">-->
      <!--              <input id="extraversion" class="slider has-output is-fullwidth" step=".1" min="0" max="5" type="range" v-model="mentalModel.extraversion">-->
      <!--              <output for="extraversion" class="ml-1 tag is-dark">{{mentalModel.extraversion}}</output>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="field is-horizontal">-->
      <!--        <div class="field-label">-->
      <!--          <label class="label">Agreeableness</label>-->
      <!--        </div>-->
      <!--        <div class="field-body">-->
      <!--          <div class="field">-->
      <!--            <div class="control">-->
      <!--              <input id="agreeableness" class="slider has-output is-fullwidth" step=".1" min="0" max="5" type="range" v-model="mentalModel.agreeableness">-->
      <!--              <output for="agreeableness" class="ml-1 tag is-dark">{{mentalModel.agreeableness}}</output>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="field is-horizontal">-->
      <!--        <div class="field-label">-->
      <!--          <label class="label">Conscientiousness</label>-->
      <!--        </div>-->
      <!--        <div class="field-body">-->
      <!--          <div class="field">-->
      <!--            <div class="control">-->
      <!--              <input id="conscientiousness" class="slider has-output is-fullwidth" step=".1" min="0" max="5" type="range" v-model="mentalModel.conscientiousness">-->
      <!--              <output for="conscientiousness" class="ml-1 tag is-dark">{{mentalModel.conscientiousness}}</output>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="field is-horizontal">-->
      <!--        <div class="field-label">-->
      <!--          <label class="label">Openness</label>-->
      <!--        </div>-->
      <!--        <div class="field-body">-->
      <!--          <div class="field">-->
      <!--            <div class="control">-->
      <!--              <input id="openness" class="slider has-output is-fullwidth" step=".1" min="0" max="5" type="range" v-model="mentalModel.openness">-->
      <!--              <output for="openness" class="ml-1 tag is-dark">{{mentalModel.openness}}</output>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->

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
    <!--    Replacement Form-->
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

    <!--    View Details-->
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
          <div class="subtitle">
            Emotional States
            <a class="is-pulled-right icon has-text-info m-1" v-if="!showEmStates" @click="showEmStates=true">
              <i class="fas fa-plus"></i>
            </a>
            <a class="is-pulled-right icon has-text-danger m-1" v-if="showEmStates" @click="showEmStates=false">
              <i class="fas fa-minus"></i>
            </a>
          </div>
          <div class="list" v-if="showEmStates">
            <div class="list-item">
              <div class="list-item-title">Anger: {{ mentalModel.emotionalData.anger }}</div>
            </div>
            <div class="list-item">
              <div class="list-item-title">Fear: {{ mentalModel.emotionalData.fear }}</div>
            </div>
            <div class="list-item">
              <div class="list-item-title">Disgust: {{ mentalModel.emotionalData.disgust }}</div>
            </div>
            <div class="list-item">
              <div class="list-item-title">Happiness: {{ mentalModel.emotionalData.happiness }}</div>
            </div>
            <div class="list-item">
              <div class="list-item-title">Sadness: {{ mentalModel.emotionalData.sadness }}</div>
            </div>
            <div class="list-item">
              <div class="list-item-title">Surprise: {{ mentalModel.emotionalData.surprise }}</div>
            </div>
            <div class="list-item">
              <div class="list-item-title">Contempt: {{ mentalModel.emotionalData.contempt }}</div>
            </div>
          </div>
        </div>
        <div class="box mt-2">
          <div class="subtitle">
            Personality Scores
            <a class="is-pulled-right icon has-text-info m-1" v-if="!showHEXACO" @click="showHEXACO=true">
              <i class="fas fa-plus"></i>
            </a>
            <a class="is-pulled-right icon has-text-danger m-1" v-if="showHEXACO" @click="showHEXACO=false">
              <i class="fas fa-minus"></i>
            </a>
          </div>
          <div class="list" v-if="showHEXACO">
            <div class="list-item">
              <div class="list-item-title">Honesty: {{ mentalModel.personalityData.honesty }}</div>
            </div>
            <div class="list-item">
              <div class="list-item-title">Emotionality: {{ mentalModel.personalityData.emotionality }}</div>
            </div>
            <div class="list-item">
              <div class="list-item-title">Extraversion: {{ mentalModel.personalityData.extraversion }}</div>
            </div>
            <div class="list-item">
              <div class="list-item-title">Agreeableness: {{ mentalModel.personalityData.agreeableness }}</div>
            </div>
            <div class="list-item">
              <div class="list-item-title">Conscientiousness: {{ mentalModel.personalityData.conscientiousness }}</div>
            </div>
            <div class="list-item">
              <div class="list-item-title">Openness: {{ mentalModel.personalityData.openness }}</div>
            </div>

          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import * as bulmaToast from 'bulma-toast'
import {
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  collection
} from "firebase/firestore"
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const {$fireDB} = useNuxtApp()
const emit = defineEmits(['redraw']);
const props = defineProps(['scenario', 'path', 'scenarioPath'])
const showHEXACO = ref(false)
const showHEXACOForm = ref(false)
const showEmStates = ref(false)
const showEmStatesForm = ref(false)
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
  bulmaToast.toast({
    message: 'Updating Mental Model',
    type: 'is-info',
    animate: {in: 'slideInRight', out: 'slideOutRight'}
  })
  await updateDoc(
      doc($fireDB, `${props.path}/${props.scenario.mentalStateModelId}`), mentalModel.value)
      .then(() => {
        // Show toast
        bulmaToast.toast({
          message: 'Successfully updated mental model.', type: 'is-success',
          animate: {in: 'slideInRight', out: 'slideOutRight'}
        })
        emit('redraw')
      });
  emit('redraw')
};

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
    await updateDoc(doc($fireDB, props.scenarioPath), {
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
  console.log('ms mounted')
  selectedModelId.value = props.scenario.mentalStateModelId
  const docSnap = await getDoc(doc($fireDB, `${props.path}/${props.scenario.mentalStateModelId}`))
  mentalModel.value = docSnap.data()

  const snapshot = await getDocs(collection($fireDB, props.path))
  mentalModels.value = snapshot.docs.map(documentSnapshot => {
    return {...documentSnapshot.data(), id: documentSnapshot.id}
  })
})
</script>