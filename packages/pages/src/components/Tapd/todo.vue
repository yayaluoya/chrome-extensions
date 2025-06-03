<template>
  <div class="tapd-todo">
    <ElTable class="bug-list" :data="showTodoList" v-if="showTodoList && showTodoList.length > 0">
      <ElTableColumn prop="title" label="标题">
        <template #default="{ row }">
          <div style="display: flex; align-items: center">
            <ElTag
              style="margin-right: 6px"
              effect="dark"
              round
              :type="bugEntityTypeReg.test(row.entity_type) ? 'danger' : 'info'"
            >
              {{ row.entity_type.toLocaleUpperCase() }}
            </ElTag>
            <span class="title-span" @click="openTab(row.detail_url)">{{ row.title }}</span>
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="priority_name" width="100" label="优先级" />
      <ElTableColumn prop="short_id" width="100" label="短id">
        <template #default="{ row }">
          <span class="short-id-span" @click="copyShortId(row.short_id)">{{ row.short_id }}</span>
        </template>
      </ElTableColumn>
    </ElTable>
    <ElEmpty v-else description="暂无代办" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ElTable, ElTableColumn, ElTag, ElLoading, ElEmpty, ElMessage } from "element-plus";
import { useTapdInfo } from "../../hooks/useTapdInfo";

const bugEntityTypeReg = /^bug$/i;

const { tapdInfo } = useTapdInfo();

const showTodoList = computed(() => {
  return tapdInfo.value?.todoList.sort((a, b) => {
    return bugEntityTypeReg.test(a.entity_type) && !bugEntityTypeReg.test(b.entity_type) ? -1 : 0;
  });
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

const copyShortId = async (shortId: string) => {
  navigator.clipboard
    .writeText(shortId)
    .then(() => {
      ElMessage({
        message: "复制成功",
        type: "success"
      });
    })
    .catch(() => {
      ElMessage({
        message: "复制失败",
        type: "error"
      });
    });
};
</script>

<style lang="scss" scoped>
.tapd-todo {
  display: flex;
  flex-direction: column;
  .title-span {
    cursor: pointer;
    &:hover {
      color: #409eff;
      text-decoration: underline;
    }
  }
  .short-id-span {
    cursor: pointer;
    &:hover {
      color: #409eff;
      text-decoration: underline;
    }
  }
}
</style>
