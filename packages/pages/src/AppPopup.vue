<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { baiduAppIdStorage, baiduKeyStorage } from "@yayaluoya-extensions/common/src/local/baiduApp";
import { ElInput, ElForm, ElFormItem } from "element-plus";

const appIdInput = ref("");
const keyInput = ref("");

watch(appIdInput, () => {
  baiduAppIdStorage.set(appIdInput.value);
});
watch(keyInput, () => {
  baiduKeyStorage.set(keyInput.value);
});

onMounted(async () => {
  appIdInput.value = (await baiduAppIdStorage.get()) || "";
  keyInput.value = (await baiduKeyStorage.get()) || "";
});
</script>

<template>
  <div class="popup">
    <ElForm :model="{}" :rules="{}" label-width="auto">
      <ElFormItem label="baidu-appId">
        <ElInput type="text" v-model="appIdInput" />
      </ElFormItem>
      <ElFormItem label="baidu-key">
        <ElInput type="text" v-model="keyInput" />
      </ElFormItem>
    </ElForm>
  </div>
</template>

<style lang="scss" scoped>
.popup {
  display: flex;
  flex-direction: column;
  width: 370px;
}
</style>
