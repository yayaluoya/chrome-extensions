<template>
  <div class="tapd">
    <ElStatistic
      title="story"
      :value="story"
      :value-style="{
        color: '#409EFF'
      }"
    >
    </ElStatistic>
    <ElStatistic
      title="task"
      :value="task"
      :value-style="{
        color: '#303133'
      }"
    >
    </ElStatistic>
    <ElStatistic
      title="bug"
      :value="bug"
      :value-style="{
        color: '#F56C6C'
      }"
    >
    </ElStatistic>
  </div>
</template>

<script setup lang="ts">
import { tapdLocal, type tapdLocalType } from "@taozi-chrome-extensions/common/src/local/tapd";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { ElStatistic } from "element-plus";

const workitem_count = ref<tapdLocalType["workitem_count"]>();

const story = computed(() => {
  return parseInt(workitem_count.value?.story || "0");
});
const task = computed(() => {
  return parseInt(workitem_count.value?.task || "0");
});
const bug = computed(() => {
  return parseInt(workitem_count.value?.bug || "0");
});

let t: ReturnType<typeof setInterval>;

onMounted(() => {
  t = setInterval(async () => {
    workitem_count.value = (await tapdLocal.get())?.workitem_count;
  }, 50);
});
onUnmounted(() => {
  t && clearInterval(t);
});
</script>

<style lang="scss" scoped>
.tapd {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
}
</style>
