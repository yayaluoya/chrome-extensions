<template>
  <div class="apifox">
    <ElDescriptions title="可用字段" :column="2" size="small" border>
      <ElDescriptionsItem v-for="key of Object.keys(ApifoxTemFieldsDocs)" :label="key">{{
        ApifoxTemFieldsDocs[key as ApifoxTemFields]
      }}</ElDescriptionsItem>
    </ElDescriptions>
    <ElDivider />
    <ElForm v-for="(item, index) in tems" :key="index" :model="{}" class="items" label-width="auto" :show-message="false">
      <ElFormItem label="项目名">
        <ElInput v-model="item.objectType" />
      </ElFormItem>
      <ElFormItem label="模板内容">
        <ElAlert type="info" :closable="false" style="margin-bottom: 6px">`` 语法，多个模板内容用\n----\n分隔</ElAlert>
        <ElInput v-model="item.value" type="textarea" :rows="10" />
      </ElFormItem>
      <ElFormItem label=" ">
        <ElButton
          type="danger"
          @click="
            () => {
              deleteItemDlalog.visible = true;
              deleteItemDlalog.itemIndex = index;
            }
          "
        >
          删除项目
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
    >
      添加项目
    </ElButton>
    <ElDialog v-model="deleteItemDlalog.visible">
      <div class="delete-item-dlalog">
        <span>确认删除这个项目？</span>
        <ElButton
          type="primary"
          @click="
            () => {
              tems.splice(deleteItemDlalog.itemIndex, 1);
              deleteItemDlalog.visible = false;
            }
          "
        >
          确认
        </ElButton>
      </div>
    </ElDialog>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import {
  ElInput,
  ElButton,
  ElForm,
  ElFormItem,
  ElDescriptions,
  ElDescriptionsItem,
  ElDivider,
  ElDialog,
  ElAlert
} from "element-plus";
import { ApifoxTemFields, ApifoxTemFieldsDocs } from "@taozi-chrome-extensions/common/src/constant/apifoxTemFields";
import { apifoxLocalStorage, type ApifoxLocalStorage } from "@taozi-chrome-extensions/common/src/local/apifox";

const tems = ref<ApifoxLocalStorage["tems"]>([]);

watch(
  tems,
  () => {
    apifoxLocalStorage.edit(v => {
      v.tems = JSON.parse(JSON.stringify(tems.value));
    });
  },
  {
    deep: true
  }
);

const deleteItemDlalog = ref({
  visible: false,
  itemIndex: 0
});

onMounted(async () => {
  tems.value = (await apifoxLocalStorage.get())?.tems || [];
});
</script>
<style lang="scss" scoped>
.apifox {
  display: flex;
  flex-direction: column;
}
.delete-item-dlalog {
  display: flex;
  flex-direction: column;
  align-items: center;
  > span {
    color: #1f2024;
    font-size: 14px;
    font-weight: 700;
    line-height: 22px;
    margin-bottom: 12px;
  }
}
</style>
