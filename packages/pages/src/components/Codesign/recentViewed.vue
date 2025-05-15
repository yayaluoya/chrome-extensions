<template>
  <div class="codesign-recent-viewed">
    <div class="list">
      <template v-if="loading">
        <ElSkeleton v-for="i in 4" :key="i" :rows="4" animated />
      </template>
      <template v-else-if="list.length > 0">
        <div class="recent-viewed-item" v-for="item in list" :key="item.id" @click="handleClick(item)">
          <div class="recent-viewed-item-cover">
            <img :src="item.cover_url || item.fallback_cover_url" alt="" />
            <span class="model">{{ item.model === "design" ? "设计图" : "原型图" }}</span>
          </div>
          <div class="recent-viewed-item-info">
            <span class="name">{{ item.name }}</span>
            <span class="update-time"
              >{{ dayjs(item.updated_at).format("YYYY-MM-DD HH:mm:ss") }} 由 {{ item.updater.nickname }} 更新</span
            >
          </div>
        </div>
      </template>
    </div>
    <ElEmpty v-if="!loading && list.length <= 0" description="暂无最近浏览" />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { requestUser, requestRecentViewed } from "./api";
import type { RecentViewedItem } from "./api/type";
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
  .list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;

    .recent-viewed-item {
      display: flex;
      flex-direction: column;
      cursor: pointer;
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s ease;
      &:hover {
        filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.08));
      }
      .recent-viewed-item-cover {
        width: 100%;
        height: 100px;
        overflow: hidden;
        position: relative;
        background: url("data:img/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPAgMAAABGuH3ZAAAACVBMVEX3+fvv8vTz9vhtSfzXAAAAGklEQVQI12MIDWNgIECsWrVqBQMDU2gIfgIAwnIMASbGc5UAAAAASUVORK5CYII=");
        img {
          width: 100%;
        }
        .model {
          position: absolute;
          z-index: 10;
          background: rgba(34, 35, 36, 0.8);
          border-radius: 2px;
          color: hsla(0, 0%, 100%, 0.9);
          line-height: 20px;
          padding: 0 4px;
          font-weight: 500;
          font-size: 10px;
          right: 8px;
          bottom: 8px;
        }
      }
      .recent-viewed-item-info {
        display: flex;
        flex-direction: column;
        gap: 10px;
        box-sizing: border-box;
        background-color: #f6f9fb;
        padding: 8px 16px;
        .name {
          font-size: 14px;
          font-weight: bold;
        }

        .update-time {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
}
</style>
