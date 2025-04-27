<template>
  <div class="controller">
    <ElButton type="primary" @click="handleGenCode" :loading="genCodeLoading">生成代码</ElButton>
    <ElDialog v-model="dialogVisible" width="800" title="api调用代码" append-to-body>
      <div class="controller-dialog">
        <div class="top">
          <ElRadioGroup v-model="onCodeType" @change="onCodeTypeChange">
            <ElRadioButton v-for="(item, index) in codeTypes" :key="index" :label="item.objectType" :value="item.objectType" />
          </ElRadioGroup>
        </div>
        <code v-for="(code, index) in codes?.filter(Boolean)" :key="index" @click="handleCopyCode(code)">{{ code }}</code>
      </div>
    </ElDialog>
  </div>
</template>
<script lang="ts" setup>
import { ElButton, ElDialog, ElMessage, ElRadioGroup, ElRadioButton } from "element-plus";
import { onMounted, ref, watch } from "vue";
import { getApiCallFile } from "./getApiCallFile";
import { apiTemLocal, type ApiTemLocalType } from "@taozi-chrome-extensions/common/src/local/apiTem";
import { storageLocal } from "@taozi-chrome-extensions/common/src/local";

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

const handleCopyCode = (code: string) => {
  navigator.clipboard.writeText(code).then(() => {
    ElMessage({
      message: "复制成功",
      type: "success"
    });
  });
};
</script>
<style lang="scss" scoped>
.controller {
  display: flex;
}
.controller-dialog {
  display: flex;
  flex-direction: column;

  > .top {
    margin-bottom: 12px;
  }
  > code {
    padding: 5px 12px;
    border-radius: 4px;
    cursor: text;
    background: rgba(0, 0, 0, 0.04);
    white-space: pre-wrap;
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
    margin-bottom: 6px;
    &:nth-last-child(1) {
      margin-bottom: 0;
    }
  }
}
</style>
