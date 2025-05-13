<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ElForm, ElFormItem, ElSwitch } from "element-plus";
import { codesignLocalStorage, type CodesignLocalStorage } from "@taozi-chrome-extensions/common/src/local/codesign";

const config = ref<CodesignLocalStorage["config"]>({
  removeCssFontFamily: false
});

watch(
  [config],
  () => {
    codesignLocalStorage.edit(v => {
      v.config = config.value;
    });
  },
  { deep: true }
);

onMounted(async () => {
  const { config: config2 = {} } = (await codesignLocalStorage.get()) || {};
  config.value = config2 || {};
});
</script>

<template>
  <div class="baidu-app-config">
    <ElForm :model="{}" :rules="{}" label-width="auto">
      <ElFormItem label="去除css字体样式">
        <ElSwitch v-model="config.removeCssFontFamily" />
      </ElFormItem>
    </ElForm>
  </div>
</template>

<style lang="scss" scoped>
.baidu-app-config {
  display: flex;
  flex-direction: column;
}
</style>
