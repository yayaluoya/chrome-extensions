<template>
  <div class="apifox-config">
    <ElForm :model="{}" label-width="auto" :show-message="false">
      <ElFormItem label="响应data字段名">
        <ElInput v-model="responseDataName" clearable />
      </ElFormItem>
    </ElForm>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { ElInput, ElForm, ElFormItem } from "element-plus";
import { apifoxLocalStorage, type ApifoxLocalStorage } from "@taozi-chrome-extensions/common/src/local/apifox";

const responseDataName = ref<ApifoxLocalStorage["responseDataName"]>("");

watch(
  responseDataName,
  () => {
    apifoxLocalStorage.edit(v => {
      v.responseDataName = responseDataName.value;
    });
  },
  {
    deep: true
  }
);

onMounted(async () => {
  responseDataName.value = (await apifoxLocalStorage.get())?.responseDataName || "";
});
</script>
<style lang="scss" scoped>
.apifox-config {
  display: flex;
  flex-direction: column;
}
</style>
