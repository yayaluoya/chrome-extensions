import { tapdLocalStorage, type TapdLocalStorage } from "@taozi-chrome-extensions/common/src/local/tapd";
import { ref, onMounted, onUnmounted } from "vue";

export const useTapdInfo = () => {
  let t: ReturnType<typeof setInterval>;
  const tapdInfo = ref<TapdLocalStorage>();

  const getTapdInfo = async () => {
    const v = await tapdLocalStorage.get();
    if (!tapdInfo.value) {
      tapdInfo.value = v;
    } else if (v) {
      const { toBeReleasedBugIds, ...rest } = v;
      tapdInfo.value = { ...tapdInfo.value, ...rest };
    }
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
