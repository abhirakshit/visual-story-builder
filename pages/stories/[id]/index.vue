<template>
  <div>
    <NuxtLayout name="logged-in">
<!--    <NuxtLayout>-->
      <AddMenu></AddMenu>
      <div>
        <nav class="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li><NuxtLink>Home</NuxtLink></li>
            <li><NuxtLink to="/stories">Stories</NuxtLink></li>
            <li class="is-active"><a href="#" aria-current="page">{{ story? story.title:"" }}</a></li>
          </ul>
        </nav>

<!--        <div class="box">-->
<!--          <button class="button m-1 is-outlined">-->
<!--            <font-awesome-icon icon="circle" />-->
<!--            &nbsp;Event-->
<!--          </button>-->
<!--          <button class="button m-1 is-info is-outlined">-->
<!--            <font-awesome-icon icon="square" />&nbsp;Reaction</button>-->
<!--          <button class="button m-1 is-outlined">-->
<!--            <font-awesome-icon icon="arrow-right" />&nbsp;Connection</button>-->
<!--          <button class="button m-1 is-outlined">-->
<!--            <font-awesome-icon icon="circle" /> &nbsp;Mental Representation-->
<!--          </button>-->
<!--          <button id='toggleBorder'>Toggle border rect</button>-->
<!--        </div>-->
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
                <div id="canvas" class="scenario-box"></div>
              </div>
            </div>
          </div>
          <div class="column is-one-quarter">
            <div class="box sticky-box">
              <component :is="getMenuComponent()" v-bind="menuProps" @redraw="redraw"/>
            </div>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup>
import {collection, getDocs, getDoc, doc, query, addDoc, onSnapshot} from "firebase/firestore";
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
let stage, layer;

const menuProps = ref();
const currentMenuComponent = ref();
currentMenuComponent.value = 'empty'

const ScenarioMenu = resolveComponent('ScenarioMenu')
const EmptyMenu = resolveComponent('EmptyMenu')

const getMenuComponent = () => {
  // console.log('cmc', currentMenuComponent.value)
  switch (currentMenuComponent.value) {
    case "scenario-menu":
      return ScenarioMenu
    case "empty":
      return EmptyMenu
    default:
      return EmptyMenu
  }
}

const redraw = () => {
  console.log('redraw')
  layer.removeChildren()
  setupScenarios()
  resetMenuComponent()
}
// const getMenuProps = () => {
//   // https://jwkicklighter.com/posts/pass-props-to-dynamic-vue-components/
//   switch (currentMenuComponent.value) {
//     case "scenario-menu":
//       return {}
//     case "empty":
//       return {}
//     default:
//       return {}
//   }
// }

const resetMenuComponent = () => {
  currentMenuComponent.value = 'empty'
}

const setupSelectedScenario = (groupId) => {
  console.log("Group Selected", groupId)
  // Setup scenario as prop
  let sc = scenarios.value.find((sc) => {
    return sc.id == groupId
  })
  console.log('sc', sc)
  menuProps.value = {
    'scenario': sc,
    'path': `users/${firebaseUser.value.uid}/stories/${route.params.id}/scenarios/${groupId}`
  }

  //change dynamic templates
  currentMenuComponent.value = "scenario-menu"
}

const getOffsetPointerPos = (clientX, clientY) => {
  console.log({clientX, clientY})
  // let offset = 84
  let offset = 0
  return {x: clientX-offset, y: clientY-offset}
}
const setupAddMenu = () => {
  // https://konvajs.org/docs/sandbox/Canvas_Context_Menu.html
  // console.log('context')
  let currentShape;
  let menuNode = document.getElementById('menu');
  // console.log(menuNode)
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
    // console.log('Click window')
    // hide menu
    menuNode.style.display = 'none';
    // resetMenuComponent()
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
    // console.log('evt', e.evt.clientY, e.evt.clientX)
    // console.log('stage', containerRect.top, containerRect.left)
    // console.log('mouse', stage.getPointerPosition().y, stage.getPointerPosition().x)
    // console.log(containerRect.top, containerRect.left, stage.getPointerPosition().y, stage.getPointerPosition().x)
    // console.log(containerRect.top + stage.getPointerPosition().y + 4 + 'px', containerRect.left + stage.getPointerPosition().x + 4 + 'px')
    menuNode.style.top = stage.getPointerPosition().y + 140 + 'px';
    menuNode.style.left = stage.getPointerPosition().x + 20 + 'px';
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
  layer = new Konva.Layer();

// add the shape to the layer
//   layer.add(circle);
}

