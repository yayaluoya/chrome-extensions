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
        v-for="(item, index) in statistics"
        :key="index"
        :value="item.value"
        :value-style="{
          color: item.color,
          fontSize: '20px',
          fontWeight: 'bold'
        }"
      >
        <template #title>
          <span>
            {{ current_tab }}:
            <span
              :style="{
                color: item.color,
                fontSize: '16px',
                fontWeight: 'bold'
              }"
              >{{ item.title }}</span
            ></span
          >
        </template>
      </ElStatistic>
    </template>
  </div>
</template>

<script setup lang="ts">
import { tapdLocalStorage, type TapdLocalStorage } from "@taozi-chrome-extensions/common/src/local/tapd";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { ElAlert, ElStatistic } from "element-plus";

const tapdInfo = ref<TapdLocalStorage>();

let t: ReturnType<typeof setInterval>;

const getTapdInfo = async () => {
  tapdInfo.value = await tapdLocalStorage.get();
};

const statistics = computed(() => {
  return [
    {
      title: "story",
      value: tapdInfo.value?.workitemCount.story || 0,
      color: "#409EFF"
    },
    {
      title: "task",
      value: tapdInfo.value?.workitemCount.task || 0,
      color: "#303133"
    },
    {
      title: "bug",
      value: tapdInfo.value?.workitemCount.bug || 0,
      color: "#F56C6C"
    }
  ];
});

const current_tab = computed(() => {
  return (
    {
      todo: "待办",
      done: "已办",
      created: "已创建"
    }[tapdInfo.value?.viewConfig.current_tab || ""] ||
    tapdInfo.value?.viewConfig.current_tab ||
    ""
  );
});

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
