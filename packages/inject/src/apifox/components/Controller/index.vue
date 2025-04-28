<template>
  <div class="controller">
    <ElButton type="primary" @click="handleGenCode" :loading="genCodeLoading">生成代码</ElButton>
    <ElDialog v-model="dialogVisible" width="800" title="api调用代码" append-to-body>
      <div class="controller-dialog">
        <ElTabs v-model="onCodeType" @tab-change="onCodeTypeChange">
          <ElTabPane v-for="(item, index) in codeTypes" :key="index" :label="item.objectType" :name="item.objectType" />
        </ElTabs>
        <div class="codes">
          <Code v-for="(code, index) in codes?.filter(Boolean)" :key="index" :code="code" />
        </div>
      </div>
    </ElDialog>
  </div>
</template>
<script lang="ts" setup>
import { ElButton, ElDialog, ElMessage, ElTabs, ElTabPane } from "element-plus";
import { ref } from "vue";
import { getApiCallFile } from "./getApiCallFile";
import { apiTemLocal, type ApiTemLocalType } from "@taozi-chrome-extensions/common/src/local/apiTem";
import { storageLocal } from "@taozi-chrome-extensions/common/src/local";
import Code from "../../../components/Code/index.vue";

const props = defineProps<{
  projectId: string;
  apiId: number;
}>();

const onCodeTypeLocal = storageLocal("on-code-type-local");

const dialogVisible = ref(false);

const genCodeLoading = ref(false);
const codeTypes = ref<ApiTemLocalType>([]);
const onCodeType = ref<string>("");
const codes = ref<string[]>();

const onCodeTypeChange = () => {
  onCodeTypeLocal.set(onCodeType.value);
  genCode();
};

const handleGenCode = async () => {
  genCodeLoading.value = true;
  try {
    codeTypes.value = (await apiTemLocal.get()) || [];
    onCodeType.value = (await onCodeTypeLocal.get()) || codeTypes.value[0]?.objectType || "";
    if (codeTypes.value.length <= 0) {
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
  if (!onCodeType.value) {
    return;
  }
  codes.value = (await getApiCallFile(props.projectId, props.apiId, onCodeType.value)) || [];
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
  > .codes {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
}
</style>
