<template>
  <div class="controller">
    <div class="type">
      {{
        {
          img: "图片",
          icon: "切图",
          text: "文本",
          div: "盒子"
        }[type]
      }}-{{ identification }}
    </div>
    <ElRadioGroup v-model="objectType" size="small">
      <ElRadioButton v-for="item in objectTypeList" :key="item.value" :label="item.label" :value="item.value" />
    </ElRadioGroup>
    <span>className</span>
    <div class="translate-input">
      <ElInput v-model="translateInput" size="small" type="text" @keyup.enter="handleTranslate">
        <template #append>
          <ElButton size="small" @click="handleTranslate" :loading="translateLoading">generate</ElButton>
        </template>
      </ElInput>
    </div>
    <ElInput v-model="nameInput" size="small" type="text">
      <template #prepend> <ElButton size="small">className</ElButton> </template>
    </ElInput>
    <template v-if="htmls && htmls.length > 0">
      <span>
        html
        <ElCheckbox v-if="type === 'text'" v-model="textVar" label="变量" size="large" />
      </span>
      <div v-for="(item, index) in htmls" :key="index" class="code-item" @click="handleCodeItem(item)">
        <code>{{ item }}</code>
      </div>
    </template>
    <template v-if="jss && jss.length > 0">
      <span>js</span>
      <ElInput v-if="type === 'icon'" size="small" v-model="iconUrlInput" type="text">
        <template #prepend> <span>iconUrl</span> </template>
      </ElInput>
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
import { parseCssRules, type cssPropType, type CssRulesType } from "./parseCssRules";
import { computed, onMounted, ref, watch } from "vue";
import { storageLocal } from "@yayaluoya-extensions/common/src/local";
import { md5 } from "@yayaluoya-extensions/common/src/md5";
import { sendMessage } from "@yayaluoya-extensions/common/src/message";
import { MessageType } from "@yayaluoya-extensions/common/src/constant/messageType";
import { ElButton, ElInput, ElCheckbox, ElRadioGroup, ElRadioButton, ElMessage } from "element-plus";
import { handleVarName1, handleVarName2, strToVarName } from "@yayaluoya-extensions/common/src/utils/global";
import { getAllSectionNodeBox } from "../../getAllSectionNodeBox";

type ItemType = "img" | "icon" | "text" | "div";
type ObjectType = "app" | "mp" | "pc";

const identification = ref("");
const type = ref<ItemType>("div");
const textContent = ref("");
const cssCode = ref("");

const cssRules = computed<CssRulesType[]>(() => {
  switch (type.value) {
    case "text":
      return parseCssRules(
        cssCode.value,
        ["color", "text-align", "font-family", "font-size", "font-style", "font-weight", "line-height", "letter-spacing"],
        [
          {
            name: "font-style",
            value: "normal"
          }
        ]
      );
    case "icon":
      return parseCssRules(cssCode.value, ["width", "height"]);
    case "img":
      return parseCssRules(
        cssCode.value,
        ["width", "height", "box-shadow", "border-radius"],
        [],
        [
          {
            name: "overflow",
            value: "hidden"
          }
        ]
      );
    case "div":
      return parseCssRules(cssCode.value, [
        "width",
        "height",
        "display",
        /^flex-/,
        "align-items",
        "justify-content",
        "overflow",
        "box-sizing",
        /^background-?/,
        "box-shadow",
        /^border-?/,
        /^padding-?/,
        ...(objectType.value === "pc" || objectType.value === "mp" ? ["gap"] : [])
      ]);
  }
});

const translateInputLocal = storageLocal(() => {
  return md5(`translate-input-${identification.value}`).toString();
});
const classNameLocal = storageLocal(() => {
  return md5(`class-name-${identification.value}`).toString();
});
const textVarLocal = storageLocal<string, "true">(() => {
  return md5(`text-var-${identification.value}`).toString();
});
const objectTypeLocal = storageLocal<string, ObjectType>("object-type");

const translateInput = ref("");
const nameInput = ref("");
const translateLoading = ref(false);
const iconUrlInput = ref("");
const textVar = ref(false);
const objectType = ref<ObjectType>("pc");
const objectTypeList = ref<
  {
    value: ObjectType;
    label: string;
  }[]
>([
  { value: "pc", label: "pc" },
  { value: "mp", label: "mp" },
  { value: "app", label: "app" }
]);

watch([nameInput, translateInput, textVar, objectType], () => {
  classNameLocal.set(nameInput.value);
  translateInputLocal.set(translateInput.value);
  textVarLocal.set(textVar.value ? "true" : undefined);
  objectTypeLocal.set(objectType.value);
});

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
        nameInput.value = strToVarName(res);
      }
    })
    .catch(err => {
      console.log(err);
      ElMessage({
        message: err,
        type: "error"
      });
    })
    .finally(() => {
      translateLoading.value = false;
    });
};

