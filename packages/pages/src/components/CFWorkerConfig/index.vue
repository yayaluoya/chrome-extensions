<template>
  <div class="baidu-app-config">
    <ElAlert title="可以快速通过cloudflare部署一个代理服务" type="info" :closable="false" />
    <a target="_blank" href="https://dash.cloudflare.com/">cloudflare官网</a>
    <a target="_blank" href="https://github.com/yayaluoya/taozi-chrome-extensions/tree/master/packages/cf-worker">
      cloudflare worker代码
    </a>
    <ElForm :model="{}" :rules="{}" label-width="auto" label-suffix=":">
      <ElFormItem label="Api代理地址">
        <ElInput type="text" v-model="proxyUrlInput" />
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ElInput, ElForm, ElFormItem, ElAlert } from "element-plus";
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

<style lang="scss" scoped>
.baidu-app-config {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
