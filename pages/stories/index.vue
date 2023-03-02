<template>
  <div>
    <NuxtLayout name="logged-in">
      Stories
    </NuxtLayout>
  </div>
</template>

<script setup>
  definePageMeta({
    middleware: ["auth"],
    layout: false
  })
</script>