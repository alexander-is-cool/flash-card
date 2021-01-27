import { mount, createLocalVue } from '@vue/test-utils';
import VueCompositionApi from '@vue/composition-api';
import { getModule } from 'vuex-module-decorators';
import Vuex, { Store } from 'vuex';
import Search from '~/store/search';

import Header from '~/components/Header.vue';

const localVue = createLocalVue();

localVue.use(VueCompositionApi);
localVue.use(Vuex);

localVue.component('NuxtLink', {
  render(createElement) {
    return createElement('a', this.$slots.default);
  },
});

let store: Store<any>;
let searchStore: Search;

beforeEach(() => {
  store = new Vuex.Store({
    modules: {
      search: Search,
    },
  });

  searchStore = getModule(Search, store);
});

describe('Header', () => {
  test('switch between navbar to search', async () => {
    const wrapper = mount(Header, { localVue, store } as any);

    const searchButton = wrapper.find('.nav-link > button');
    await searchButton.trigger('click');

    expect(wrapper.find('.search-input').exists()).toBe(true);
    expect(searchStore.searchActive).toBe(true);
  });

  test('search input changes search.searchQuery', async () => {
    const wrapper = mount(Header, { localVue, store } as any);

    const searchButton = wrapper.find('.nav-link > button');
    await searchButton.trigger('click');

    const searchInput = wrapper.find('.search-input');
    searchInput.setValue('Hello world!');

    expect(searchInput.exists()).toBe(true);
    expect(searchStore.searchQuery).toBe('Hello world!');
  });

  test('switch between search to navbar', async () => {
    const wrapper = mount(Header, { localVue, store } as any);

    const searchButton = wrapper.find('.nav-link > button');
    await searchButton.trigger('click');

    const searchInput = wrapper.find('.search-input');
    searchInput.setValue('Hello world!');

    const closeSearch = wrapper.find('.search-close-btn');
    await closeSearch.vm.$emit('click');

    expect(wrapper.find('.nav').exists()).toBe(true);
    expect(searchStore.searchActive).toBe(false);
    expect(searchStore.searchQuery).toBe('');
  });
});
