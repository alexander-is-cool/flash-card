import {
  Module,
  VuexModule,
  Mutation,
  getModule,
} from 'vuex-module-decorators';
import { getCurrentInstance } from '@vue/composition-api';

@Module({
  name: 'search',
  stateFactory: true,
  namespaced: true,
})
class Search extends VuexModule {
  searchActive = false;
  searchQuery = '';

  @Mutation
  toggleSearch() {
    this.searchActive = !this.searchActive;
  }

  @Mutation
  setQuery(newQuery: string) {
    this.searchQuery = newQuery;
  }
}

export default Search;

export const useSearch: () => Search = () => {
  return getModule(Search, getCurrentInstance()?.$store);
};
