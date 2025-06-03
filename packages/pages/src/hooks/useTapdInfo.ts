import { tapdLocalStorage, type TapdLocalStorage } from "@taozi-chrome-extensions/common/src/local/tapd";
import { ref, onMounted, onUnmounted } from "vue";

export const useTapdInfo = () => {
  let t: ReturnType<typeof setInterval>;
  const tapdInfo = ref<TapdLocalStorage>();

  const getTapdInfo = async () => {
    tapdInfo.value = await tapdLocalStorage.get();
  };

  onMounted(() => {
    t = setInterval(getTapdInfo, 10);
    getTapdInfo();
  });

  onUnmounted(() => {
    t && clearInterval(t);
  });

  return {
    tapdInfo,
    getTapdInfo
  };
};
