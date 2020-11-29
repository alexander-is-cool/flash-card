<template>
  <div class="dropdown">
    <div class="dropdown-btn raw-btn" @click="toggleDropdown">
      <SelectIcon class="select-icon" :class="{ 'select-icon-active': open }" />
      <slot name="button" />
    </div>
    <FadeTransition>
      <div v-if="open" class="dropdown-menu card" @click="menuClickHandler">
        <slot name="menu" />
      </div>
    </FadeTransition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import SelectIcon from '~/assets/icons/select.svg';

import FadeTransition from '~/components/transitions/FadeTransition.vue';

export default defineComponent({
  name: 'Dropdown',

  components: {
    SelectIcon,
    FadeTransition,
  },

  props: {
    closeOnClick: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      open: false,
    };
  },

  mounted() {
    document.addEventListener('click', this.bodyClickHandler);
  },

  destroyed() {
    document.removeEventListener('click', this.bodyClickHandler);
  },

  methods: {
    toggleDropdown() {
      this.open = !this.open;
    },
    bodyClickHandler(event: Event) {
      if (this.open && !this.$el.contains(event.target as Node)) {
        this.toggleDropdown();
      }
    },
    menuClickHandler() {
      if (this.closeOnClick) {
        this.toggleDropdown();
      }
    },
  },
});
</script>

<style scoped>
.dropdown {
  position: relative;
}

.dropdown-btn {
  display: flex;
  align-items: center;

  user-select: none;
}

.select-icon {
  transition: all 0.25s;

  margin-right: 5px;
}

.select-icon-active {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 30px;
}
</style>
