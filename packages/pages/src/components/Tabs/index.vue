<script lang="ts" setup>
const props = defineProps<{
  list: {
    label: string;
    value: string;
    slot?: string;
  }[];
  value: string;
}>();

const emit = defineEmits<{
  (e: "update:value", n: string): void;
  (e: "change", n: string): void;
}>();

const itemClick = (value: string) => {
  if (props.value === value) {
    return;
  }
  emit("update:value", value);
  emit("change", value);
};
</script>

<template>
  <div class="tabs_" ref="tabsRef">
    <div
      v-for="item in list"
      :key="item.value"
      class="item"
      :class="{
        on: value === item.value
      }"
      @click="itemClick(item.value)"
    >
      <span class="label" v-if="!item.slot">
        {{ item.label }}
      </span>
      <slot v-if="item.slot" :name="item.slot" :item="item" :on="value === item.value"> 插槽内容 </slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tabs_ {
  --color: #999;
  --on-color: #999;
  --background-color: #f6f6f6;
  --on-background-color: #fff;
  --font-size: 16px;
  --padding: 5px 15px;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: end;
  border-bottom: 1px solid var(--border-color);
  overflow: hidden;
  > .item {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: var(--color);
    font-size: var(--font-size);
    padding: var(--padding);
    border: 1px solid var(--border-color);
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
    background-color: var(--background-color);
    backdrop-filter: blur(50px);
    margin-bottom: -1px;
    cursor: pointer;
    transition: all 0.2s;
    > .label {
      transition: all 0.2s;
    }
    &.on {
      background-color: var(--on-background-color);
      > .label {
        font-weight: bold;
        color: var(--on-color);
      }
    }
  }
  > .item:nth-last-child(1) {
    margin-left: 0;
  }
}
</style>
