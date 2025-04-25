<template>
  <div class="apifox">
    <ElForm v-for="(item, index) in tems" :key="index" :model="{}" class="items" label-width="auto">
      <ElFormItem label="项目名">
        <ElInput v-model="item.objectType" />
      </ElFormItem>
      <ElFormItem label="模板内容">
        <ElInput v-model="item.value" type="textarea" :rows="10" />
      </ElFormItem>
      <ElFormItem label=" ">
        <ElButton
          type="danger"
          @click="
            () => {
              tems.splice(index, 1);
            }
          "
        >
          删除
        </ElButton>
      </ElFormItem>
    </ElForm>
    <ElButton
      type="primary"
      @click="
        () => {
          tems.push({ objectType: '', value: '' });
        }
      "
      >添加</ElButton
    >
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { apiTemLocal, type ApiTemLocalType } from "@yayaluoya-extensions/common/src/local/apiTem";
import { ElInput, ElButton, ElForm, ElFormItem } from "element-plus";

const tems = ref<ApiTemLocalType>([]);

watch(
  tems,
  () => {
    apiTemLocal.set(JSON.parse(JSON.stringify(tems.value)));
  },
  {
    deep: true
  }
);

onMounted(async () => {
  tems.value = (await apiTemLocal.get()) || [];
});
</script>
<style lang="scss" scoped>
.apifox {
  display: flex;
  flex-direction: column;
}
</style>
