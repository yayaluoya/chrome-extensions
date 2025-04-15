<template>
  <div class="code">
    <span>类名</span>
    <input v-model="nameInput" />
    <template v-if="htmls && htmls.length > 0">
      <span>html</span>
      <div v-for="(item, index) in htmls" :key="index" class="code-item" @click="handleCodeItem(item)">
        <code>{{ item }}</code>
      </div>
    </template>
    <template v-if="jss && jss.length > 0">
      <span>js</span>
      <div v-for="(item, index) in jss" :key="index" class="code-item" @click="handleCodeItem(item)">
        <code>{{ item }}</code>
      </div>
    </template>
    <template v-if="csss && csss.length > 0">
      <span>css</span>
      <div v-for="(item, index) in csss" :key="index" class="code-item" @click="handleCodeItem(item)">
        <code>{{ item }}</code>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { CssRulesType, getCssRules } from "@/getCssRules";
import { computed, onMounted, ref, watch } from "vue";

/** 名字转大小写 */
const handleName1 = (name: string, capitalCase = false) => {
  if (capitalCase) {
    name = name.replace(/^./, a => a.toLocaleUpperCase());
  }
  return name.replace(/-(.)/g, (_, a) => {
    return a.toLocaleUpperCase();
  });
};

const handleName2 = (name: string) => {
  return name.replace(/([A-Z])/g, (_, a: string) => {
    return "-" + a.toLocaleLowerCase();
  });
};

const props = defineProps<{
  identification: string;
  type: "img" | "icon" | "text" | "div";
  content: string;
  cssRules: CssRulesType[];
}>();

const getCodeName = () => {
  return `code-name-${props.identification}`;
};

const nameInput = ref("");

const htmls = computed(() => {
  switch (props.type) {
    case "text": {
      return props.cssRules.map((item, i) => {
        return `<text class="${handleName2(`${nameInput.value}-text${i == 0 ? "" : `-${i}`}`)}">${item.query || ""}</text>`;
      });
    }
    case "img": {
      return [`<image class="${handleName2(`${nameInput.value}-img`)}" mode="scaleToFill" />`];
    }
    case "icon": {
      return [
        `<image :src="${handleName1(`${nameInput.value}-icon`, true)}" class="${handleName2(
          `${nameInput.value}-icon`
        )}" mode="scaleToFill" />`
      ];
    }
    case "div": {
      return [
        `<view class="${handleName2(nameInput.value)}"></view>`,
        `<button class="${handleName2(nameInput.value)}"></button>`
      ];
    }
  }
});

const jss = computed(() => {
  switch (props.type) {
    case "icon": {
      return [`const ${handleName1(`${nameInput.value}-icon`, true)} = "";`];
    }
  }
});

const csss = computed(() => {
  const getCssProps = (item: CssRulesType) => {
    return "\n" + item.props.map(prop => `  ${prop.name}: ${prop.value};`).join("\n") + "\n";
  };
  switch (props.type) {
    case "text": {
      return props.cssRules.map((item, i) => {
        return `.${handleName2(`${nameInput.value}-text${i == 0 ? "" : `-${i}`}`)}{${getCssProps(item)}}`.trim();
      });
    }
    case "img": {
      return props.cssRules.map(item => {
        return `.${handleName2(`${nameInput.value}-img`)}{${getCssProps(item)}}`.trim();
      });
    }
    case "icon": {
      return props.cssRules.map(item => {
        return `.${handleName2(`${nameInput.value}-icon`)}{${getCssProps(item)}}`.trim();
      });
    }
    case "div": {
      return props.cssRules.map(item => {
        return `.${handleName2(nameInput.value)}{${getCssProps(item)}}`.trim();
      });
    }
  }
});

const handleCodeItem = (item: string) => {
  navigator.clipboard.writeText(item);
};

watch(nameInput, () => {
  chrome.storage.local.set({ [getCodeName()]: nameInput.value });
});

onMounted(() => {
  chrome.storage.local.get(getCodeName()).then(values => {
    nameInput.value =
      values[getCodeName()] ||
      {
        text: "text",
        img: "img",
        icon: "icon",
        div: "view"
      }[props.type];
  });
});
</script>

<style lang="scss" scoped>
.code {
  display: flex;
  flex-direction: column;
  > * {
    margin-bottom: 5px;
  }
  > input,
  > .code-item {
    box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, 0.15), inset 1px 2px 0 0 #fff;
    background-color: #f4f4f6;
  }

  > input {
    width: 100%;
    border-radius: 5px;
    outline: none;
    border: 2px solid #d9d9d9;
    padding: 5px;
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 700;
  }
  > span {
    font-weight: 700;
    font-size: 14px;
  }
  > .code-item {
    padding: 5px;
    box-sizing: border-box;
    border-radius: 5px;
    &:nth-last-child(1) {
      margin-bottom: 0;
    }
    code {
      white-space: pre-wrap;
      font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
    }
  }
}
</style>
