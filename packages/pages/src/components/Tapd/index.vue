<template>
  <div class="tapd">
    <ElAlert
      v-if="tapdInfo?.errMsg"
      title="获取tapd信息错误"
      :description="tapdInfo.errMsg"
      :closable="false"
      type="error"
      effect="dark"
    />
    <template v-else>
      <ElStatistic
        title="story"
        :value="tapdInfo?.workitemCount.story || 0"
        :value-style="{
          color: '#409EFF'
        }"
      >
      </ElStatistic>
      <ElStatistic
        title="task"
        :value="tapdInfo?.workitemCount.task || 0"
        :value-style="{
          color: '#303133'
        }"
      >
      </ElStatistic>
      <ElStatistic
        title="bug"
        :value="tapdInfo?.workitemCount.bug || 0"
        :value-style="{
          color: '#F56C6C'
        }"
      >
      </ElStatistic>
    </template>
  </div>
</template>

<script setup lang="ts">
import { tapdLocalStorage, type TapdLocalStorage } from "@taozi-chrome-extensions/common/src/local/tapd";
import { onMounted, onUnmounted, ref } from "vue";
import { ElAlert, ElStatistic } from "element-plus";

const tapdInfo = ref<TapdLocalStorage>();

let t: ReturnType<typeof setInterval>;

const getTapdInfo = async () => {
  tapdInfo.value = await tapdLocalStorage.get();
};

onMounted(() => {
  t = setInterval(getTapdInfo, 50);
  getTapdInfo();
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
