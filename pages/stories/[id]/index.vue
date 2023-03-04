<template>
  <div>
    <NuxtLayout name="logged-in">
      <div class="container">
        <nav class="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li><NuxtLink>Home</NuxtLink></li>
            <li><NuxtLink to="/stories">Stories</NuxtLink></li>
            <li class="is-active"><a href="#" aria-current="page">{{ story? story.title:"" }}</a></li>
          </ul>
        </nav>

        <div class="columns">
          <div class="column is-three-quarters">
            <div class="box">
              <h2 class="subtitle">Scenario Builder</h2>
              <div id="canvas"></div>
            </div>
          </div>
          <div class="column is-one-quarter">
            <div class="box">
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

const setupCanvas = () => {
  // first we need to create a stage
  var stage = new Konva.Stage({
    container: 'canvas',   // id of container <div>
    width: 500,
    height: 500
  });
  stage.on('contextmenu', function (e) {
    // prevent default behavior
    e.evt.preventDefault();
    if (e.target === stage) {
      // if we are on empty place of the stage we will do nothing
      console.log('context')
      return;
    }
    // currentShape = e.target;
    // // show menu
    // menuNode.style.display = 'initial';
    // var containerRect = stage.container().getBoundingClientRect();
    // menuNode.style.top =
    //     containerRect.top + stage.getPointerPosition().y + 4 + 'px';
    // menuNode.style.left =
    //     containerRect.left + stage.getPointerPosition().x + 4 + 'px';
  });
// then create layer
  var layer = new Konva.Layer();

// create our shape
  var circle = new Konva.Circle({
    x: stage.width() / 2,
    y: stage.height() / 2,
    radius: 70,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 4
  });

// add the shape to the layer
  layer.add(circle);

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
}

onMounted(async () => {
  console.log('mounted')
  setupData()
  setupCanvas()
})
</script>