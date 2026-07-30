import { useRouter } from 'next/navigation';

export function useCustomRouter() {
  const router = useRouter();

  const pushWithoutScroll = (url: string) => {
    router.push(url, { scroll: false });
  };

  const replaceWithoutScroll = (url: string) => {
    router.replace(url, { scroll: false });
  };

  return {
    push: pushWithoutScroll,
    replace: replaceWithoutScroll,
  };
}
