<template>
  <transition name="fade" mode="out-in">
    <slot />
  </transition>
</template>

<script lang="ts">
export default {
  name: 'FadeTransition',
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
