<template>
  <div class="controller">
    <ElButton type="primary" @click="handleGenCode" :loading="genCodeLoading">生成代码</ElButton>
    <ElDialog v-model="dialogVisible" width="800" title="api调用代码" append-to-body>
      <div class="controller-dialog">
        <ElTabs v-model="onCodeTemplateId" type="card" @tab-change="onCodeTemplateIdChange">
          <ElTabPane v-for="(item, index) in codeTemplates" :key="index" :label="item.name || '--'" :name="item.id">
            <div class="codes">
              <Code v-for="(code, index) in codes?.filter(Boolean)" :key="index" :code="code" type="ts" />
            </div>
          </ElTabPane>
        </ElTabs>
      </div>
    </ElDialog>
  </div>
</template>
<script lang="ts" setup>
import { ElButton, ElDialog, ElMessage, ElTabs, ElTabPane } from "element-plus";
import { ref } from "vue";
import { getApiCallFile } from "./getApiCallFile";
import { apifoxLocalStorage, type ApifoxLocalStorage } from "@taozi-chrome-extensions/common/src/local/apifox";
import Code from "../../../components/Code/index.vue";

const props = defineProps<{
  projectId: string;
  apiId: number;
}>();

const dialogVisible = ref(false);

const genCodeLoading = ref(false);
const codeTemplates = ref<ApifoxLocalStorage["codeTemplates"]>([]);
const onCodeTemplateId = ref<string>("");
const codes = ref<string[]>();

const onCodeTemplateIdChange = () => {
  apifoxLocalStorage.edit(v => {
    v.onCodeTemplateId = onCodeTemplateId.value;
  });
  genCode();
};

const handleGenCode = async () => {
  genCodeLoading.value = true;
  try {
    codeTemplates.value = (await apifoxLocalStorage.get())?.codeTemplates || [];
    onCodeTemplateId.value = (await apifoxLocalStorage.get())?.onCodeTemplateId || codeTemplates.value[0]?.id || "";
    if (codeTemplates.value.length <= 0) {
      ElMessage({
        message: "请先配置api模板",
        type: "error"
      });
      return;
    }
    await genCode();
    dialogVisible.value = true;
  } catch (err: any) {
    console.error(err);
    ElMessage({
      message: err.toString(),
      type: "error"
    });
  } finally {
    genCodeLoading.value = false;
  }
};

const genCode = async () => {
  if (!onCodeTemplateId.value) {
    return;
  }
  codes.value =
    (await getApiCallFile({
      projectId: props.projectId,
      apiId: props.apiId,
      codeTems: ((await apifoxLocalStorage.get())?.codeTemplates?.find(item => item.id === onCodeTemplateId.value)?.value || "")
        .split(/\n+----\n+/)
        .map(item => item.trim())
        .filter(Boolean)
    })) || [];
};
</script>
<style lang="scss" scoped>
.controller {
  display: flex;
  padding: 0 6px;
}
.controller-dialog {
  display: flex;
  flex-direction: column;
  .codes {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
}
</style>
