<template>
  <div class="apifox">
    <ElTabs v-model="onCodeTemplateId" type="card" editable class="demo-tabs" @edit="handleTabsEdit">
      <ElTabPane v-for="item in codeTemplates" :key="item.id" :label="item.name || '--'" :name="item.id">
        <ElForm :model="{}" class="items" label-width="auto" :show-message="false">
          <ElFormItem label="模板名">
            <ElInput v-model="item.name" />
          </ElFormItem>
          <ElFormItem label="模板内容">
            <ElAlert type="info" :closable="false" style="margin-bottom: 6px"
              >js的模板字符串语法，多个模板内容用\n----\n分隔</ElAlert
            >
            <ElInput v-model="item.value" type="textarea" :rows="10" />
          </ElFormItem>
        </ElForm>
      </ElTabPane>
    </ElTabs>
    <ElEmpty v-if="codeTemplates.length === 0" description="暂无模板" />
    <ElDivider />
    <ElDescriptions title="模板可用字段" :column="2" size="small" border>
      <ElDescriptionsItem v-for="key of Object.keys(ApifoxTemFieldsDocs)" :label="key">{{
        ApifoxTemFieldsDocs[key as ApifoxTemFields]
      }}</ElDescriptionsItem>
    </ElDescriptions>
    <ElDialog v-model="deleteTemplateDialog.visible">
      <div class="delete-item-dlalog">
        <span>确认删除模板: {{ deleteTemplateDialog.templateName }}</span>
        <ElButton type="primary" @click="handleDeleteTemplate">确认</ElButton>
      </div>
    </ElDialog>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue";
import {
  ElInput,
  ElButton,
  ElForm,
  ElFormItem,
  ElDescriptions,
  ElDescriptionsItem,
  ElDivider,
  ElDialog,
  ElAlert,
  ElEmpty,
  ElTabs,
  ElTabPane,
  type TabPaneName
} from "element-plus";
import { ApifoxTemFields, ApifoxTemFieldsDocs } from "@taozi-chrome-extensions/common/src/constant/apifoxTemFields";
import { apifoxLocalStorage, type ApifoxLocalStorage } from "@taozi-chrome-extensions/common/src/local/apifox";
import { md5 } from "@taozi-chrome-extensions/common/src/utils/md5";

const onCodeTemplateId = ref<string>("");
const codeTemplates = ref<ApifoxLocalStorage["codeTemplates"]>([]);

watch(
  [codeTemplates, onCodeTemplateId],
  () => {
    apifoxLocalStorage.edit(v => {
      v.codeTemplates = JSON.parse(JSON.stringify(codeTemplates.value));
      v.onCodeTemplateId = onCodeTemplateId.value;
    });
  },
  {
    deep: true
  }
);

const deleteTemplateDialog = reactive({
  visible: false,
  templateId: "",
  templateName: ""
});

const handleDeleteTemplate = () => {
  const index = codeTemplates.value.findIndex(item => item.id === deleteTemplateDialog.templateId);
  if (index !== -1) {
    codeTemplates.value.splice(index, 1);
  }
  if (onCodeTemplateId.value === deleteTemplateDialog.templateId) {
    onCodeTemplateId.value = codeTemplates.value[0]?.id || "";
  }
  deleteTemplateDialog.visible = false;
};

const handleTabsEdit = (templateId: TabPaneName | undefined, action: "remove" | "add") => {
  if (action === "add") {
    codeTemplates.value.push({ id: md5(Date.now() + Math.random()), name: "", value: "" });
    if (!onCodeTemplateId.value) {
      onCodeTemplateId.value = codeTemplates.value[0].id;
    }
  } else if (action === "remove") {
    deleteTemplateDialog.visible = true;
    deleteTemplateDialog.templateId = templateId as string;
    deleteTemplateDialog.templateName = codeTemplates.value.find(item => item.id === templateId)?.name || "";
  }
};

onMounted(async () => {
  const { codeTemplates: codeTemplatesValue = [], onCodeTemplateId: onCodeTemplateIdValue = "" } =
    (await apifoxLocalStorage.get()) || {};
  codeTemplates.value = codeTemplatesValue;
  onCodeTemplateId.value = onCodeTemplateIdValue;
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
