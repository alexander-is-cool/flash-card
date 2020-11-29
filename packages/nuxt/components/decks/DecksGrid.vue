<template>
  <div>
    <Dropdown class="options-dropdown">
      <template #button>
        <div class="option-title">
          {{ selectedFilter }}
        </div>
      </template>

      <template #menu>
        <div class="option-category">
          <h1 class="category-header">Sort By</h1>
          <ul class="category-list">
            <li
              v-for="option in filterOptions"
              :key="option"
              class="category-option"
              :class="{ 'selected-category-option': selectedFilter === option }"
              @click="selectedFilter = option"
            >
              {{ option }}
            </li>
          </ul>
        </div>
        <div class="option-category">
          <h1 class="category-header">Order</h1>
          <ul class="category-list">
            <li
              v-for="option in orderOptions"
              :key="option"
              class="category-option"
              :class="{ 'selected-category-option': selectedOrder === option }"
              @click="selectedOrder = option"
            >
              {{ option }}
            </li>
          </ul>
        </div>
      </template>
    </Dropdown>

    jdkslajdksl
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import Dropdown from '~/components/Dropdown.vue';

export default defineComponent({
  name: 'DecksGrid',

  components: {
    Dropdown,
  },

  data() {
    // TODO: use localstorage to save filter options
    const filterOptions = ['Alphabetical', 'Date Created', 'Number of Cards'];
    const orderOptions = ['Ascending', 'Descending'];

    return {
      selectedFilter: filterOptions[0],
      selectedOrder: orderOptions[0],
      filterOptions,
      orderOptions,
    };
  },
});
</script>

<style scoped>
.options-dropdown {
  margin-bottom: 30px;
}

.option-title {
  font-size: 0.9rem;
}

.option-category {
  text-align: center;

  margin-bottom: 20px;
}

.option-category:last-child {
  margin-bottom: 0px;
}

.category-header {
  color: black;

  font-size: 1rem;
  font-weight: normal;

  user-select: none;
}

.category-list {
  list-style: none;
}

.category-option {
  margin-bottom: 5px;

  font-size: 0.8rem;

  user-select: none;
}

.category-option:last-child {
  margin-bottom: 0px;
}

.category-option:hover {
  cursor: pointer;
}

.selected-category-option {
  color: var(--main-selected-color);
}
</style>
