<template>
  <div class="controller">
    <ElButton type="primary" @click="handleGenCode" :loading="genCodeLoading">生成代码</ElButton>
    <ElDialog v-model="dialogVisible" width="800" title="api调用代码" append-to-body>
      <div class="controller-dialog" @click="handleCopyCode">
        <code>{{ code }}</code>
      </div>
    </ElDialog>
  </div>
</template>
<script lang="ts" setup>
import { ElButton, ElDialog, ElMessage } from "element-plus";
import { ref } from "vue";
import { getApiCallFile } from "./getApiCallFile";

const props = defineProps<{
  projectId: string;
  apiId: number;
}>();

const dialogVisible = ref(false);

const genCodeLoading = ref(false);
const code = ref("");

const handleGenCode = async () => {
  genCodeLoading.value = true;
  try {
    code.value = (await getApiCallFile(props.projectId, props.apiId)) || "";
    dialogVisible.value = true;
  } catch (err: any) {
    ElMessage({
      message: err.toString(),
      type: "error"
    });
  } finally {
    genCodeLoading.value = false;
  }
};

const handleCopyCode = () => {
  navigator.clipboard.writeText(code.value).then(() => {
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
  padding: 5px 12px;
  border-radius: 4px;
  cursor: text;
  background: rgba(0, 0, 0, 0.04);
  code {
    white-space: pre-wrap;
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
  }
}
</style>
