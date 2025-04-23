<script setup lang="ts">
import { ref } from "vue";
import BaiDuAppConfig from "./components/BaiDuAppConfig/index.vue";
import GenVarName from "./components/GenVarName/index.vue";
import Head from "./components/Head/index.vue";
import Tabs from "./components/Tabs/index.vue";

enum TabType {
  GenVarName = "GenVarName",
  BaiDuAppConfig = "BaiDuAppConfig"
}
const tabs: {
  label: string;
  value: TabType;
}[] = [
  {
    label: "生成变量名",
    value: TabType.GenVarName
  },
  {
    label: "百度翻译api配置",
    value: TabType.BaiDuAppConfig
  }
];
const activeTab = ref(TabType.GenVarName);
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
