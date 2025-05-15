<template>
  <div class="tapd-todo">
    <ElTable class="bug-list" :data="tapdInfo?.todoList || []" v-if="tapdInfo?.todoList && tapdInfo.todoList.length > 0">
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
    <ElEmpty v-else description="暂无代办" />
  </div>
</template>

<script setup lang="ts">
import { tapdLocalStorage, type TapdLocalStorage } from "@taozi-chrome-extensions/common/src/local/tapd";
import { onMounted, onUnmounted, ref } from "vue";
import { ElTable, ElTableColumn, ElTag, ElLoading, ElEmpty } from "element-plus";

const tapdInfo = ref<TapdLocalStorage>();

let t: ReturnType<typeof setInterval>;

const getTapdInfo = async () => {
  tapdInfo.value = await tapdLocalStorage.get();
};

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
.tapd-todo {
  display: flex;
  flex-direction: column;
}
</style>
