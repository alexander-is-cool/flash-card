declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module '*.svg' {
  import Vue from 'vue';
  export default Vue;
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {}
}
