<template>
  <div>
    <NuxtLayout name="logged-in">
      <!--    <NuxtLayout>-->
      <AddMenu></AddMenu>
      <div>
        <nav class="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li>
              <NuxtLink>Home</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/stories">Stories</NuxtLink>
            </li>
            <li class="is-active"><a href="#" aria-current="page">{{ story ? story.title : "" }}</a></li>
          </ul>
        </nav>

        <div class="columns">
          <div class="column is-half">
            <div class="box">
              <div class="columns">
                <div class="column is-three-quarters">
                  <h2 class="subtitle">Story Visualizer</h2>
                </div>
<!--                <div class="column is-one-quarter">-->
<!--                  <button class="button m-1 is-outlined is-pulled-right" @click="createNewScenario()">-->
<!--                    <font-awesome-icon icon="plus"/>&nbsp;Add Scenario-->
<!--                  </button>-->
<!--                </div>-->
              </div>
              <div id="scenarios">
                <div id="canvas" class="scenario-box"></div>
              </div>
            </div>
          </div>
          <div class="column is-half">
            <div class="box sticky-box">
              <component :is="getMenuComponent()" v-bind="menuProps"
                         @redraw="redraw"
                         @showMentalModel="showMentalModel"
                         @redrawReselectScenario="redrawReselectScenario"
                         @showScenario="showScenario"/>
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
const allConnectors = ref([
  {scenarioId: '', connectors: []}
])
let sceneWidth = 1000;
let sceneHeight = 800;
let stage, layer;

const menuProps = ref();
const currentMenuComponent = ref();
currentMenuComponent.value = 'empty'

const ScenarioMenu = resolveComponent('ScenarioMenu')
const EventMenu = resolveComponent('EventMenu')
const MentalStateMenu = resolveComponent('MentalStateMenu')
const EmptyMenu = resolveComponent('EmptyMenu')

const getMenuComponent = () => {
  // console.log('cmc', currentMenuComponent.value)
  switch (currentMenuComponent.value) {
    case "scenario-menu":
      return ScenarioMenu
    case "event-menu":
      return EventMenu
    case "mental-state-menu":
      return MentalStateMenu
    case "empty":
      return EmptyMenu
    default:
      return EmptyMenu
  }
}

const redrawReselectScenario = (scenario) => {
  redraw()
  setupSelectedScenario(scenario.id)
}

const showMentalModel = (scenario) => {
  console.log('caught emit', scenario)
  setupMentalStateEvent(scenario)
}

const showScenario = (scId) => {
  console.log('caught emit', scId)
  setupSelectedScenario(scId)
}

const redraw = () => {
  console.log('redraw')
  layer.removeChildren()
  setupScenarios()
  resetMenuComponent()
}

const resetMenuComponent = () => {
  console.log('reset', scenarios.value)
  currentMenuComponent.value = 'empty'
  menuProps.value = {
    'scenarios': scenarios.value,
    'scenarioCollPath': `users/${firebaseUser.value.uid}/stories/${route.params.id}/scenarios`
  }
}

// const createNewScenario = async () => {
//   await addDoc(
//       collection($fireDB, `users/${firebaseUser.value.uid}/stories/${route.params.id}/scenarios`),
//       {
//         title: 'New Scenario',
//         description: 'New Scenario Description',
//       }).then(function (docRef) {
//         console.log("Document written with ID: ", docRef.id);
//         setupSelectedScenario(docRef.id)
//       })
//       .catch(function (error) {
//         console.error("Error adding document: ", error);
//       });
// }

const setupSelectedScenario = (groupId, event) => {
  console.log("Group Selected", groupId)
  // Setup scenario as prop
  if (groupId) {
    let sc = scenarios.value.find((sc) => {
      return sc.id == groupId
    })
    menuProps.value = {
      'scenario': sc,
      'event': event,
      'path': `users/${firebaseUser.value.uid}/stories/${route.params.id}/scenarios/${groupId}`,
      'mentalModelsPath': `users/${firebaseUser.value.uid}/mentalStateModels`,
    }
    //change dynamic templates
    currentMenuComponent.value = "scenario-menu"
  } else {
    throw new Error('No group id provided')
  }
}

