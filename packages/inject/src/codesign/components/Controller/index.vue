<template>
  <div class="controller">
    <ElForm :model="{}" :rules="{}" label-width="auto" :show-message="false" label-suffix=":">
      <ElFormItem label-position="left" label="项目类型">
        <ElRadioGroup v-model="objectTypeInput" size="small">
          <ElRadioButton v-for="item in OBJECT_TYPE_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label-position="left" label="元素类型">
        <ElTag class="type-item" effect="dark" round>
          <ElIcon :size="12" v-if="elType === ElType.Div">
            <Box />
          </ElIcon>
          <ElIcon :size="12" v-if="elType === ElType.Img">
            <Picture />
          </ElIcon>
          <ElIcon :size="12" v-if="elType === ElType.Icon">
            <PictureRounded />
          </ElIcon>
          <ElIcon :size="12" v-if="elType === ElType.Text">
            <Document />
          </ElIcon>
          {{ ElTypeDesc[elType] }}
        </ElTag>
      </ElFormItem>
      <ElFormItem label-position="left" label="代码注释">
        <ElInput v-model="annotationInput" type="text" clearable />
      </ElFormItem>
      <ElFormItem label-position="top" label="元素类名">
        <div class="form-item-content">
          <ElInput v-model="translateInput" type="text" clearable @keyup.enter="handleTranslate">
            <template #append>
              <ElButton @click="handleTranslate" :loading="translateLoading">快速生成</ElButton>
            </template>
          </ElInput>
          <ElInput v-model="classNameInput" type="text" clearable>
            <template #prepend> <ElButton>类名</ElButton> </template>
          </ElInput>
        </div>
      </ElFormItem>
      <ElFormItem label-position="top" label="vue-template" v-if="vueTemplateList.length > 0">
        <div class="form-item-content">
          <Code v-for="(item, index) in vueTemplateList" :key="index" :code="getAnnotation('template') + item" type="vue" />
        </div>
      </ElFormItem>
      <ElFormItem label-position="top" label="js" v-if="jsList.length > 0">
        <div class="form-item-content">
          <ElInput v-if="elType === ElType.Icon" v-model="iconUrlInput" type="text">
            <template #prepend> <span>iconUrl</span> </template>
          </ElInput>
          <Code v-for="(item, index) in jsList" :key="index" :code="getAnnotation('js') + item" type="js" />
        </div>
      </ElFormItem>
      <ElFormItem label-position="top" label="css" v-if="cssList.length > 0">
        <div class="form-item-content">
          <Code v-for="(item, index) in cssList" :key="index" :code="getAnnotation('css') + item" type="css" />
        </div>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { md5 } from "@taozi-chrome-extensions/common/src/utils/md5";
import { sendMessage } from "@taozi-chrome-extensions/common/src/messageServer";
import { MessageType } from "@taozi-chrome-extensions/common/src/constant/messageType";
import { ElForm, ElFormItem, ElButton, ElInput, ElRadioGroup, ElRadioButton, ElMessage, ElIcon, ElTag } from "element-plus";
import { Box, Picture, PictureRounded, Document } from "@element-plus/icons-vue";
import { kebabToCamelCase, camelToKebabCase, toValidVariableName } from "@taozi-chrome-extensions/common/src/utils/global";
import { getAllSectionNodeBox } from "../../getAllSectionNodeBox";
import Code from "../../../components/Code/index.vue";
import { codesignLocalStorage, type CodesignLocalStorage } from "@taozi-chrome-extensions/common/src/local/codesign";
import { getCssPropConfig, ElType, ObjectType, OBJECT_TYPE_OPTIONS, ElTypeDesc } from "./index";
import { parseCssRules, type CssProp, type CssRule } from "./parseCssRules";

// State
const identification = ref("");
const elType = ref<ElType>(ElType.Div);
const textContent = ref("");
const cssCode = ref("");
const translateInput = ref("");
const classNameInput = ref("");
const translateLoading = ref(false);
const iconUrlInput = ref("");
const objectTypeInput = ref<ObjectType>(ObjectType.PC);
const annotationInput = ref("");

const config = ref<CodesignLocalStorage["config"]>({
  ignoreCssFontFamily: false
});

