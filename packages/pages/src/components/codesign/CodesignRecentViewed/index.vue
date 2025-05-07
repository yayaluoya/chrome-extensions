<template>
  <div class="codesign-recent-viewed">
    <ElSkeleton v-if="loading" :rows="5" animated />
    <template v-else-if="list.length > 0">
      <div class="recent-viewed-item" v-for="item in list" :key="item.id" @click="handleClick(item)">
        <div class="recent-viewed-item-cover">
          <img :src="item.cover_url || item.fallback_cover_url" alt="" />
        </div>
        <div class="recent-viewed-item-info">
          <span class="name">{{ item.name }}</span>
          <span class="model">{{ item.model === "design" ? "设计" : "原型" }}</span>
          <span class="update-time"
            >{{ dayjs(item.updated_at).format("YYYY-MM-DD HH:mm:ss") }} 由 {{ item.updater.nickname }} 更新</span
          >
        </div>
      </div>
    </template>
    <ElEmpty v-else description="暂无最近浏览" />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { requestUser, requestRecentViewed } from "../api";
import type { RecentViewedItem } from "../api/type";
import { ElMessage, ElEmpty, ElSkeleton } from "element-plus";
import dayjs from "dayjs";

const loading = ref(false);
const list = ref<RecentViewedItem[]>([]);

onMounted(async () => {
  loading.value = true;
  try {
    const user = await requestUser();
    const { data: recentViewed } = await requestRecentViewed(user.last_team_id);
    list.value = recentViewed;
  } catch (error: any) {
    ElMessage.error(error.toString());
  } finally {
    loading.value = false;
  }
});

const handleClick = async (item: RecentViewedItem) => {
  let url = "";
  if (item.model === "prototype") {
    url = `https://codesign.qq.com/app/prototype/${item.id}/detail`;
  } else if (item.model === "design") {
    url = `https://codesign.qq.com/app/design/${item.id}/board`;
  }
  if (!url) return;
  const [targetTab] = await chrome.tabs.query({
    url
  });
  if (targetTab) {
    chrome.tabs.update(targetTab.id!, { active: true });
  } else {
    chrome.tabs.create({ url });
  }
};
</script>
<style lang="scss" scoped>
.codesign-recent-viewed {
  display: flex;
  flex-direction: column;
  gap: 10px;
  .recent-viewed-item {
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
      margin-bottom: 0;
    }
    .recent-viewed-item-cover {
      width: 100px;
      height: 100px;
      overflow: hidden;
      img {
        width: 100%;
      }
    }
    .recent-viewed-item-info {
      display: flex;
      flex-direction: column;
      flex: 1;
      align-items: start;
      gap: 10px;
      height: 100px;
      padding: 10px 0;
      box-sizing: border-box;
      .name {
        font-size: 14px;
        font-weight: bold;
      }
      .model {
        font-size: 12px;
        color: #999;
      }
      .update-time {
        font-size: 12px;
        color: #999;
      }
    }
  }
}
</style>
