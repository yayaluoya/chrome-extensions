<template>
  <div class="code">
    <span class="type" v-if="type">{{ type }}</span>
    <div class="button" @click="handleCopyCode(code)">copy</div>
    <pre>
      <code v-for="(line, index) in lineCode" :key="index" @click="handleCopyCode(line)" v-html="line"></code>
    </pre>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { computed } from "vue";
import { parseCode, type CodeType } from ".";

const props = defineProps<{
  code: string;
  type: CodeType;
}>();

const lineCode = computed(() => {
  return parseCode(props.code, props.type);
});

const handleCopyCode = (code: string) => {
  navigator.clipboard
    .writeText(code)
    .then(() => {
      ElMessage({
        message: "复制成功",
        type: "success"
      });
    })
    .catch(() => {
      ElMessage({
        message: "复制失败",
        type: "error"
      });
    });
};
</script>

<style lang="scss" scoped>
.code {
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 4px;
  cursor: text;
  padding: 5px 12px;
  box-sizing: border-box;
  width: 100%;

  &:hover {
    > .type {
      display: none !important;
    }
    > .button {
      display: flex !important;
    }
  }
  > .type,
  > .button {
    position: absolute;
    top: 6px;
    right: 6px;
    background-color: white;
    border-radius: 3px;
    box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.03);
  }
  > .type {
    line-height: 1;
    padding: 2px 3px;
  }
  > .button {
    display: none;
    line-height: 1;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 3px 5px;
  }
  > pre {
    line-height: 1.5;
    font-size: 12px;
    margin: 0;
    display: flex;
    flex-direction: column;
    > code {
      white-space: pre-wrap;
      word-break: break-all;
      font-family: Consolas;

      &:hover {
        background-color: rgba(0, 0, 0, 0.08);
      }
    }
  }
}
</style>
