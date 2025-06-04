<template>
  <div class="baidu-app-config">
    <ElForm :model="{}" :rules="{}" label-width="auto" label-suffix=":">
      <ElFormItem label="生成文本css样式时忽略字体样式">
        <ElSwitch v-model="config.ignoreCssFontFamily" />
      </ElFormItem>
      <ElFormItem label="在有padding属性时加入box-sizing: border-box">
        <ElSwitch v-model="config.boxSizing" />
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ElForm, ElFormItem, ElSwitch } from "element-plus";
import { codesignLocalStorage, type CodesignLocalStorage } from "@taozi-chrome-extensions/common/src/local/codesign";

const config = ref<CodesignLocalStorage["config"]>({
  ignoreCssFontFamily: false,
  boxSizing: false
});

watch(
  [config],
  () => {
    codesignLocalStorage.edit(v => {
      v.config = JSON.parse(JSON.stringify(config.value));
    });
  },
  { deep: true }
);

onMounted(async () => {
  const { config: config2 = {} } = (await codesignLocalStorage.get()) || {};
  config.value = config2 || {
    ignoreCssFontFamily: false,
    boxSizing: false
  };
});
</script>

<style lang="scss" scoped>
.baidu-app-config {
  display: flex;
  flex-direction: column;
}
</style>
