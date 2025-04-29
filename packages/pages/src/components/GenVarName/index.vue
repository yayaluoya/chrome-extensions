<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ElInput, ElForm, ElFormItem, ElButton, ElMessage, ElDivider } from "element-plus";
import { sendMessage } from "@taozi-chrome-extensions/common/src/message";
import { MessageType } from "@taozi-chrome-extensions/common/src/constant/messageType";
import { handleVarName1, handleVarName2, strToVarName } from "@taozi-chrome-extensions/common/src/utils/global";
import { configLocalStorage } from "@taozi-chrome-extensions/common/src/local/config";

const input = ref("");
const loading = ref(false);
const results = ref<string[]>([]);

watch(input, () => {
  configLocalStorage.edit(v => {
    v.genVarNameInput = input.value;
  });
});

const handleClick = () => {
  if (loading.value) {
    return;
  }
  loading.value = true;
  sendMessage<string>({
    type: MessageType.baiduTranslate,
    value: input.value
  })
    .then(res => {
      if (res) {
        results.value = [
          handleVarName1(strToVarName(res), true),
          handleVarName1(strToVarName(res)),
          handleVarName2(strToVarName(res))
        ];
      }
    })
    .catch(err => {
      ElMessage({
        type: "error",
        message: err
      });
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleCodeItem = (item: string) => {
  navigator.clipboard.writeText(item).then(() => {
    ElMessage({
      message: "复制成功",
      type: "success"
    });
  });
};

onMounted(async () => {
  input.value = (await configLocalStorage.get())?.genVarNameInput || "";
});
</script>

<template>
  <div class="gen-var-name">
    <ElInput type="text" v-model="input" @keydown.enter="handleClick">
      <template #append>
        <ElButton @click="handleClick" :loading="loading">确定</ElButton>
      </template>
    </ElInput>
    <template v-if="results.length > 0">
      <span v-for="(item, index) in results" :key="index" class="try-result" @click="handleCodeItem(item)">{{ item }}</span>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.gen-var-name {
  display: flex;
  flex-direction: column;
  .try-result {
    padding: 12px;
    border-radius: 6px;
    background: #f7f7f7;
    margin-top: 6px;
  }
}
</style>
