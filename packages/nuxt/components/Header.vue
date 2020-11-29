<template>
  <header class="header container">
    <transition name="slide-fade" mode="out-in">
      <div v-if="!searchActive" key="navbar" class="header-content">
        <Hamburger v-model="navActive" class="header-hamburger" />

        <!-- Navbar -->
        <nav class="nav" :style="[navStyles]">
          <ul ref="navRef" class="nav-main">
            <li class="nav-link">
              <NuxtLink class="nav-btn" to="/">
                <DeckIcon />
                Decks
              </NuxtLink>
            </li>
            <li class="nav-link">
              <NuxtLink class="nav-btn" to="/create">
                <CreateIcon />
                Create
              </NuxtLink>
            </li>
            <li class="nav-link">
              <button class="nav-btn raw-btn" @click="toggleSearch">
                <SearchIcon />
                Search
              </button>
            </li>
          </ul>
        </nav>

        <!-- User dropdown -->
        <Dropdown>
          <template #button> User dropdown </template>

          <template #menu>
            <ul class="user-options">
              <li><button class="raw-btn">Logout</button></li>
            </ul>
          </template>
        </Dropdown>
      </div>

      <div v-else key="searchbar" class="header-content">
        <!-- Search Bar -->
        <SearchIcon />
        <input
          class="search-input"
          type="text"
          placeholder="Search"
          @input="handleQueryChange"
        >
        <CloseIcon class="search-close-btn" @click="toggleSearch" />
      </div>
    </transition>
  </header>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  computed,
  reactive,
} from '@vue/composition-api';
import { useMediaQuery } from '../functions/mediaQuery';
import { useSearch } from '../store/search';
import animateStyle from '../utils/animateStyle';

import Hamburger from '~/components/Hamburger.vue';
import Dropdown from '~/components/Dropdown.vue';

import SearchIcon from '~/assets/icons/search.svg';
import CreateIcon from '~/assets/icons/create.svg';
import CloseIcon from '~/assets/icons/close.svg';
import DeckIcon from '~/assets/icons/deck.svg';

export default defineComponent({
  name: 'Header',

  components: {
    Hamburger,
    Dropdown,
    SearchIcon,
    CreateIcon,
    CloseIcon,
    DeckIcon,
  },

  setup() {
    // Navbar
    const { navRef, navActive, navStyles, closeNav } = useResponseNav();

    // Search-bar
    const { searchActive, toggleSearch, handleQueryChange } = useSearchbar(
      closeNav,
    );

    return {
      navRef,
      navActive,
      navStyles,
      searchActive,
      toggleSearch,
      handleQueryChange,
    };
  },
});

interface NavStyles {
  height: string | undefined;
  marginTop: string | undefined;
}

function useResponseNav() {
  const navRef = ref<HTMLElement>();
  const navActive = ref<boolean>(false);
  const navStyles = reactive<NavStyles>({
    height: undefined,
    marginTop: undefined,
  });

  const { queryMatch } = useMediaQuery('only screen and (max-width: 900px)');

  watch(queryMatch, closeNav);

  // prettier-ignore
  watch(navActive, (newNavActive) => {
    if (queryMatch.value) {
      const margin = 30;
      const height = navRef.value?.clientHeight || 0;
      const stepMargin = (margin || 0) / 15;
      const stepHeight = (height || 0) / 15;

      if (!navRef.value) {
        closeNav();
      } else if (newNavActive) {
        // Opens navbar
        animateStyle(navStyles, 0, height, stepHeight, 'height', 'px');
        animateStyle(navStyles, 0, margin, stepMargin, 'marginTop', 'px');
      } else {
        // Closes navbar
        animateStyle(navStyles, height, 0, -stepHeight, 'height', 'px');
        animateStyle(navStyles, margin, 0, -stepMargin, 'marginTop', 'px');
      }
    }
  }, { flush: 'post' });

  function closeNav() {
    navActive.value = false;

    navStyles.height = undefined;
    navStyles.marginTop = undefined;
  }

  return {
    navRef,
    navActive,
    navStyles,
    closeNav,
  };
}

function useSearchbar(closeNav: () => void) {
  const searchStore = useSearch();
  const searchActive = computed(() => searchStore.searchActive);

  // Closes navbar when searchbar is activated
  function toggleSearch() {
    searchStore.toggleSearch();
    searchStore.setQuery('');
    closeNav();
  }

  function handleQueryChange(event: Event) {
    searchStore.setQuery((event.target as HTMLInputElement).value);
  }

  return {
    searchActive,
    toggleSearch,
    handleQueryChange,
  };
}
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.25s;
}

.slide-fade-enter,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.header {
  display: flex;
  flex-wrap: wrap;

  min-height: 65px;

  border-bottom: 1px solid #f2f2f2;
}

.header-content {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: space-between;

  width: 100%;
  height: 100%;
}

.header-hamburger {
  display: none;
}

.nav {
  height: max-content;
  overflow: hidden;
}

.nav-main {
  display: flex;
  flex-direction: row;

  list-style: none;
}

.nav-link {
  display: flex;
  align-items: center;

  padding: 0 50px;
  border-right: 1px solid #b3b3b3;
}

.nav-link a {
  color: unset;
  text-decoration: none;
}

.nav-link:first-child {
  padding-left: 0px;
}

.nav-link:last-child {
  padding-right: 0px;
  border-right: none;
}

.nav-btn {
  display: flex;
  width: 100%;

  font-size: 1rem;
}

.nav-btn > svg {
  margin-right: 12px;
}

.user-options {
  font-size: 0.8rem;

  list-style: none;
}

.search {
  display: flex;
  align-items: center;

  position: relative;

  width: 100%;
  height: 100%;
}

.search-input {
  flex: 2;

  border: none;
  outline: none;

  margin: 0px 12px;
  font-size: 1rem;
}

.search-close-btn:hover {
  fill: red;

  cursor: pointer;
}

@media only screen and (max-width: 900px) {
  .header-hamburger {
    display: block;
  }

  .nav {
    height: 0px;

    order: 3;
    flex-basis: 100%;
  }

  .nav-main {
    flex-direction: column;
  }

  .nav-link {
    padding: 20px 0px;
    border-right: none;
    border-bottom: 1px solid #b3b3b3;

    width: 100%;
  }

  .nav-link:first-child {
    padding-top: 0px;
  }

  .nav-link:last-child {
    padding-bottom: 0px;
    border-bottom: none;
  }
}
</style>