watch([classNameInput, translateInput, objectTypeInput, iconUrlInput, annotationInput], () => {
  codesignLocalStorage.edit(v => {
    v.objectType = objectTypeInput.value;
    v.classNames[identification.value] = classNameInput.value;
    v.translateInputs[identification.value] = translateInput.value;
    v.iconUrls[identification.value] = iconUrlInput.value;
    v.annotations[identification.value] = annotationInput.value;
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

const getCssRules = () => {
  const cssPropConfig = getCssPropConfig(objectTypeInput.value, {
    ignoreCssFontFamily: config.value.ignoreCssFontFamily
  });
  return parseCssRules({
    cssCode: cssCode.value,
    includePropNames: cssPropConfig.includePropNames[elType.value],
    excludeProps: cssPropConfig.excludeProps[elType.value],
    supplementProps: cssPropConfig.supplementProps[elType.value]
  });
};

const getClassName = (type: ElType, index: number = 0) => {
  switch (type) {
    case ElType.Text: {
      return camelToKebabCase(toValidVariableName(`${classNameInput.value}-text${index == 0 ? "" : `-${index}`}`));
    }
    case ElType.Img: {
      return camelToKebabCase(toValidVariableName(`${classNameInput.value}-img${index == 0 ? "" : `-${index}`}`));
    }
    case ElType.Icon: {
      return camelToKebabCase(toValidVariableName(`${classNameInput.value}-icon${index == 0 ? "" : `-${index}`}`));
    }
    case ElType.Div: {
      return camelToKebabCase(toValidVariableName(`${classNameInput.value}${index == 0 ? "" : `-${index}`}`));
    }
  }
};

const getAnnotation = (type: "template" | "js" | "css") => {
  if (!annotationInput.value) return "";
  switch (type) {
    case "template": {
      return `<!-- ${annotationInput.value} -->\n`;
    }
    case "js": {
      return `/** ${annotationInput.value} */\n`;
    }
    case "css": {
      return `// ${annotationInput.value}\n`;
    }
    default: {
      return "";
    }
  }
};

const vueTemplateList = computed(() => {
  switch (elType.value) {
    /** 文本 */
    case ElType.Text: {
      return getCssRules()
        .map((item, i) => {
          const className = getClassName(ElType.Text, i);
          const text = (item.query || "").trim();
          if (objectTypeInput.value === ObjectType.PC) {
            return [`<span class="${className}">${text}</span>`, `<span class="${className}"> {{ "${text}" }} </span>`];
          }
          return [`<text class="${className}">${text}</text>`, `<text class="${className}"> {{ "${text}" }} </text>`];
        })
        .flat();
    }
    /** 图片 */
    case ElType.Img: {
      const getSize = (name: string) => {
        return (
          getCssRules()
            .reduce<CssProp[]>((a, b) => {
              a.push(...b.props);
              return a;
            }, [])
            .find(item => item.name === name)?.value || "500"
        );
      };
      const className = getClassName(ElType.Img);
      const imageSrc = `https://picsum.photos/${parseInt(getSize("width"))}/${parseInt(getSize("height"))}`;
      if (objectTypeInput.value === ObjectType.PC) {
        return ["img", "CustomImage"].map(elType => `<${elType} src="${imageSrc}" class="${className}" />`);
      }
      return ["img", "CustomImage"].map(elType => `<${elType} src="${imageSrc}" class="${className}" mode="aspectFit" />`);
    }
    /** 切图 */
    case ElType.Icon: {
      const className = getClassName(ElType.Icon);
      const srcVarName = kebabToCamelCase(className, true);
      if (objectTypeInput.value === ObjectType.PC) {
        return [`<img :src="${srcVarName}" class="${className}" />`];
      }
      return [`<image :src="${srcVarName}" class="${className}" mode="scaleToFill" />`];
    }
    /** 盒子 */
    case ElType.Div: {
      const className = getClassName(ElType.Div);
      if (objectTypeInput.value === ObjectType.PC) {
        return [`<div class="${className}"></div>`];
      }
      return [`<view class="${className}"></view>`];
    }
  }
});

const jsList = computed(() => {
  switch (elType.value) {
    case ElType.Icon: {
      return [`const ${kebabToCamelCase(getClassName(ElType.Icon), true)} = \`${iconUrlInput.value}\`;`];
    }
  }
  return [];
});

const cssList = computed(() => {
  const getCssProps = (item: CssRule) => {
    return "\n" + item.props.map(prop => `  ${prop.name}: ${prop.value};`).join("\n") + "\n";
  };
  switch (elType.value) {
    case ElType.Text: {
      return getCssRules().map((item, i) => {
        return `.${getClassName(ElType.Text, i)} {${getCssProps(item)}}`.trim();
      });
    }
    case ElType.Img: {
      return getCssRules().map(item => {
        return `.${getClassName(ElType.Img)} {${getCssProps(item)}}`.trim();
      });
    }
    case ElType.Icon: {
      return getCssRules().map(item => {
        return `.${getClassName(ElType.Icon)} {${getCssProps(item)}}`.trim();
      });
    }
    case ElType.Div: {
      return getCssRules().map(item => {
        return `.${getClassName(ElType.Div)} {${getCssProps(item)}}`.trim();
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
      elType.value = ElType.Text;
      textContent.value =
        sectionNodeBoxs
          .find(item => item.title === "内容")
          ?.contentEl.querySelector<HTMLImageElement>(".textarea__node.node-item__input span")?.textContent || "";
    } else if (sectionNodeBoxs.some(item => item.title === "切图")) {
      elType.value = ElType.Icon;
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
      elType.value = ElType.Img;
    } else {
      elType.value = ElType.Div;
    }

    if (elType.value === ElType.Text) {
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
      annotations = {},
      config: config2 = {}
    } = (await codesignLocalStorage.get()) || {};
    classNameInput.value = classNames[identification.value] || "item";
    translateInput.value = translateInputs[identification.value] || textContent.value;
    objectTypeInput.value = (objectType as ObjectType) || "pc";
    iconUrlInput.value = iconUrls[identification.value] || "";
    annotationInput.value = annotations[identification.value] || "";
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
