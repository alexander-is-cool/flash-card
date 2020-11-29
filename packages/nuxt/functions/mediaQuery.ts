import { ref, watchEffect } from '@vue/composition-api';

export function useMediaQuery(query: string) {
  const queryMatch = ref<boolean>(false);

  watchEffect((onInvalidate) => {
    let mediaQueryList: MediaQueryList;
    let isAttached: boolean;

    const handleQueryListener = (event: MediaQueryListEvent) => {
      queryMatch.value = event.matches;
    };

    if (typeof window !== 'undefined' && window.matchMedia) {
      mediaQueryList = window.matchMedia(query);
      mediaQueryList.addListener(handleQueryListener);
      isAttached = true;

      queryMatch.value = mediaQueryList.matches;
    }

    onInvalidate(() => {
      if (isAttached) {
        mediaQueryList.removeListener(handleQueryListener);
        isAttached = false;
      }
    });
  });

  return { queryMatch };
}
