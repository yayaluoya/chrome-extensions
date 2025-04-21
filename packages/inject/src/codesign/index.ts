import Code from "./components/code.vue";
import { createAppEl } from "../createAppEl";
import { md5 } from "@yayaluoya-extensions/common/src/md5";
import type { ItemType } from "./type";
import type { CssRulesType } from "./parseCssRules";
import { parseCssRules } from "./parseCssRules";

export function codesignInject() {
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

  const cssCode = codeSectionNode.contentEl.querySelectorAll(".css-node__code--item")[0]?.textContent || "";

  const title = sectionNodeBoxs[0].title;
  let identificationText = "";
  let type: ItemType;
  let textContent = "";
  let cssRules: CssRulesType[] = [];
  // 文本
  if (sectionNodeBoxs.some(item => item.title === "文本")) {
    type = "text";
    cssRules = parseCssRules(
      cssCode,
      ["color", "text-align", "font-family", "font-size", "font-style", "font-weight", "line-height", "letter-spacing"],
      [
        {
          name: "font-style",
          value: "normal"
        }
      ]
    );
    textContent = cssRules.map(item => item.query).join("");
    identificationText = textContent + JSON.stringify(cssRules);
  }
  // 切图
  else if (sectionNodeBoxs.some(item => item.title === "切图")) {
    type = "icon";
    cssRules = parseCssRules(cssCode, ["width", "height"]);
    identificationText =
      sectionNodeBoxs.find(item => item.title === "切图")!.contentEl.querySelector<HTMLImageElement>(".thumb img")!.src +
      JSON.stringify(cssRules);
  }
  // 图片
  else if (
    sectionNodeBoxs.some(
      item =>
        item.title === "填充" &&
        [...item.contentEl.querySelectorAll("span.node-item__text")].some(item2 => item2.textContent?.trim() === "图片填充")
    )
  ) {
    type = "img";
    cssRules = parseCssRules(
      cssCode,
      ["width", "height", "box-shadow", "border-radius"],
      [],
      [
        {
          name: "overflow",
          value: "hidden"
        }
      ]
    );
    identificationText = title + JSON.stringify(cssRules);
  }
  // 盒子
  else {
    type = "div";
    cssRules = parseCssRules(cssCode, [
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
    identificationText = title + JSON.stringify(cssRules);
  }

  const customElClass = "custom-el-class";
  codeSectionNode.contentEl.querySelector(`.${customElClass}`)?.remove();
  const el = createAppEl(Code, {
    identification: md5(identificationText).toString(),
    type,
    textContent,
    cssRules
  });
  el.className = customElClass;
  codeSectionNode.contentEl.insertBefore(el, codeSectionNode.contentEl.firstChild);
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
