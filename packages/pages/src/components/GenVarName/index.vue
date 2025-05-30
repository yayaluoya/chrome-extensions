<template>
  <div class="gen-var-name">
    <ElInput type="text" v-model="input" @keydown.enter="handleClick" placeholder="请输入...">
      <template #append>
        <ElButton @click="handleClick" :loading="loading">确定</ElButton>
      </template>
    </ElInput>
    <ElSkeleton v-if="loading" :rows="3" animated />
    <template v-else-if="results.length > 0">
      <div class="results-container">
        <div v-for="(result, index) in results" :key="index" class="result-group">
          <span v-for="(value, key) in result" :key="key" class="try-result" @click="handleCodeItem(value)">
            {{ value }}
          </span>
        </div>
      </div>
    </template>
    <ElEmpty v-else description="暂无数据" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ElInput, ElButton, ElMessage, ElEmpty, ElSkeleton } from "element-plus";
import { sendMessage } from "@taozi-chrome-extensions/common/src/messageServer";
import { MessageType } from "@taozi-chrome-extensions/common/src/constant/messageType";
import { kebabToCamelCase, camelToKebabCase, toValidVariableName } from "@taozi-chrome-extensions/common/src/utils/global";
import { genVarNameLocalStorage } from "@taozi-chrome-extensions/common/src/local/genVarName";

// Types
type ResultType = {
  camelCase: string;
  pascalCase: string;
  kebabCase: string;
};

// State
const input = ref("");
const loading = ref(false);
const results = ref<ResultType[]>([]);

// Watchers
watch(input, () => {
  genVarNameLocalStorage.edit(v => {
    v.genVarNameInput = input.value;
  });
});

// Methods
const handleClick = async () => {
  if (loading.value || !input.value.trim()) return;
  results.value = [];
  loading.value = true;
  try {
    const res = await sendMessage<string>({
      type: MessageType.BaiduTranslate,
      value: input.value
    });

    if (res) {
      const validName = toValidVariableName(res);
      results.value = [
        {
          camelCase: kebabToCamelCase(validName),
          pascalCase: kebabToCamelCase(validName, true),
          kebabCase: camelToKebabCase(validName)
        }
      ];
    }
  } catch (err) {
    console.error("Translation error:", err);
    ElMessage({
      type: "error",
      message: String(err)
    });
  } finally {
    loading.value = false;
  }
};

const handleCodeItem = async (item: string) => {
  try {
    await navigator.clipboard.writeText(item);
    ElMessage({
      message: "复制成功",
      type: "success"
    });
  } catch (err) {
    console.error("Copy error:", err);
    ElMessage({
      message: "复制失败",
      type: "error"
    });
  }
};

// Lifecycle
onMounted(async () => {
  const { genVarNameInput = "" } = (await genVarNameLocalStorage.get()) || {};
  input.value = genVarNameInput;
});
</script>

<style lang="scss" scoped>
.gen-var-name {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .results-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .result-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .try-result {
    padding: 12px;
    border-radius: 6px;
    background: #f7f7f7;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background: #e8e8e8;
    }
  }
}
</style>
