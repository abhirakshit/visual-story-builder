<template>
  <div>
    <NuxtLayout name="logged-in">
      Story
    </NuxtLayout>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
  layout: false
})
</script>