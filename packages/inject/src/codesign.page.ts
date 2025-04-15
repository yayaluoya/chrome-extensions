import { createApp, h } from "vue";
import { getCssRules, type CssRulesType } from "./getCssRules";
import Code from "./components/code.vue";

export function codesignStart() {
  document.addEventListener(
    "click",
    e => {
      if (e.target instanceof Node && document.querySelector(".screen-inspector.inspector.expanded")?.contains(e.target)) {
        return;
      }
      setTimeout(() => {
        trigger();
      }, 0);
    },
    {
      capture: true
    }
  );
}

function trigger() {
  const screenInspectorEl = document.querySelector<HTMLDivElement>(".screen-inspector.inspector.expanded");
  if (!screenInspectorEl) {
    return;
  }
  const sectionNodeBoxs = getAllSectionNodeBox(screenInspectorEl);
  const codeSectionNode = sectionNodeBoxs.find(item => item.title === "代码");
  if (!codeSectionNode) {
    return;
  }

  let renderType: "img" | "icon" | "text" | "div";
  let renderTagContent = "";
  let cssRules: CssRulesType[] = [];
  // 文本
  if (sectionNodeBoxs.some(item => item.title === "文本")) {
    renderType = "text";
    cssRules = getCssRules(
      codeSectionNode.contentEl,
      ["color", "text-align", "font-family", "font-size", "font-style", "font-weight", "line-height", "letter-spacing"],
      [
        {
          name: "font-style",
          value: "normal"
        }
      ]
    );
    renderTagContent = cssRules.map(item => item.query).join("");
  }
  // 图片
  else if (sectionNodeBoxs.some(item => /^image/.test(item.title))) {
    renderType = "img";
    cssRules = getCssRules(codeSectionNode.contentEl, ["width", "height", "box-shadow", "border-radius"]);
  }
  // 切图
  else if (sectionNodeBoxs.some(item => item.title === "切图")) {
    renderType = "icon";
    cssRules = getCssRules(codeSectionNode.contentEl, ["width", "height"]);
  }
  // 盒子
  else {
    renderType = "div";
    cssRules = getCssRules(codeSectionNode.contentEl, [
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
      /^padding-?/
    ]);
  }

  const customElClass = "custom-el-class";
  codeSectionNode.contentEl.querySelector(`.${customElClass}`)?.remove();
  const el = document.createElement("div");
  el.className = customElClass;
  codeSectionNode.contentEl.insertBefore(el, codeSectionNode.contentEl.firstChild);
  const shadowRoot = el.attachShadow({ mode: "open" });
  const mountEl = document.createElement("div");
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = chrome.runtime.getURL("inject/index.css");
  shadowRoot.appendChild(link);
  shadowRoot.appendChild(mountEl);
  createApp({
    render() {
      return h(Code, {
        identification: renderType == "text" ? renderTagContent : sectionNodeBoxs[0].title,
        type: renderType,
        content: renderTagContent,
        cssRules
      });
    }
  }).mount(mountEl);
}

function getAllSectionNodeBox(screenInspectorEl: Element) {
  let list: { sectionNodeEl: HTMLDivElement; title: string; contentEl: HTMLDivElement }[] = [];
  screenInspectorEl.querySelectorAll<HTMLDivElement>("section.node-box").forEach(sectionNodeEl => {
    const title = (sectionNodeEl.querySelector(".node-box__header .node-box__header--title")?.textContent || "").trim();
    const contentEl = sectionNodeEl.querySelector<HTMLDivElement>(".node-box__content")!;
    list.push({
      sectionNodeEl,
      title,
      contentEl
    });
  });
  return list;
}
