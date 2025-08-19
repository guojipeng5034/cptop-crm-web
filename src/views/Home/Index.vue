<template>
  <div class="home-container">
  </div>
</template>

<script setup lang="ts">
import posthog from "posthog-js";
posthog.capture('my event', { property: 'value' })
</script>

<style scoped>
.error-message {
  color: red;
  padding: 10px;
  margin-top: 10px;
}
</style>