const setupSelectedEvent = (sc, groupId, event) => {
  console.log("Event Selected", groupId, event)
  menuProps.value = {
    'scenario': sc,
    'event': event,
    'path': `users/${firebaseUser.value.uid}/stories/${route.params.id}/scenarios/${groupId}`
  }

  //change dynamic templates
  currentMenuComponent.value = "event-menu"
}

const setupMentalStateEvent = (sc) => {
  menuProps.value = {
    'scenario': sc,
    'path': `users/${firebaseUser.value.uid}/mentalStateModels`,
    'scenarioPath': `users/${firebaseUser.value.uid}/stories/${route.params.id}/scenarios/${sc.id}`
  }

  //change dynamic templates
  currentMenuComponent.value = "mental-state-menu"
}

const getOffsetPointerPos = (clientX, clientY) => {
  console.log({clientX, clientY})
  // let offset = 84
  let offset = 0
  return {x: clientX - offset, y: clientY - offset}
}
const setupAddMenu = () => {
  // https://konvajs.org/docs/sandbox/Canvas_Context_Menu.html
  // console.log('context')
  let currentShape;
  let menuNode = document.getElementById('menu');
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
    // var containerRect = stage.container().getBoundingClientRect();
    // console.log('evt', e.evt.layerX, e.evt.layerY)
    // console.log('stage', containerRect.top, containerRect.left)
    // console.log('mouse', stage.getPointerPosition().x, stage.getPointerPosition().y)
    // console.log(containerRect.top, containerRect.left, stage.getPointerPosition().y, stage.getPointerPosition().x)
    // console.log(containerRect.top + stage.getPointerPosition().y + 4 + 'px', containerRect.left + stage.getPointerPosition().x + 4 + 'px')
    menuNode.style.top = stage.getPointerPosition().y + 140 + 'px';
    // menuNode.style.top = e.evt.layerX + 'px';
    menuNode.style.left = stage.getPointerPosition().x + 20 + 'px';
    // menuNode.style.left = e.evt.layerY + 'px';
  });
}

const setupCanvas = () => {
  // first we need to create a stage
  const canvas = document.getElementById('canvas');
  stage = new Konva.Stage({
    container: 'canvas',   // id of container <div>
    // width: sceneWidth,
    width: canvas.offsetWidth,
    height: sceneHeight
  });
  // setupAddMenu()

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
    scenarios.value = querySnapshot.docs.map((documentSnapshot) => {
      return {...documentSnapshot.data(), id: documentSnapshot.id}
    })
    resetMenuComponent()
    setupScenarios()
  })
}

const getCanvasCenterX = () => {
  const canvas = document.getElementById('canvas');
  return canvas.offsetWidth / 2
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
  stage.scale({x: scale, y: scale});
}

// const addScenarioToStage = async () => {
//   await addDoc(
//       collection($fireDB, `users/${firebaseUser.value.uid}/stories/${route.params.id}/scenarios`),
//       {
//         title: 'New Scenario',
//         description: 'New Description',
//         events: [
//           {
//             id: 'evt1',
//             type: 'general',
//             description: 'Evt Desc',
//             timeline: 'past',
//           },
//           {
//             id: 'evt2',
//             type: 'catalysing',
//             description: 'Cat Evt Desc',
//             timeline: 'current'
//           }
//         ],
//         mentalState: {
//           id: 'ms',
//           title: 'Mental State',
//           description: '',
//         },
//         reaction: {id: 'rctn'},
//         connectors: [
//           {id: 'cid1', startTargetId: 'evt1', endTargetId: 'rctn', type: 'excitation'},
//           {id: 'cid2', startTargetId: 'evt2', endTargetId: 'rctn', type: 'catalysing'},
//           {id: 'cid3', startTargetId: 'rctn', endTargetId: 'ms', type: 'generation'},
//         ]
//       })
//   redraw();
// }
// const scenarioGroupMapping = [];
const getConnectorPoints = (from, to) => {
  // console.log({from, to})
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  let angle = Math.atan2(-dy, dx);

  const radius = 15;

  return [
    from.x + -radius * Math.cos(angle + Math.PI),
    from.y + radius * Math.sin(angle + Math.PI),
    to.x + -radius * Math.cos(angle),
    to.y + radius * Math.sin(angle),
  ];
}

