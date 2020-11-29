<template>
  <div class="hamburger">
    <input
      :checked="open"
      type="checkbox"
      class="hamburger-btn"
      @change="$emit('update:open', $event.target.checked)"
    >
    <div class="hamburger-icon" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'HamburgerButton',

  model: {
    prop: 'open',
    event: 'update:open',
  },

  props: {
    open: {
      type: Boolean,
    },
  },
});
</script>

<style scoped>
.hamburger {
  position: relative;

  width: 36px;

  transition: all 0.4s ease;
}

.hamburger-btn {
  position: absolute;
  z-index: 1;

  width: 100%;
  height: 100%;

  opacity: 0;
}

.hamburger-btn:hover {
  cursor: pointer;
}

.hamburger-icon::before,
.hamburger-icon::after {
  display: block;
  content: '';
  height: 4px;

  background-color: #696969;
  border-radius: 5px;

  transition: all 200ms ease-in-out;
}

.hamburger-icon::before {
  box-shadow: 0 10px 0 #696969;
  margin-bottom: 16px;
}

.hamburger-btn:checked + .hamburger-icon::before {
  box-shadow: 0 0 0 #696969;
  transform: translateY(10px) rotate(45deg);
}

.hamburger-btn:checked + .hamburger-icon::after {
  transform: translateY(-10px) rotate(-45deg);
}
</style>
