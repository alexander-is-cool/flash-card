<template>
  <div>create</div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  layout: 'user',

  head() {
    return {
      title: 'Create Flash Card',
    };
  },
});
</script>

<style scoped></style>
