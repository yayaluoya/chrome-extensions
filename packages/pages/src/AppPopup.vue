<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import BaiDuAppConfig from "./components/BaiDuAppConfig/index.vue";
import GenVarName from "./components/GenVarName/index.vue";
import Head from "./components/Head/index.vue";
import Tabs from "./components/Tabs/index.vue";
import ApifoxConfig from "./components/apifox/ApifoxConfig/index.vue";
import ApifoxTem from "./components/apifox/ApifoxTem/index.vue";
import Tapd from "./components/Tapd/index.vue";
import { configLocalStorage } from "@taozi-chrome-extensions/common/src/local/config";
import CodesignRecentViewed from "./components/codesign/CodesignRecentViewed/index.vue";
import CFWorkerConfig from "./components/CFWorkerConfig/index.vue";
import CodesignConfig from "./components/codesign/CodesignConfig/index.vue";

enum TabType {
  GenVarName = "GenVarName",
  Codesign = "Codesign",
  Apifox = "Apifox",
  Config = "Config"
}
const tabs = ref<
  {
    label: string;
    value: TabType;
  }[]
>([
  {
    label: "生成变量名",
    value: TabType.GenVarName
  },
  {
    label: "Codesign",
    value: TabType.Codesign
  },
  {
    label: "Apifox",
    value: TabType.Apifox
  },
  {
    label: "项目配置",
    value: TabType.Config
  }
]);
const activeTab = ref(TabType.GenVarName);

watch(activeTab, () => {
  configLocalStorage.edit(v => {
    v.popupActiveTab = activeTab.value;
  });
});

onMounted(async () => {
  activeTab.value = ((await configLocalStorage.get())?.popupActiveTab as TabType) || TabType.GenVarName;
});
</script>

<template>
  <div class="popup">
    <div class="head">
      <Head />
    </div>
    <div class="tapd">
      <Tapd />
    </div>
    <Tabs v-model:value="activeTab" :list="tabs" class="tabs" />
    <div class="content-container">
      <template v-if="activeTab === TabType.GenVarName">
        <div class="content">
          <GenVarName />
        </div>
      </template>
      <template v-else-if="activeTab === TabType.Codesign">
        <div class="title">
          <div class="left"></div>
          <span>最近浏览</span>
        </div>
        <div class="content">
          <CodesignRecentViewed />
        </div>
        <div class="title">
          <div class="left"></div>
          <span>配置</span>
        </div>
        <div class="content">
          <CodesignConfig />
        </div>
      </template>
      <template v-else-if="activeTab === TabType.Apifox">
        <div class="title">
          <div class="left"></div>
          <span>Apifox配置</span>
        </div>
        <div class="content">
          <ApifoxConfig />
        </div>
        <div class="title">
          <div class="left"></div>
          <span>模板配置</span>
        </div>
        <div class="content">
          <ApifoxTem />
        </div>
      </template>
      <template v-else-if="activeTab === TabType.Config">
        <div class="title">
          <div class="left"></div>
          <span>CFWorker配置</span>
        </div>
        <div class="content">
          <CFWorkerConfig />
        </div>
        <div class="title">
          <div class="left"></div>
          <span>百度翻译api配置</span>
        </div>
        <div class="content">
          <BaiDuAppConfig />
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.popup {
  display: flex;
  flex-direction: column;
  width: 800px;
  > .tabs {
    --color: #666666;
    --on-color: #409eff;
    --background-color: #ffffff;
    --on-background-color: #f7f7f7;
    --font-size: 14px;
    --padding: 8px 12px;
  }
  > .head {
    background-color: white;
    padding: 12px;
    box-sizing: border-box;
  }
  > .content-container {
    background: #f7f7f7;
    padding: 12px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .title {
      font-size: 14px;
      font-weight: 600;
      color: #333333;
      display: flex;
      align-items: center;
      gap: 6px;
      .left {
        height: 16px;
        border-radius: 4px;
        width: 4px;
        background-color: #409eff;
      }
    }
    .content {
      background-color: #ffffff;
      border-radius: 12px;
      box-sizing: border-box;
      padding: 12px;
    }
  }
}
</style>
