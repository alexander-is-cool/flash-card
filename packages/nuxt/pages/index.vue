<template>
  <main class="container">
    <Decks />
  </main>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import Decks from '~/components/decks/Decks.vue';

export default defineComponent({
  components: {
    Decks,
  },

  layout: 'user',

  head() {
    return {
      title: 'Flash Card',
    };
  },
});
</script>

<style scoped></style>
