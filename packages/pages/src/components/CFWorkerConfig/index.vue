<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ElInput, ElForm, ElFormItem } from "element-plus";
import { configLocalStorage } from "@taozi-chrome-extensions/common/src/local/config";

const proxyUrlInput = ref("");

watch([proxyUrlInput], () => {
  configLocalStorage.edit(v => {
    v.cfWorkerUrl = proxyUrlInput.value;
  });
});

onMounted(async () => {
  const { cfWorkerUrl = "" } = (await configLocalStorage.get()) || {};
  proxyUrlInput.value = cfWorkerUrl;
});
</script>

<template>
  <div class="baidu-app-config">
    <a target="_blank" href="https://dash.cloudflare.com/">cloudflare</a>
    <ElForm :model="{}" :rules="{}" label-width="auto">
      <ElFormItem label="CFWorker代理地址">
        <ElInput type="text" v-model="proxyUrlInput" />
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
