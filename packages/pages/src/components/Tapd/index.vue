<template>
  <div class="tapd">
    <div class="alert">
      注意！必须登录
      <a href="https://www.tapd.cn/" target="_blank">tapd</a>
      并保持一个tapd的标签页处于活跃状态
    </div>
    <div class="alert">
      最近数据更新时间: {{ tapdInfo?.dataUpdateTime }}，如果超过3秒未更新数据则可能是tapd页面被冻结了，需要手动刷新一下
    </div>
    <div class="board">
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
              >
                {{ item.title }}
              </span>
            </span>
          </template>
        </ElStatistic>
      </template>
    </div>
    <ElTable class="bug-list" :data="tapdInfo?.bugList || []" v-if="tapdInfo?.bugList && tapdInfo.bugList.length > 0">
      <ElTableColumn prop="title" label="标题">
        <template #default="{ row }">
          <div style="display: flex; align-items: center">
            <ElTag style="margin-right: 6px" effect="dark" round :type="/^bug$/i.test(row.entity_type) ? 'danger' : 'info'">
              {{ row.entity_type.toLocaleUpperCase() }}
            </ElTag>
            <span style="cursor: pointer" @click="openTab(row.detail_url)">{{ row.title }}</span>
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="priority_name" width="120" label="优先级" />
    </ElTable>
  </div>
</template>

<script setup lang="ts">
import { tapdLocalStorage, type TapdLocalStorage } from "@taozi-chrome-extensions/common/src/local/tapd";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { ElAlert, ElStatistic, ElTable, ElTableColumn, ElDivider, ElTag, ElLoading } from "element-plus";

const tapdInfo = ref<TapdLocalStorage>();

let t: ReturnType<typeof setInterval>;

const getTapdInfo = async () => {
  tapdInfo.value = await tapdLocalStorage.get();
};

const statistics = computed(() => {
  return [
    {
      title: "story".toLocaleUpperCase(),
      value: tapdInfo.value?.workitemCount.story || 0,
      color: "#409EFF"
    },
    {
      title: "task".toLocaleUpperCase(),
      value: tapdInfo.value?.workitemCount.task || 0,
      color: "#303133"
    },
    {
      title: "bug".toLocaleUpperCase(),
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

const openTab = async (url: string) => {
  const loadingInstance = ElLoading.service({ fullscreen: true });
  try {
    url = await fetch(url).then(res => res.url);
    const [targetTab] = await chrome.tabs.query({
      url
    });
    if (targetTab) {
      chrome.tabs.update(targetTab.id!, { active: true });
    } else {
      chrome.tabs.create({ url });
    }
  } finally {
    loadingInstance.close();
  }
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
  flex-direction: column;
  .alert {
    margin-bottom: 12px;
  }
  .board {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
  }
  .bug-list {
    border: 1px solid #dcdfe6;
    border-radius: 12px;
    margin-top: 12px;
  }
}
</style>
