<template>
  <div class="controller">
    <ElForm :model="{}" :rules="{}" label-width="auto" :show-message="false">
      <ElFormItem label-position="left" label="项目类型">
        <ElRadioGroup v-model="objectTypeInput" size="small">
          <ElRadioButton v-for="item in OBJECT_TYPE_LIST" :key="item.value" :label="item.label" :value="item.value" />
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label-position="left" label="元素类型">
        <div class="type-item">
          <ElIcon :size="12" v-if="type === 'div'">
            <Box />
          </ElIcon>
          <ElIcon :size="12" v-if="type === 'img'">
            <Picture />
          </ElIcon>
          <ElIcon :size="12" v-if="type === 'icon'">
            <PictureRounded />
          </ElIcon>
          <ElIcon :size="12" v-if="type === 'text'">
            <Document />
          </ElIcon>
          {{ ITEM_TYPE_MAP[type] }}
        </div>
      </ElFormItem>
      <!-- <ElFormItem label-position="top" label="元素ID">
        {{ identification }}
      </ElFormItem> -->
      <ElFormItem label-position="top" label="className">
        <div class="form-item-content">
          <ElInput v-model="translateInput" size="small" type="text" @keyup.enter="handleTranslate">
            <template #append>
              <ElButton size="small" @click="handleTranslate" :loading="translateLoading">生成类名</ElButton>
            </template>
          </ElInput>
          <ElInput v-model="classNameInput" size="small" type="text">
            <template #prepend> <ElButton size="small">className</ElButton> </template>
          </ElInput>
        </div>
      </ElFormItem>
      <ElFormItem label-position="top" label="vue-template" v-if="vueTemplateList.length > 0">
        <div class="form-item-content">
          <Code v-for="(item, index) in vueTemplateList" :key="index" :code="item" type="vue" />
        </div>
      </ElFormItem>
      <ElFormItem label-position="top" label="js" v-if="jsList.length > 0">
        <div class="form-item-content">
          <ElInput v-if="type === 'icon'" size="small" v-model="iconUrlInput" type="text">
            <template #prepend> <span>iconUrl</span> </template>
          </ElInput>
          <Code v-for="(item, index) in jsList" :key="index" :code="item" type="js" />
        </div>
      </ElFormItem>
      <ElFormItem label-position="top" label="css" v-if="cssList.length > 0">
        <div class="form-item-content">
          <Code v-for="(item, index) in cssList" :key="index" :code="item" type="css" />
        </div>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script setup lang="ts">
import { parseCssRules, type cssPropType, type CssRulesType } from "./parseCssRules";
import { computed, onMounted, ref, watch } from "vue";
import { md5 } from "@taozi-chrome-extensions/common/src/utils/md5";
import { sendMessage } from "@taozi-chrome-extensions/common/src/messageServer";
import { MessageType } from "@taozi-chrome-extensions/common/src/constant/messageType";
import { ElForm, ElFormItem, ElButton, ElInput, ElRadioGroup, ElRadioButton, ElMessage, ElIcon } from "element-plus";
import { Box, Picture, PictureRounded, Document } from "@element-plus/icons-vue";
import { kebabToCamelCase, camelToKebabCase, toValidVariableName } from "@taozi-chrome-extensions/common/src/utils/global";
import { getAllSectionNodeBox } from "../../getAllSectionNodeBox";
import Code from "../../../components/Code/index.vue";
import { codesignLocalStorage, type CodesignLocalStorage } from "@taozi-chrome-extensions/common/src/local/codesign";
import { ITEM_TYPE_MAP, OBJECT_TYPE_LIST, CSS_PROP_INCLUDES } from "./constants";

// Types
type ItemType = keyof typeof ITEM_TYPE_MAP;
type ObjectType = (typeof OBJECT_TYPE_LIST)[number]["value"];

// State
const identification = ref("");
const type = ref<ItemType>("div");
const textContent = ref("");
const cssCode = ref("");
const translateInput = ref("");
const classNameInput = ref("");
const translateLoading = ref(false);
const iconUrlInput = ref("");
const objectTypeInput = ref<ObjectType>("pc");

const config = ref<CodesignLocalStorage["config"]>({
  removeCssFontFamily: false
});

// Computed
const cssRules = computed<CssRulesType[]>(() => {
  const baseProps = CSS_PROP_INCLUDES[type.value];
  let props = objectTypeInput.value === "pc" || objectTypeInput.value === "mp" ? [...baseProps, "gap"] : baseProps;

  // 去除css字体样式
  if (config.value.removeCssFontFamily && type.value === "text") {
    props = props.filter(item => item !== "font-family");
  }
  return parseCssRules({
    cssCode: cssCode.value,
    includePropsName: props,
    excludeProps: type.value === "text" ? [{ name: "font-style", value: "normal" }] : [],
    supplementProps: type.value === "img" ? [{ name: "overflow", value: "hidden" }] : []
  });
});

watch([classNameInput, translateInput, objectTypeInput, iconUrlInput], () => {
  codesignLocalStorage.edit(v => {
    v.objectType = objectTypeInput.value;
    v.classNames[identification.value] = classNameInput.value;
    v.translateInputs[identification.value] = translateInput.value;
    v.iconUrls[identification.value] = iconUrlInput.value;
  });
});

const handleTranslate = async () => {
  if (!translateInput.value || translateLoading.value) return;

  translateLoading.value = true;
  try {
    const res = await sendMessage<string>({
      type: MessageType.BaiduTranslate,
      value: translateInput.value
    });
    if (res) {
      classNameInput.value = toValidVariableName(res);
    }
  } catch (err) {
    console.error(err);
    ElMessage({
      message: String(err),
      type: "error"
    });
  } finally {
    translateLoading.value = false;
  }
};