const redrawArrows = (group, connectors) => {
  connectors.map((connector) => {
    let fromNode = group.findOne('#' + connector.startTargetId);
    let toNode = group.findOne('#' + connector.endTargetId);

    // console.log("From to", fromNode, toNode)
    const points = getConnectorPoints(
        fromNode.position(),
        toNode.position()
    );
    // console.log("points", points)
    let arrow = group.findOne('#' + connector.id)
    arrow.points(points);
  })
}

const getConnectorProps = (type) => {
  console.log('tt', type)
  let props = {}
  switch (type) {
    case "Excitation":
      props.color = 'green';
      break;
    case "Catalysing":
      props.color = 'purple';
      break;
    case "Inhibition":
      props.color = 'red';
      break;
    case "Generation":
      props.color = 'blue';
      break;
    default:
      props.color = 'black';
  }
  return props
}

// const getEventColor = (type) => {
//   let color = 'black'
//   switch (type) {
//     case "Excitation":
//       color = 'green';
//       break;
//     case "Catalysing":
//       color = 'purple';
//       break;
//     case "Generation":
//       props.color = 'blue';
//       break;
//     default:
//       props.color = 'black';
//   }
//   return props
// }

const setupEvents = async (scenario, group, borderGroupBox, scCount) => {
  // let eventLocY = 50, eventLocX = 150
  let eventLocY = 0, eventLocX = 0

  //Make sure consecutive scenarios start 100 pixels down
  eventLocY += scCount*250

  let cnt = 0, connectorArr = [], events = []
  const querySnapshot = await getDocs(query(
      collection($fireDB,
          `users/${firebaseUser.value.uid}/stories/${route.params.id}/scenarios/${scenario.id}/events`)
      ));
  events = querySnapshot.docs.map((documentSnapshot) => {
    return {...documentSnapshot.data(), id: documentSnapshot.id}
  })
  if (events.length == 0 || !scenario.mentalStateModelId) {
    console.info('No events in scenario or no mental state associated')
    return
  }

  let reactionId = `rxn-${scenario.id}`
  // scenario.events.map((event) => {
  events.map((event) => {
    // get evt settings
    eventLocY += 50;
    // const eventColor = event.type == 'Excitation' ? 'black' : 'purple'
    const eventColor = getConnectorProps(event.type).color
    let wedge = new Konva.Wedge({
      x: eventLocX,
      y: eventLocY,
      radius: 20,
      angle: 65,
      fill: eventColor,
      stroke: 'yellow',
      strokeWidth: 1,
      rotation: -120,
      draggable: 'true',
      id: event.id
    });
    //add to group
    group.add(wedge);
    /*
    ** Any shape in the group must call the moveBorder fn in its dragmove listener.
    */
    wedge.on('dragmove', function () {
      borderGroupBox.moveBorder()
      // redrawArrows(group, scenario.connectors)
      redrawArrows(group, connectorArr)
    })

    wedge.on('click', function (evt) {
      evt.cancelBubble = true;
      // console.log('Event Selected')
      setupSelectedScenario(group.id, event)
    })

    // add connectors
    let connector = {
      startTargetId: event.id,
      endTargetId: reactionId,
      type: event.type,
      id: `cId-${cnt}-${scenario.id}`
    }
    connectorArr.push(connector)
    cnt++
  })

  //Create Reaction Box
  let rect = new Konva.Rect({
    x: eventLocX + 100,
    y: eventLocY - 50,
    width: 15,
    height: 15,
    fill: 'blue',
    shadowBlur: 2,
    cornerRadius: 2,
    draggable: 'true',
    id: reactionId
  });
  group.add(rect)
  rect.on('dragmove', function () {
    borderGroupBox.moveBorder()
    // redrawArrows(group, scenario.connectors)
    redrawArrows(group, connectorArr)
  })
  // Add connector for reaction to state
  connectorArr.push({
    startTargetId: reactionId,
    endTargetId: scenario.mentalStateModelId,
    type: 'Generation',
    id: `cId-${cnt}-${scenario.id}`
  })

  //Create Mental State
  let circle = new Konva.Circle({
    x: eventLocX + 200,
    y: eventLocY - 50,
    radius: 10,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 4,
    draggable: 'true',
    // id: scenario.mentalState.id
    id: scenario.mentalStateModelId
  });
  group.add(circle)
  circle.on('dragmove', function () {
    borderGroupBox.moveBorder()
    // redrawArrows(group, scenario.connectors)
    redrawArrows(group, connectorArr)
  })
  circle.on('click', function (evt) {
    evt.cancelBubble = true;
    console.log('Circle Selected', scenario)
    setupMentalStateEvent(scenario)
  })

  // Create Connectors
  // calculateConnectors(scenario);
  // scenario.connectors.map((connector) => {
  //   let arrow = new Konva.Arrow({
  //     stroke: 'black',
  //     id: connector.id,
  //     fill: 'black',
  //     draggable: 'false'
  //   });
  //   //add to group
  //   group.add(arrow);
  // })
  // redrawArrows(group, scenario.connectors)

  // Draw All Connectors
  connectorArr.map((connector) => {
    let props = getConnectorProps(connector.type)
    let arrow = new Konva.Arrow({
      stroke: props.color,
      id: connector.id,
      fill: props.color,
      draggable: 'false'
    });
    //add to group
    group.add(arrow);
  })

  redrawArrows(group, connectorArr)
  borderGroupBox.moveBorder()
}

