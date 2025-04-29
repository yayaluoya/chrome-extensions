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
        :value="tapdInfo?.story || 0"
        :value-style="{
          color: '#409EFF'
        }"
      >
      </ElStatistic>
      <ElStatistic
        title="task"
        :value="tapdInfo?.task || 0"
        :value-style="{
          color: '#303133'
        }"
      >
      </ElStatistic>
      <ElStatistic
        title="bug"
        :value="tapdInfo?.bug || 0"
        :value-style="{
          color: '#F56C6C'
        }"
      >
      </ElStatistic>
    </template>
  </div>
</template>

<script setup lang="ts">
import { tapdLocal, type TapdLocalInfo } from "@taozi-chrome-extensions/common/src/local/tapd";
import { onMounted, onUnmounted, ref } from "vue";
import { ElAlert, ElStatistic } from "element-plus";

const tapdInfo = ref<TapdLocalInfo>();

let t: ReturnType<typeof setInterval>;

const getTapdInfo = async () => {
  tapdInfo.value = await tapdLocal.get();
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
