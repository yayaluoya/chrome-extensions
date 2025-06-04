<template>
  <div class="baidu-app-config">
    <ElForm :model="{}" :rules="{}" label-width="auto" label-suffix=":">
      <ElFormItem label="生成文本css样式时忽略字体样式">
        <ElSwitch v-model="isIgnoreCssFontFamily" />
      </ElFormItem>
      <ElFormItem label="在有padding属性时加入box-sizing: border-box">
        <ElSwitch v-model="isBoxSizing" />
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ElForm, ElFormItem, ElSwitch } from "element-plus";
import { codesignLocalStorage } from "@taozi-chrome-extensions/common/src/local/codesign";

const isIgnoreCssFontFamily = ref(false);
const isBoxSizing = ref(false);

watch(
  [isIgnoreCssFontFamily, isBoxSizing],
  () => {
    codesignLocalStorage.edit(v => {
      v.config = {
        ignoreCssFontFamily: isIgnoreCssFontFamily.value,
        boxSizing: isBoxSizing.value
      };
    });
  },
  { deep: true }
);

onMounted(async () => {
  const { config: { ignoreCssFontFamily = false, boxSizing = false } = {} } = (await codesignLocalStorage.get()) || {};
  isIgnoreCssFontFamily.value = ignoreCssFontFamily;
  isBoxSizing.value = boxSizing;
});
</script>

<style lang="scss" scoped>
.baidu-app-config {
  display: flex;
  flex-direction: column;
}
</style>
