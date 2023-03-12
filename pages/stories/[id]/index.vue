<template>
  <div>
    <NuxtLayout name="logged-in">
      <AddMenu></AddMenu>
      <div>
        <nav class="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li><NuxtLink>Home</NuxtLink></li>
            <li><NuxtLink to="/stories">Stories</NuxtLink></li>
            <li class="is-active"><a href="#" aria-current="page">{{ story? story.title:"" }}</a></li>
          </ul>
        </nav>

        <div class="box">
          <button class="button m-1 is-outlined">
            <font-awesome-icon icon="circle" />
            &nbsp;Event
          </button>
          <button class="button m-1 is-info is-outlined">
            <font-awesome-icon icon="square" />&nbsp;Reaction</button>
          <button class="button m-1 is-outlined">
            <font-awesome-icon icon="arrow-right" />&nbsp;Connection</button>
          <button class="button m-1 is-outlined">
            <font-awesome-icon icon="circle" /> &nbsp;Mental Representation
          </button>
        </div>
        <div class="columns">
          <div class="column is-three-quarters">
            <div class="box">
              <div class="columns">
                <div class="column is-three-quarters">
                  <h2 class="subtitle">Scenario Builder</h2>
                </div>
                <div class="column is-one-quarter">
                  <button class="button m-1 is-outlined is-pulled-right" @click="addScenarioToStage">
                    <font-awesome-icon icon="plus" />&nbsp;Add Scenario
                  </button>
                </div>
              </div>
              <div id="scenarios">
                <div id="canvas"></div>
              </div>
            </div>
          </div>
          <div class="column is-one-quarter">
            <div class="box sticky-box">
              <h2 class="subtitle">Menu</h2>
              <div id="context-menu"></div>
            </div>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup>
import {collection, getDocs, getDoc, doc, query} from "firebase/firestore";
import AddMenu from "../../../components/AddMenu";
definePageMeta({
  middleware: ["auth"],
  layout: false
})
const route = useRoute()
const firebaseUser = useFirebaseUser();
const {$fireDB} = useNuxtApp()
const story = ref()
const scenarios = ref()
const events = ref()
const mentalStates = ref()
let sceneWidth = 1000;
let sceneHeight = 1000;
let stage;

const setupAddMenu = () => {
  // https://konvajs.org/docs/sandbox/Canvas_Context_Menu.html
  console.log('context')
  let currentShape;
  let menuNode = document.getElementById('menu');
  console.log(menuNode)
  // document.getElementById('pulse-button').addEventListener('click', () => {
  //   currentShape.to({
  //     scaleX: 2,
  //     scaleY: 2,
  //     onFinish: () => {
  //       currentShape.to({ scaleX: 1, scaleY: 1 });
  //     },
  //   });
  // });
  // document.getElementById('delete-button').addEventListener('click', () => {
  //   currentShape.destroy();
  // });

  window.addEventListener('click', () => {
    // hide menu
    menuNode.style.display = 'none';
  });

  stage.on('contextmenu', function (e) {

    // prevent default behavior
    e.evt.preventDefault();
    if (e.target != stage) {
      // if we are on empty place of the stage we will do nothing
      return;
    }
    currentShape = e.target;
    // show menu
    menuNode.style.display = 'initial';
    var containerRect = stage.container().getBoundingClientRect();
    console.log('evt', e.evt.clientY, e.evt.clientX)
    console.log('stage', containerRect.top, containerRect.left)
    console.log('mouse', stage.getPointerPosition().y, stage.getPointerPosition().x)
    // console.log(containerRect.top, containerRect.left, stage.getPointerPosition().y, stage.getPointerPosition().x)
    console.log(containerRect.top + stage.getPointerPosition().y + 4 + 'px', containerRect.left + stage.getPointerPosition().x + 4 + 'px')
    // menuNode.style.top = stage.getPointerPosition().y + 4 + 'px';
    // menuNode.style.left = stage.getPointerPosition().x + 4 + 'px';
    menuNode.style.top =
        containerRect.top + stage.getPointerPosition().y + 'px';
    menuNode.style.left =
        containerRect.left + stage.getPointerPosition().x + 'px';
  });
}
const setupCanvas = () => {
  // first we need to create a stage
  // const canvas = document.getElementById('canvas');
  stage = new Konva.Stage({
    container: 'canvas',   // id of container <div>
    width: sceneWidth,
    height: sceneHeight
  });
  setupAddMenu()

// then create layer
  const layer = new Konva.Layer();

// create our shape
//   const circle = new Konva.Circle({
//     x: stage.width() / 2,
//     y: stage.height() / 2,
//     radius: 70,
//     fill: 'red',
//     stroke: 'black',
//     strokeWidth: 4
//   });

// add the shape to the layer
//   layer.add(circle);

// add the layer to the stage
  stage.add(layer);

// draw the image
  layer.draw();
}

const setupData = async () => {
  const docSnap = await getDoc(
      doc($fireDB, `users/${firebaseUser.value.uid}/stories/${route.params.id}`)
  );
  story.value = docSnap.data()

  const querySnapshot = await getDocs(
      query(collection($fireDB, `users/${firebaseUser.value.uid}/stories/${route.params.id}/scenarios`)));
  scenarios.value = querySnapshot.docs.map((documentSnapshot) => {
    return {...documentSnapshot.data(), id: documentSnapshot.id}
  })
}

const fitStageIntoParentContainer = () => {
  let container = document.querySelector('#scenarios');

  // now we need to fit stage into parent container
  let containerWidth = container.offsetWidth;

  // but we also make the full scene visible
  // so we need to scale all objects on canvas
  let scale = containerWidth / sceneWidth;

  stage.width(sceneWidth * scale);
  stage.height(sceneHeight * scale);
  stage.scale({ x: scale, y: scale });
}

const addScenarioToStage = () => {
  console.log('add scene')
}

onMounted(async () => {
  console.log('mounted')
  setupData()
  setupCanvas()
  fitStageIntoParentContainer()
})
</script>

<style>
.sticky-box {
  position: sticky;
  display: inline-block;
  vertical-align: top;
  max-height: 100vh;
  overflow-y: auto;
  width: 100%;
  top: 30px;
  bottom: 0;
  padding: 30px;
}
</style>