const setupScenarios = () => {
  // for each scenario setup canvas
  if (!scenarios.value) {
    console.log('Scenarios Empty')
    return
  }
  // console.log('Scenarios', scenarios.value)
  let scCount = 0
  scenarios.value.map((scenario) => {
    if (!scenario.mentalStateModelId) {
      console.log('No mental state model')
      return
    }
    // create scenario groups
    // console.log("x,y", getCanvasCenterX() - 60, 40 + (40*scCount))
    let group = new Konva.Group({
      x: getCanvasCenterX() - 60,
      y: 40 + (40 * scCount), // new scenarios should sit below prior ones
      rotation: 0,
      draggable: true
    });
    group.id = scenario.id

    // setup default scenario details in the group
    let transformer = new Konva.Transformer();
    layer.add(group);
    layer.add(transformer); // Add the transformer to the layer
    stage.add(layer);

    // Create the group border rect.
    const borderGroupBox = new GroupBorder(group, settings, transformer);
    setupEvents(scenario, group, borderGroupBox, scCount)
    scCount++;

// The group must call the moveBorder fn in any drag listener
    group.on('dragstart', function () {
      borderGroupBox.moveBorder()
    })
    group.on('dragmove', function () {
      borderGroupBox.moveBorder()
    })
    group.on('dragend', function () {
      borderGroupBox.moveBorder()
    })

// The group must call startTransform() when a transformer is enabled.
    group.on('click', function (evt) {
      clearTransformer()
      borderGroupBox.startTransform();
      transformer.nodes([group]);
      // show Scenario Menu
      evt.cancelBubble = true;
    })

// because grouped shapes can be dragged we might need to close the transformer if is is open
    group.on('mousedown', function (evt) {
      clearTransformer();
      evt.cancelBubble = true;
    })

// Update the border rect position via the moveBorder function.
    group.on('transform', function () {
      borderGroupBox.moveBorder();
    })

    // group.on('contextmenu', (e) => {
    //   console.log('show context menu')
    // })

// We click the stage empty space to hide the transformer
    stage.on('click', function (e) {
      // console.log('Click stage')
      // console.log('ClientXY', e.evt.clientX, e.evt.clientY)
      // console.log('LayerXY', e.evt.layerX, e.evt.layerY)
      clearTransformer();
      resetMenuComponent();
    })

// Util fundtion to clear the transformer and tell the border rect that transforming has stopped/
    function clearTransformer() {
      transformer.nodes([]);
      borderGroupBox.endTransform();
    }

    borderGroupBox.moveBorder();
  })
}

