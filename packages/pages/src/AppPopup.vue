<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import BaiDuAppConfig from "./components/BaiDuAppConfig/index.vue";
import GenVarName from "./components/GenVarName/index.vue";
import Head from "./components/Head/index.vue";
import Tabs from "./components/Tabs/index.vue";
import ApifoxTem from "./components/ApifoxTem/index.vue";
import Tapd from "./components/Tapd/index.vue";
import { configLocalStorage } from "@taozi-chrome-extensions/common/src/local/config";

enum TabType {
  GenVarName = "GenVarName",
  ApifoxTem = "ApifoxTem",
  BaiDuAppConfig = "BaiDuAppConfig"
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
    label: "ApifoxTem",
    value: TabType.ApifoxTem
  },
  {
    label: "百度翻译api配置",
    value: TabType.BaiDuAppConfig
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
      <div class="content">
        <GenVarName v-if="activeTab === TabType.GenVarName" />
        <ApifoxTem v-if="activeTab === TabType.ApifoxTem" />
        <BaiDuAppConfig v-if="activeTab === TabType.BaiDuAppConfig" />
      </div>
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
    --on-color: #666666;
    --background-color: #ffffff;
    --on-background-color: #f7f7f7;
    --font-size: 14px;
    --padding: 5px 12px;
  }
  > .tapd {
    padding: 12px;
    box-sizing: border-box;
    border-top: 1px solid #f4f4f5;
    border-bottom: 1px solid #f4f4f5;
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
    .content {
      background-color: #ffffff;
      border-radius: 12px;
      box-sizing: border-box;
      padding: 12px;
    }
  }
}
</style>
