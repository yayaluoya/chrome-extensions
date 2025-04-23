import Controller from "./components/Controller/index.vue";
import { createAppEl } from "../createAppEl";
import { getAllSectionNodeBox } from "./getAllSectionNodeBox";

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

  const customElClass = "custom-el-class";
  codeSectionNode.contentEl.querySelector(`.${customElClass}`)?.remove();
  const el = createAppEl(Controller);
  el.className = customElClass;
  codeSectionNode.contentEl.insertBefore(el, codeSectionNode.contentEl.firstChild);
}
