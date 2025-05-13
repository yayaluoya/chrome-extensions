<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ElInput, ElForm, ElFormItem } from "element-plus";
import { configLocalStorage } from "@taozi-chrome-extensions/common/src/local/config";

const appIdInput = ref("");
const keyInput = ref("");

watch([appIdInput, keyInput], () => {
  configLocalStorage.edit(v => {
    v.baiduAppId = appIdInput.value;
    v.baiduKey = keyInput.value;
  });
});

onMounted(async () => {
  const { baiduAppId = "", baiduKey = "" } = (await configLocalStorage.get()) || {};
  appIdInput.value = baiduAppId;
  keyInput.value = baiduKey;
});
</script>

<template>
  <div class="baidu-app-config">
    <a target="_blank" href="https://fanyi-api.baidu.com/manage/developer">百度翻译开发者中心</a>
    <ElForm :model="{}" :rules="{}" label-width="auto" label-suffix=":">
      <ElFormItem label="appId">
        <ElInput type="text" v-model="appIdInput" />
      </ElFormItem>
      <ElFormItem label="key">
        <ElInput type="text" v-model="keyInput" />
      </ElFormItem>
    </ElForm>
  </div>
</template>

<style lang="scss" scoped>
.baidu-app-config {
  display: flex;
  flex-direction: column;
  > a {
    margin-bottom: 12px;
  }
}
</style>