// control data for the border
const settings = {
  padding: 20,
  fill: 'transparent',
  opacity: 0.9,
  stroke: 'blue',
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
  transforming = false;

  constructor(group, settings, transformer) {

    this.group = group;
    this.padding = settings.padding; // get the padding from the settings object.
    this.showBorder = settings.visible;
    this.transformer = transformer;

    /* set up the border rectangle. A few lines related to setting fill opacity independent of stroke */
    const opacity = (settings.fill === 'transparent') ? 0 : settings.opacity;
    const colorParts = Konva.Util.getRGB(settings.fill); // + (255 * settings.opacity).toString(16);
    function getHex(val) {
      return (val.toString(16).length < 2) ? '0' + val.toString(16) : val.toString(16);
    }

    const fillColor = '#' + getHex(colorParts.r) + getHex(colorParts.g) + getHex(colorParts.b) + getHex(Math.floor(255 * opacity));

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
    this.borderRect.on('dragstart', function () {
      const shape = this;
      that.dragStartPos = shape.position()
      that.dragStartGroupPos = group.position()
    })

    // On each fire of the dragmove event, compute the distance moved since start and apply to the group.
    this.borderRect.on('dragmove', function () {
      // console.log('drag outer box')
      const shape = this,
          pos = shape.position(),
          daltaPos = {x: pos.x - that.dragStartPos.x, y: pos.y - that.dragStartPos.y};

      group.position({x: that.dragStartGroupPos.x + daltaPos.x, y: that.dragStartGroupPos.y + daltaPos.y});
    })


    // If the user clicks on the border rect then we enable the transformer
    this.borderRect.on('click', function (e) {
      console.log('Outer box selected', e)
      that.transformer.nodes([]); // clear transformer nodes
      that.startTransform(); // call before setting transformer nodes!
      that.transformer.nodes([group]); // set transformer nodes
      e.cancelBubble = true;   // stop the event passing up the parents

      setupSelectedScenario(group.id)
    })

    let currentShape;
    let menuNode = document.getElementById('menu');
    // this.borderRect.on('contextmenu', function (e) {
    //   console.log('ttt')
    //   // e.cancelBubble = true
    //   currentShape = e.target;
    //   // show menu
    //   menuNode.style.display = 'initial';
    //   console.log('evt', e.evt.layerX, e.evt.layerY)
    //   menuNode.style.top = e.evt.layerY + 140 + 'px';
    //   menuNode.style.left = e.evt.layerX + 20 + 'px';
    // })

    // Add the border rect to the same parent as the group
    this.group.getParent().add(this.borderRect);

    // Important - must ensure that border rect is one step below group it borders in the zIndex list.
    this.borderRect.setAttrs({zIndex: this.group.zIndex()});

    this.moveBorder(); // invoke the moveBorder function to draw the border the first time.
  }

  // Show & hide the border rect.
  toggleBorder() {
    this.showBorder = !this.showBorder;
    this.borderRect.visible(this.showBorder);
  }

  // Set the transforming flag and the transformer padding to match the border rect padding
  startTransform() {
    this.transformer.padding(this.padding);
  }

  endTransform() {
    // nothing to do here !
  }


  /* Function to do all the manipulation of the border and background rects*/
  moveBorder() {
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
  setupCanvas()
  await setupData()
  // resetMenuComponent()
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