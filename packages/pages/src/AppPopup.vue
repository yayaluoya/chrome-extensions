<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { baiduAppIdStorage, baiduKeyStorage } from "@yayaluoya-extensions/common/src/local/baidu";

const appIdInput = ref("");
const keyInput = ref("");

watch(appIdInput, () => {
  baiduAppIdStorage.set(appIdInput.value);
});
watch(keyInput, () => {
  baiduKeyStorage.set(keyInput.value);
});

onMounted(async () => {
  appIdInput.value = await baiduAppIdStorage.get();
  keyInput.value = await baiduKeyStorage.get();
});
</script>

<template>
  <div class="popup">
    <span>baidu-appId</span>
    <input type="text" v-model="appIdInput" />
    <span>baidu-key</span>
    <input type="text" v-model="keyInput" />
  </div>
</template>

<style lang="scss" scoped>
.popup {
  display: flex;
  flex-direction: column;
  width: 370px;
  height: 750px;
}
</style>
