<template>
  <div class="baidu-app-config">
    <ElAlert title="需要通过百度翻译来翻译一些代码中用到的变量名，类名" type="info" :closable="false" />
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

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ElInput, ElForm, ElFormItem, ElAlert } from "element-plus";
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

<style lang="scss" scoped>
.baidu-app-config {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
