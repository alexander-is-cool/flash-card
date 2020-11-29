<template>
  <div class="d-flex">
    <div class="decks-wrapper">
      <FadeTransition>
        <DecksGrid v-if="deckView === 'grid'" />
        <DecksList v-if="deckView === 'list'" />
      </FadeTransition>
    </div>
    <div class="d-flex">
      <div
        class="icon-container"
        :class="{ selected: deckView === 'grid' }"
        @click="deckView = 'grid'"
      >
        <GridIcon />
      </div>
      <div
        class="icon-container"
        :class="{ selected: deckView === 'list' }"
        @click="deckView = 'list'"
      >
        <ListIcon />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import DecksGrid from '~/components/decks/DecksGrid.vue';
import DecksList from '~/components/decks/DecksList.vue';
import FadeTransition from '~/components/transitions/FadeTransition.vue';

import GridIcon from '~/assets/icons/grid.svg';
import ListIcon from '~/assets/icons/list.svg';

export default defineComponent({
  name: 'Decks',

  components: {
    DecksGrid,
    DecksList,
    FadeTransition,
    GridIcon,
    ListIcon,
  },

  data() {
    return {
      deckView: 'grid',
    };
  },
});
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

.decks-wrapper {
  flex: 1;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 24px;
  height: 24px;
  margin-right: 10px;

  border: 1px solid black;
}

.icon-container:hover {
  cursor: pointer;
}

.icon-container:last-child {
  margin-right: 0px;
}

.selected {
  fill: var(--main-selected-color);
  border-color: var(--main-selected-color);
}
</style>
