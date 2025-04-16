<template>
  <div class="code">
    <div class="type">
      {{
        {
          img: "图片",
          icon: "切图",
          text: "文本",
          div: "盒子"
        }[type]
      }}
    </div>
    <span>类名</span>
    <div class="translate-input">
      <input v-model="translateInput" type="text" @keyup.enter="handleTranslate" />
      <button @click="handleTranslate">生成class</button>
    </div>
    <div class="name-input">
      <span v-if="translateLoading">...</span>
      <input v-model="nameInput" type="text" />
    </div>
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
import type { cssPropType, CssRulesType } from "@/getCssRules";
import { computed, onMounted, ref, watch } from "vue";
import { storageLocal } from "@yayaluoya-extensions/common/src/local";
import { md5 } from "@yayaluoya-extensions/common/src/md5";
import { sendMessage } from "@yayaluoya-extensions/common/src/message";
import { MessageType } from "@yayaluoya-extensions/common/src/constant/messageType";

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

const classNameLocal = storageLocal(() => {
  return md5(`code-name-${props.identification}`).toString();
});
const translateInputLocal = storageLocal(() => {
  return md5(`translate-input-${props.identification}`).toString();
});

const translateInput = ref("");
const nameInput = ref("");
const translateLoading = ref(false);

const handleTranslate = () => {
  if (!translateInput.value || translateLoading.value) {
    return;
  }
  translateInputLocal.set(translateInput.value);
  translateLoading.value = true;
  sendMessage<string>({
    type: MessageType.baiduTranslate,
    value: translateInput.value
  })
    .then(res => {
      if (res) {
        nameInput.value = res
          .replace(/-/g, "")
          .replace(/\s+([a-zA-Z])/g, (_, a) => a.toLocaleUpperCase())
          .replace(/^[A-Z]/, _ => _.toLocaleLowerCase());
      }
    })
    .catch(err => {
      console.log(err);
    })
    .finally(() => {
      translateLoading.value = false;
    });
};

const htmls = computed(() => {
  switch (props.type) {
    case "text": {
      return props.cssRules.map((item, i) => {
        return `<text class="${handleName2(`${nameInput.value}-text${i == 0 ? "" : `-${i}`}`)}">${item.query || ""}</text>`;
      });
    }
    case "img": {
      const getSize = (name: string) => {
        return (
          props.cssRules
            .reduce<cssPropType[]>((a, b) => {
              a.push(...b.props);
              return a;
            }, [])
            .find(item => item.name === name)?.value || "500"
        );
      };
      return [
        `<image src="https://picsum.photos/${parseInt(getSize("width"))}/${parseInt(getSize("height"))}" class="${handleName2(
          `${nameInput.value}-img`
        )}" mode="aspectFit" />`
      ];
    }
    case "icon": {
      return [
        `<image :src="${handleName1(`${nameInput.value}-icon`, true)}" class="${handleName2(
          `${nameInput.value}-icon`
        )}" mode="scaleToFill" />`
      ];
    }
    case "div": {
      return [`<view class="${handleName2(nameInput.value)}"></view>`];
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
  classNameLocal.set(nameInput.value);
});
watch(translateInput, () => {
  translateInputLocal.set(translateInput.value);
});

onMounted(() => {
  classNameLocal.get().then(value => {
    nameInput.value = value || "item";
  });
  translateInputLocal.get().then(value => {
    translateInput.value = value || props.content;
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

  > .type {
    background-color: #252a34;
    color: white;
    text-align: center;
    padding: 5px 0;
    border-radius: 5px;
    font-weight: bold;
  }

  > .translate-input,
  > .name-input {
    display: flex;
    flex-direction: row;
    align-items: center;
    > span {
      margin-right: 5px;
    }
    > input {
      flex: 1;
      border-radius: 5px;
      outline: none;
      padding: 5px;
      box-sizing: border-box;
      border: 2px solid #d9d9d9;
      font-size: 14px;
    }
    > button {
      margin-left: 5px;
      background: #222324;
      color: #fff;
      border: none;
      padding: 5px 10px;
      border-radius: 5px;
      cursor: pointer;
    }
  }
  > span {
    font-weight: 700;
    font-size: 14px;
  }
  > .code-item {
    padding: 5px;
    box-sizing: border-box;
    border-radius: 5px;
    box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, 0.15), inset 1px 2px 0 0 #fff;
    background-color: rgba(0, 0, 0, 0.04);
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
