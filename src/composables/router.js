import router from "~/router";

export function useRouter() {
  return router
}

export const useRoute = () => {
  // 必须添加计算属性，这样才会跟随「响应式依赖」router.app.$route 作出相应变化
  return computed(() => router.app.$route);
};
