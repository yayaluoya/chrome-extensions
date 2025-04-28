<template>
  <div class="controller">
    <ElForm :model="{}" :rules="{}" label-width="auto" :show-message="false">
      <ElFormItem label-position="left" label="项目类型">
        <ElRadioGroup v-model="objectType" size="small">
          <ElRadioButton v-for="item in objectTypeList" :key="item.value" :label="item.label" :value="item.value" />
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label-position="left" label="元素类型">
        {{
          {
            img: "图片",
            icon: "切图",
            text: "文本",
            div: "盒子"
          }[type]
        }}
      </ElFormItem>
      <!-- <ElFormItem label-position="top" label="元素ID">
        {{ identification }}
      </ElFormItem> -->
      <ElFormItem label-position="top" label="className">
        <div class="form-item-content">
          <ElInput v-model="translateInput" size="small" type="text" @keyup.enter="handleTranslate">
            <template #append>
              <ElButton size="small" @click="handleTranslate" :loading="translateLoading">generate</ElButton>
            </template>
          </ElInput>
          <ElInput v-model="nameInput" size="small" type="text">
            <template #prepend> <ElButton size="small">className</ElButton> </template>
          </ElInput>
        </div>
      </ElFormItem>
      <ElFormItem label-position="top" label="vue-template" v-if="vueTemplates.length > 0">
        <div class="form-item-content">
          <Code v-for="(item, index) in vueTemplates" :key="index" :code="item" type="vue" />
        </div>
      </ElFormItem>
      <ElFormItem label-position="top" label="js" v-if="jss.length > 0">
        <div class="form-item-content">
          <ElInput v-if="type === 'icon'" size="small" v-model="iconUrlInput" type="text">
            <template #prepend> <span>iconUrl</span> </template>
          </ElInput>
          <Code v-for="(item, index) in jss" :key="index" :code="item" type="js" />
        </div>
      </ElFormItem>
      <ElFormItem label-position="top" label="css" v-if="csss.length > 0">
        <div class="form-item-content">
          <Code v-for="(item, index) in csss" :key="index" :code="item" type="css" />
        </div>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script setup lang="ts">
import { parseCssRules, type cssPropType, type CssRulesType } from "./parseCssRules";
import { computed, onMounted, ref, watch } from "vue";
import { storageLocal } from "@taozi-chrome-extensions/common/src/local";
import { md5 } from "@taozi-chrome-extensions/common/src/md5";
import { sendMessage } from "@taozi-chrome-extensions/common/src/message";
import { MessageType } from "@taozi-chrome-extensions/common/src/constant/messageType";
import { ElForm, ElFormItem, ElButton, ElInput, ElRadioGroup, ElRadioButton, ElMessage } from "element-plus";
import { handleVarName1, handleVarName2, strToVarName } from "@taozi-chrome-extensions/common/src/utils/global";
import { getAllSectionNodeBox } from "../../getAllSectionNodeBox";
import Code from "../../../components/Code/index.vue";

type ItemType = "img" | "icon" | "text" | "div";
type ObjectType = "app" | "mp" | "pc";

const identification = ref("");
const type = ref<ItemType>("div");
const textContent = ref("");
const cssCode = ref("");

const cssRules = computed<CssRulesType[]>(() => {
  switch (type.value) {
    case "text":
      return parseCssRules({
        cssCode: cssCode.value,
        includePropsName: [
          "color",
          "text-align",
          "font-family",
          "font-size",
          "font-style",
          "font-weight",
          "line-height",
          "letter-spacing"
        ],
        excludeProps: [
          {
            name: "font-style",
            value: "normal"
          }
        ]
      });
    case "icon":
      return parseCssRules({
        cssCode: cssCode.value,
        includePropsName: ["width", "height"]
      });
    case "img":
      return parseCssRules({
        cssCode: cssCode.value,
        includePropsName: ["width", "height", "box-shadow", "border-radius"],
        excludeProps: [],
        supplementProps: [
          {
            name: "overflow",
            value: "hidden"
          }
        ]
      });
    case "div":
      return parseCssRules({
        cssCode: cssCode.value,
        includePropsName: [
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
        ]
      });
  }
});

const objectTypeLocal = storageLocal<string, ObjectType>("object-type");
const translateInputLocal = storageLocal(() => {
  return md5(`translate-input-${identification.value}`).toString();
});
const classNameLocal = storageLocal(() => {
  return md5(`class-name-${identification.value}`).toString();
});

const translateInput = ref("");
const nameInput = ref("");
const translateLoading = ref(false);
const iconUrlInput = ref("");
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

watch([nameInput, translateInput, objectType], () => {
  classNameLocal.set(nameInput.value);
  translateInputLocal.set(translateInput.value);
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

const vueTemplates = computed(() => {
  switch (type.value) {
    case "text": {
      if (objectType.value === "pc") {
        return cssRules.value
          .map((item, i) => {
            return [
              `<span class="${handleVarName2(`${nameInput.value}-text${i == 0 ? "" : `-${i}`}`)}">${item.query || ""}</span>`,
              `<span class="${handleVarName2(`${nameInput.value}-text${i == 0 ? "" : `-${i}`}`)}"> {{" ${
                item.query || ""
              }" }} </span>`
            ];
          })
          .flat();
      }
      return cssRules.value
        .map((item, i) => {
          return [
            `<text class="${handleVarName2(`${nameInput.value}-text${i == 0 ? "" : `-${i}`}`)}">${item.query || ""}</text>`,
            `<text class="${handleVarName2(`${nameInput.value}-text${i == 0 ? "" : `-${i}`}`)}"> {{" ${
              item.query || ""
            } "}} </text>`
          ];
        })
        .flat();
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
  return [];
});

const csss = computed(() => {
  const getCssProps = (item: CssRulesType) => {
    return "\n" + item.props.map(prop => `  ${prop.name}: ${prop.value};`).join("\n") + "\n";
  };
  switch (type.value) {
    case "text": {
      return cssRules.value.map((item, i) => {
        return `.${handleVarName2(`${nameInput.value}-text${i == 0 ? "" : `-${i}`}`)} {${getCssProps(item)}}`.trim();
      });
    }
    case "img": {
      return cssRules.value.map(item => {
        return `.${handleVarName2(`${nameInput.value}-img`)} {${getCssProps(item)}}`.trim();
      });
    }
    case "icon": {
      return cssRules.value.map(item => {
        return `.${handleVarName2(`${nameInput.value}-icon`)} {${getCssProps(item)}}`.trim();
      });
    }
    case "div": {
      return cssRules.value.map(item => {
        return `.${handleVarName2(nameInput.value)} {${getCssProps(item)}}`.trim();
      });
    }
  }
});

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
  objectTypeLocal.get().then(value => {
    objectType.value = value || "pc";
  });
});
</script>

<style lang="scss" scoped>
.controller {
  width: 100%;
  display: flex;
  flex-direction: column;

  ::v-deep(.el-form-item) {
    margin-bottom: 6px;
  }

  .form-item-content {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
  }
}
</style>
