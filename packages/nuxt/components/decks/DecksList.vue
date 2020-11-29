<template>
  <div>
    <table class="deck-list">
      <tr class="list-header">
        <th>Deck Name</th>
        <th>Number of Cards</th>
        <th>Date Created</th>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'DecksList',

  data() {
    return {
      filterOptions: '',
      orderOption: '',
    };
  },
});
</script>

<style scoped>
.deck-list {
  width: 100%;
}

.list-header {
  font-size: 0.9rem;
}

.list-header > th {
  font-weight: normal;

  text-align: left;
  text-overflow: ellipsis;

  overflow: hidden;
  white-space: nowrap;

  user-select: none;
}

.list-header > th:hover {
  cursor: pointer;
}

@media only screen and (max-width: 500px) {
  .list-header {
    font-size: 0.7rem;
  }
}
</style>
