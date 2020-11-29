<template>
  <div>
    <Header />
    <transition mode="out-in">
      <Nuxt v-if="!searchActive" />
      <main v-else class="container">
        <Decks />
      </main>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import { useSearch } from '../store/search';

import Header from '~/components/Header.vue';
import Decks from '~/components/decks/Decks.vue';

export default defineComponent({
  name: 'UserLayout',

  components: {
    Header,
    Decks,
  },

  setup() {
    return {
      ...useSearchActive(),
    };
  },
});

function useSearchActive() {
  const searchStore = useSearch();
  const searchActive = computed(() => searchStore.searchActive);

  return {
    searchActive,
  };
}
</script>

<style></style>
