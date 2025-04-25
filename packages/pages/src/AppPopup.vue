<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import BaiDuAppConfig from "./components/BaiDuAppConfig/index.vue";
import GenVarName from "./components/GenVarName/index.vue";
import Head from "./components/Head/index.vue";
import Tabs from "./components/Tabs/index.vue";
import Apifox from "./components/Apifox/index.vue";
import { storageLocal } from "@yayaluoya-extensions/common/src/local";

const activeTabLocal = storageLocal<string, TabType>("popup-active-tab");

enum TabType {
  GenVarName = "GenVarName",
  Apifox = "Apifox",
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
    label: "Apifox",
    value: TabType.Apifox
  },
  {
    label: "百度翻译api配置",
    value: TabType.BaiDuAppConfig
  }
]);
const activeTab = ref(TabType.GenVarName);

watch(activeTab, () => {
  activeTabLocal.set(activeTab.value);
});

onMounted(() => {
  activeTabLocal.get().then(v => {
    activeTab.value = v || TabType.GenVarName;
  });
});
</script>

<template>
  <div class="popup">
    <div class="head">
      <Head />
    </div>
    <Tabs v-model:value="activeTab" :list="tabs" class="tabs" />
    <div class="content-container">
      <div class="content">
        <GenVarName v-if="activeTab === TabType.GenVarName" />
        <Apifox v-if="activeTab === TabType.Apifox" />
        <BaiDuAppConfig v-if="activeTab === TabType.BaiDuAppConfig" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.popup {
  display: flex;
  flex-direction: column;
  width: 600px;
  > .tabs {
    --color: #666666;
    --on-color: #666666;
    --background-color: #ffffff;
    --on-background-color: #f7f7f7;
    --font-size: 14px;
    --padding: 5px 12px;
  }
  > .head {
    background-color: white;
    padding: 12px;
  }
  > .content-container {
    background: #f7f7f7;
    padding: 12px;
    .content {
      background-color: #ffffff;
      border-radius: 12px;
      padding: 12px;
    }
  }
}
</style>
