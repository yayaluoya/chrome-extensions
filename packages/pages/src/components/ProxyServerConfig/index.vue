<template>
  <div class="proxy-server-config">
    <ElAlert title="可以通过cloudflare快速部署一个代理服务" type="info" :closable="false" />
    <a target="_blank" href="https://dash.cloudflare.com/">cloudflare官网</a>
    <a target="_blank" href="https://github.com/yayaluoya/taozi-chrome-extensions/tree/master/packages/cf-worker">
      cloudflare worker代码
    </a>
    <ElForm :model="{}" :rules="{}" label-width="auto" label-suffix=":">
      <ElFormItem label="Api代理服务地址">
        <ElInput type="text" v-model="proxyServiceUrlInput" />
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ElInput, ElForm, ElFormItem, ElAlert } from "element-plus";
import { configLocalStorage } from "@taozi-chrome-extensions/common/src/local/config";

const proxyServiceUrlInput = ref("");

watch([proxyServiceUrlInput], () => {
  configLocalStorage.edit(v => {
    v.proxyServiceUrl = proxyServiceUrlInput.value;
  });
});

onMounted(async () => {
  const { proxyServiceUrl = "" } = (await configLocalStorage.get()) || {};
  proxyServiceUrlInput.value = proxyServiceUrl;
});
</script>

<style lang="scss" scoped>
.proxy-server-config {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
