vue<script setup>
import { ref } from 'vue'
const name = ref('')
const message = ref('')
</script>

<template>
  <input type="text" v-model="name" />
  <textarea v-model="message"></textarea>
</template>