const vueTemplateList = computed(() => {
  switch (type.value) {
    /** 文本 */
    case "text": {
      return cssRules.value
        .map((item, i) => {
          const className = camelToKebabCase(toValidVariableName(`${classNameInput.value}-text${i == 0 ? "" : `-${i}`}`));
          const text = (item.query || "").trim();
          if (objectTypeInput.value === "pc") {
            return [`<span class="${className}">${text}</span>`, `<span class="${className}"> {{ "${text}" }} </span>`];
          }
          return [`<text class="${className}">${text}</text>`, `<text class="${className}"> {{ "${text}" }} </text>`];
        })
        .flat();
    }
    /** 图片 */
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
      const imageSrc = `https://picsum.photos/${parseInt(getSize("width"))}/${parseInt(getSize("height"))}`;
      const className = camelToKebabCase(toValidVariableName(`${classNameInput.value}-img`));
      if (objectTypeInput.value === "pc") {
        return ["img", "CustomImage"].map(elType => `<${elType} src="${imageSrc}" class="${className}" />`);
      }
      return ["img", "CustomImage"].map(elType => `<${elType} src="${imageSrc}" class="${className}" mode="aspectFit" />`);
    }
    /** 切图 */
    case "icon": {
      const className = camelToKebabCase(toValidVariableName(`${classNameInput.value}-icon`));
      const srcVarName = kebabToCamelCase(toValidVariableName(`${classNameInput.value}-icon`), true);
      if (objectTypeInput.value === "pc") {
        return [`<img :src="${srcVarName}" class="${className}" />`];
      }
      return [`<image :src="${srcVarName}" class="${className}" mode="scaleToFill" />`];
    }
    /** 盒子 */
    case "div": {
      const className = camelToKebabCase(toValidVariableName(classNameInput.value));
      if (objectTypeInput.value === "pc") {
        return [`<div class="${className}"></div>`];
      }
      return [`<view class="${className}"></view>`];
    }
  }
});

const jsList = computed(() => {
  switch (type.value) {
    case "icon": {
      return [
        `const ${kebabToCamelCase(toValidVariableName(`${classNameInput.value}-icon`), true)} = \`${iconUrlInput.value}\`;`
      ];
    }
  }
  return [];
});

const cssList = computed(() => {
  const getCssProps = (item: CssRulesType) => {
    return "\n" + item.props.map(prop => `  ${prop.name}: ${prop.value};`).join("\n") + "\n";
  };
  switch (type.value) {
    case "text": {
      return cssRules.value.map((item, i) => {
        return `.${camelToKebabCase(toValidVariableName(`${classNameInput.value}-text${i == 0 ? "" : `-${i}`}`))} {${getCssProps(
          item
        )}}`.trim();
      });
    }
    case "img": {
      return cssRules.value.map(item => {
        return `.${camelToKebabCase(toValidVariableName(`${classNameInput.value}-img`))} {${getCssProps(item)}}`.trim();
      });
    }
    case "icon": {
      return cssRules.value.map(item => {
        return `.${camelToKebabCase(toValidVariableName(`${classNameInput.value}-icon`))} {${getCssProps(item)}}`.trim();
      });
    }
    case "div": {
      return cssRules.value.map(item => {
        return `.${camelToKebabCase(toValidVariableName(classNameInput.value))} {${getCssProps(item)}}`.trim();
      });
    }
  }
});

onMounted(async () => {
  try {
    const screenInspectorEl = document.querySelector<HTMLDivElement>(".screen-inspector.inspector.expanded");
    if (!screenInspectorEl) return;

    const sectionNodeBoxs = getAllSectionNodeBox(screenInspectorEl);
    const codeSectionNode = sectionNodeBoxs.find(item => item.title === "代码");
    if (!codeSectionNode) return;

    cssCode.value = codeSectionNode.contentEl.querySelectorAll(".css-node__code--item")[0]?.textContent || "";
    const topTitle = sectionNodeBoxs[0].title;

    // Determine element type and set identification
    if (sectionNodeBoxs.some(item => item.title === "文本")) {
      type.value = "text";
      textContent.value =
        sectionNodeBoxs
          .find(item => item.title === "内容")
          ?.contentEl.querySelector<HTMLImageElement>(".textarea__node.node-item__input span")?.textContent || "";
    } else if (sectionNodeBoxs.some(item => item.title === "切图")) {
      type.value = "icon";
      const iconSrc =
        sectionNodeBoxs.find(item => item.title === "切图")?.contentEl.querySelector<HTMLImageElement>(".thumb img")?.src || "";
      identification.value = md5(iconSrc + cssCode.value).toString();
    } else if (
      sectionNodeBoxs.some(
        item =>
          item.title === "填充" &&
          [...item.contentEl.querySelectorAll("span.node-item__text")].some(item2 => item2.textContent?.trim() === "图片填充")
      )
    ) {
      type.value = "img";
    } else {
      type.value = "div";
    }

    if (type.value === "text") {
      identification.value = md5(textContent.value + cssCode.value).toString();
    } else {
      identification.value = md5(topTitle + cssCode.value).toString();
    }

    // 缩短一下identification
    identification.value = identification.value.slice(0, 10);

    // Load saved state
    const {
      objectType = "",
      translateInputs = {},
      classNames = {},
      iconUrls = {},
      config: config2 = {}
    } = (await codesignLocalStorage.get()) || {};
    classNameInput.value = classNames[identification.value] || "item";
    translateInput.value = translateInputs[identification.value] || textContent.value;
    objectTypeInput.value = (objectType as ObjectType) || "pc";
    iconUrlInput.value = iconUrls[identification.value] || "";
    config.value = config2 || {};
  } catch (e) {
    console.error("Error in onMounted:", e);
  }
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

  .type-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .form-item-content {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
  }
}
</style>