const htmls = computed(() => {
  switch (type.value) {
    case "text": {
      if (objectType.value === "pc") {
        return cssRules.value.map((item, i) => {
          return `<span class="${handleVarName2(`${nameInput.value}-text${i == 0 ? "" : `-${i}`}`)}">${
            textVar.value ? `{{ "${item.query || ""}" }}` : item.query || ""
          }</span>`;
        });
      }
      return cssRules.value.map((item, i) => {
        return `<text class="${handleVarName2(`${nameInput.value}-text${i == 0 ? "" : `-${i}`}`)}">${
          textVar.value ? `{{ "${item.query || ""}" }}` : item.query || ""
        }</text>`;
      });
    }
    case "img": {
      const getSize = (name: string) => {
        return (
          cssRules.value
            .reduce<cssPropType[]>((a, b) => {
              a.push(...b.props);
              return a;
            }, [])
            .find(item => item.name === name)?.value || "500"
        );
      };
      if (objectType.value === "pc") {
        return [
          `<img src="https://picsum.photos/${parseInt(getSize("width"))}/${parseInt(getSize("height"))}" class="${handleVarName2(
            `${nameInput.value}-img`
          )}" />`
        ];
      }
      return [
        `<image src="https://picsum.photos/${parseInt(getSize("width"))}/${parseInt(getSize("height"))}" class="${handleVarName2(
          `${nameInput.value}-img`
        )}" mode="aspectFit" />`
      ];
    }
    case "icon": {
      if (objectType.value === "pc") {
        return [
          `<img :src="${handleVarName1(`${nameInput.value}-icon`, true)}" class="${handleVarName2(`${nameInput.value}-icon`)}" />`
        ];
      }
      return [
        `<image :src="${handleVarName1(`${nameInput.value}-icon`, true)}" class="${handleVarName2(
          `${nameInput.value}-icon`
        )}" mode="scaleToFill" />`
      ];
    }
    case "div": {
      if (objectType.value === "pc") {
        return [`<div class="${handleVarName2(nameInput.value)}"></div>`];
      }
      return [`<view class="${handleVarName2(nameInput.value)}"></view>`];
    }
  }
});

const jss = computed(() => {
  switch (type.value) {
    case "icon": {
      return [`const ${handleVarName1(`${nameInput.value}-icon`, true)} = "${iconUrlInput.value}";`];
    }
  }
});

const csss = computed(() => {
  const getCssProps = (item: CssRulesType) => {
    return "\n" + item.props.map(prop => `  ${prop.name}: ${prop.value};`).join("\n") + "\n";
  };
  switch (type.value) {
    case "text": {
      return cssRules.value.map((item, i) => {
        return `.${handleVarName2(`${nameInput.value}-text${i == 0 ? "" : `-${i}`}`)}{${getCssProps(item)}}`.trim();
      });
    }
    case "img": {
      return cssRules.value.map(item => {
        return `.${handleVarName2(`${nameInput.value}-img`)}{${getCssProps(item)}}`.trim();
      });
    }
    case "icon": {
      return cssRules.value.map(item => {
        return `.${handleVarName2(`${nameInput.value}-icon`)}{${getCssProps(item)}}`.trim();
      });
    }
    case "div": {
      return cssRules.value.map(item => {
        return `.${handleVarName2(nameInput.value)}{${getCssProps(item)}}`.trim();
      });
    }
  }
});

const handleCodeItem = (item: string) => {
  navigator.clipboard.writeText(item).then(() => {
    ElMessage({
      message: "复制成功",
      type: "success"
    });
  });
};

onMounted(() => {
  try {
    const screenInspectorEl = document.querySelector<HTMLDivElement>(".screen-inspector.inspector.expanded");
    if (screenInspectorEl) {
      const sectionNodeBoxs = getAllSectionNodeBox(screenInspectorEl);
      const codeSectionNode = sectionNodeBoxs.find(item => item.title === "代码");
      if (codeSectionNode) {
        cssCode.value = codeSectionNode.contentEl.querySelectorAll(".css-node__code--item")[0]?.textContent || "";
        const topTitle = sectionNodeBoxs[0].title;
        // 文本
        if (sectionNodeBoxs.some(item => item.title === "文本")) {
          type.value = "text";
          textContent.value =
            sectionNodeBoxs
              .find(item => item.title === "内容")
              ?.contentEl.querySelector<HTMLImageElement>(".textarea__node.node-item__input span")?.textContent || "";
          identification.value = md5(textContent.value + cssCode.value).toString();
        }
        // 切图
        else if (sectionNodeBoxs.some(item => item.title === "切图")) {
          type.value = "icon";
          identification.value = md5(
            (sectionNodeBoxs.find(item => item.title === "切图")?.contentEl.querySelector<HTMLImageElement>(".thumb img")?.src ||
              "") + cssCode.value
          ).toString();
        }
        // 图片
        else if (
          sectionNodeBoxs.some(
            item =>
              item.title === "填充" &&
              [...item.contentEl.querySelectorAll("span.node-item__text")].some(item2 => item2.textContent?.trim() === "图片填充")
          )
        ) {
          type.value = "img";
          identification.value = md5(topTitle + cssCode.value).toString();
        }
        // 盒子
        else {
          type.value = "div";
          identification.value = md5(topTitle + cssCode.value).toString();
        }
      }
    }
  } catch (e) {
    console.log("出错了", e);
  }

  classNameLocal.get().then(value => {
    nameInput.value = value || "item";
  });
  translateInputLocal.get().then(value => {
    translateInput.value = value || textContent.value;
  });
  textVarLocal.get().then(value => {
    textVar.value = !!value;
  });
  objectTypeLocal.get().then(value => {
    objectType.value = value || "pc";
  });
});
</script>

<style lang="scss" scoped>
.controller {
  display: flex;
  flex-direction: column;
  gap: 5px;

  .type {
    background-color: #252a34;
    color: white;
    text-align: center;
    padding: 5px 0;
    border-radius: 5px;
    font-weight: bold;
  }

  .code-item {
    padding: 5px 12px;
    border-radius: 4px;
    cursor: text;
    background: rgba(0, 0, 0, 0.04);
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
