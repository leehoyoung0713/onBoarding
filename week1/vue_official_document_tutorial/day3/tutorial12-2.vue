<script setup>
const props = defineProps({
  msg: String
})
</script>

<template>
  <h2>{{ msg || 'prop이 아직 전달되지 않았습니다!' }}</h2>
</template>