const setupData = async () => {
  const docSnap = await getDoc(doc($fireDB, `users/${firebaseUser.value.uid}/stories/${route.params.id}`));
  story.value = docSnap.data()
  const q = query(collection($fireDB, `users/${firebaseUser.value.uid}/stories/${route.params.id}/scenarios`))
  const unsubscribe = await onSnapshot(q, (querySnapshot) => {
    // console.log(querySnapshot.docs)
    scenarios.value = querySnapshot.docs.map((documentSnapshot) => {
      // console.log(documentSnapshot.data())
      return {...documentSnapshot.data(), id: documentSnapshot.id}
    })
    // console.log('all scen', scenarios.value)
    setupScenarios()
  })
}

const getScale = () => {
  let container = document.querySelector('#scenarios');

  // now we need to fit stage into parent container
  let containerWidth = container.offsetWidth;

  // but we also make the full scene visible
  // so we need to scale all objects on canvas
  let scale = containerWidth / sceneWidth;
  return {width: sceneWidth * scale, height: sceneHeight * scale}
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

const addScenarioToStage = async () => {
  await addDoc(
      collection($fireDB, `users/${firebaseUser.value.uid}/stories/${route.params.id}/scenarios`),
      {title: 'New Scenario', description: 'New Description'})
  redraw();
}

const scenarioGroupMapping = [];
const setupScenarios = () => {
  // for each scenario setup canvas
  if (!scenarios.value) {
    console.log('Scenarios Empty')
    return
  }
  console.log('Scenarios', scenarios.value)
  scenarios.value.map((scenario) => {
    // console.log('sc', scenario.id)
    // create scenario groups
    let group = new Konva.Group({
      x: 120,
      y: 40,
      rotation: 0,
      draggable: true
    });
    group.id = scenario.id
    // setup scenario details in the group
    let circle = new Konva.Circle({ x: 300, y: 100, radius: 50, fill: 'cyan', draggable: 'true'})
    let star = new Konva.Star({ x: 350, y: 100, outerRadius: 50, fill: 'magenta', numPoints: 6, innerRadius: 20, draggable: 'true'})
    let transformer = new Konva.Transformer();

    stage.add(layer);
    group.add(circle, star);
    layer.add(group);  // the yellow rect is added to confirm zIndex changes work as expected.
    layer.add(transformer); // Add the transformer to the layer

// Create the group border rect.
    const borderThang = new GroupBorder(group, settings, transformer);

    /*
    ** Any shape in the group must call the moveBorder fn in its dragmove listener.
    */
    circle.on('dragmove', function(){
      borderThang.moveBorder()
    })

    star.on('dragmove', function(){
      borderThang.moveBorder()
    })

// The group must call the moveBorder fn in any drag listener
    group.on('dragstart', function(){
      borderThang.moveBorder()
    })
    group.on('dragmove', function(){
      borderThang.moveBorder()
    })
    group.on('dragend', function(){
      borderThang.moveBorder()
    })

// The group must call startTransform() when a transformer is enabled.
    group.on('click', function(evt){
      clearTransformer()
      borderThang.startTransform();
      transformer.nodes([group]);
      // show Scenario Menu
      setupSelectedScenario(group.id)
      // console.log(currentMenuComponent)
      evt.cancelBubble = true;
    })

// becuase grouped shapes can be dragged we might need to close the transformer if is is open
    group.on('mousedown', function(evt){
      clearTransformer();
      evt.cancelBubble = true;
    })

// Update the border rect position via the moveBorder function.
    group.on('transform', function(){
      borderThang.moveBorder();
    })

// We click the stage empty space to hide the transformer
    stage.on('click', function(e){
      console.log('Click stage')
      console.log(e.evt.clientX, e.evt.clientY)
      clearTransformer();
      resetMenuComponent();
    })

// Util fundtion to clear the transformer and tell the border rect that transforming has stopped/
    function clearTransformer(){
      transformer.nodes([]);
      borderThang.endTransform();
    }

// Button to show/hide the border rect.
//     $('#toggleBorder').on('click', function(){
//       borderThang.toggleBorder();
//       console.log('togle')
//     })

    // add to layer
    // layer.add(group);
  })
}


// control data for the border
const settings = {
  padding: 20,
  fill: 'transparent',
  opacity: 0.9,
  stroke: 'black',
  strokeWidth: 1,
  visible: true,
  bgRectFill: 'transparent',  // <- change to 'lime' to see the background rect.
}
/*
* This is the GroupBorder class which draws the border and makes the group draggable.
* The constructor expects a Konva.Group, a plain JS object containing settings as per the example above, and the Konva.Transformer.
* https://codepen.io/JEE42/pen/vYpqYEw
*/
class GroupBorder {

  group = null;
//  groupRect = new Konva.Rect({name: 'groupBackgroundRect'});
  borderRect = new Konva.Rect({name: 'groupBorderRect'});
  padding = 0;
  showBorder = true;
  transformer = null;
  dragStartPos = {};
  dragStartGroupPos = {};
  transforming=false;

  constructor(group, settings, transformer){

    this.group = group;
    this.padding = settings.padding; // get the padding from the settings object.
    this.showBorder = settings.visible;
    this.transformer = transformer;

    /* set up the border rectangle. A few lines related to setting fill opacity independent of stroke */
    const opacity = (settings.fill === 'transparent') ? 0 : settings.opacity;
    const colorParts = Konva.Util.getRGB(settings.fill); // + (255 * settings.opacity).toString(16);
    function getHex(val){
      return (val.toString(16).length < 2)?'0'+ val.toString(16) : val.toString(16);
    }
    const fillColor = '#' + getHex(colorParts.r) + getHex(colorParts.g) +  getHex(colorParts.b) + getHex(Math.floor(255 * opacity));

    // Now that's over, create the rect
    this.borderRect.setAttrs(
        {
          stroke: settings.stroke,
          strokeWidth: settings.strokeWidth,
          fill: fillColor,
          visible: settings.visible,
          draggable: true
        });

    // In some cases, 'this' has a special meaning such as within event listeners, so we set a variable to point to this class.
    const that = this;

    // The border rect can be dragged giving the ability to drag the group. Note the rect and group positions at drag start
    this.borderRect.on('dragstart', function(){
      const shape = this;
      that.dragStartPos = shape.position()
      that.dragStartGroupPos = group.position()
    })

    // On each fire of the dragmove event, compute the distance moved since start and apply to the group.
    this.borderRect.on('dragmove', function(){
      const shape = this,
          pos = shape.position(),
          daltaPos = {x: pos.x - that.dragStartPos.x, y: pos.y - that.dragStartPos.y};

      group.position({x: that.dragStartGroupPos.x + daltaPos.x, y: that.dragStartGroupPos.y + daltaPos.y });
    })


    // If the user clicks on the border rect then we enable the transformer
    this.borderRect.on('click', function(evt){
      that.transformer.nodes([]); // clear transformer nodes
      that.startTransform(); // call before setting transformer nodes!
      that.transformer.nodes([group]); // set transformer nodes
      evt.cancelBubble = true;   // stop the event passing up the parents
    })

    // Add the border rect to the same parent as the group
    this.group.getParent().add(this.borderRect);

    // Important - must ensure that border rect is one step below group it borders in the zIndex list.
    this.borderRect.setAttrs({zIndex: this.group.zIndex()});

    this.moveBorder(); // invoke the moveBorder function to draw the border the first time.
  }

  // Show & hide the border rect.
  toggleBorder(){
    this.showBorder = !this.showBorder;
    this.borderRect.visible(this.showBorder);
  }

  // Set the transforming flag and the transformer padding to match the border rect padding
  startTransform(){
    this.transformer.padding(this.padding);
  }

  endTransform(){
    // nothing to do here !
  }


  /* Function to do all the manipulation of the border and background rects*/
  moveBorder(){
    const r = this.group.getClientRect({skipTransform: true}),
        // we need the bounding rect of the group without scale or rotation.
        // the pt is the top-left of the bounding rect without scaling or rotation, plus anti-scaled padding width. This width is anti-scaled
        // because in the next step any scaling in use on the group will be applied to that point and the padding would be scaled, so we
        // anti-scale it first so that the final border size is correct even when the group is scaled.
        pt = {x: r.x - this.padding / this.group.scaleX(), y: r.y - this.padding / this.group.scaleY()},
        // The group.getAbsoluteTransform().point() function takes any given point and returns that point with the group transform applied.
        pos = this.group.getAbsoluteTransform().point(pt);

    // Set the position and size of the border rect using position calculated above, with size based on untransformed bounding rect
    // with scale applied, and with same rotation as the group.
    // console.log({
    //   x: pos.x,
    //   y: pos.y,
    //   width: (r.width * this.group.scaleX()) + (2 * this.padding),
    //   height: (r.height * this.group.scaleY()) + (2 * this.padding),
    //   rotation: this.group.rotation(),
    // })
    this.borderRect.setAttrs({
      x: pos.x,
      y: pos.y,
      width: (r.width * this.group.scaleX()) + (2 * this.padding),
      height: (r.height * this.group.scaleY()) + (2 * this.padding),
      rotation: this.group.rotation(),
    });
  }
}
// End of GroupBorder class

onMounted(async () => {
  // console.log('mounted')
  setupCanvas()
  await setupData()
  // fitStageIntoParentContainer()
  // Setup Scenarios as separate groups
  // setupScenarios()
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
.scenario-box {
  border: solid 1px black;
}
</style>