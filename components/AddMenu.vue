<template>
  <div id="menu">
    <div class="has-text-left">
      <h2 class="has-text-centered">Add Menu</h2>
      <button id="event">
        <font-awesome-icon icon="triangle" /> Event
      </button>
<!--      <button id="event"><font-awesome-icon icon="square" /> Reaction</button>-->
<!--      <button id="connection"><font-awesome-icon icon="arrow-right" /> Connection</button>-->
<!--      <button id="pulse-button">Pulse</button>-->
<!--      <button id="delete-button">Delete</button>-->
    </div>
  </div>
</template>

<script setup>

</script>

<style>
#menu {
  display: none;
  position: absolute;
  width: 120px;
  background-color: white;
  box-shadow: 0 0 5px grey;
  border-radius: 3px;
}

#menu button {
  width: 100%;
  background-color: white;
  border: none;
  margin: 0;
  padding: 10px;
}

#menu button:hover {
  background-color: lightgray;
}
</style>