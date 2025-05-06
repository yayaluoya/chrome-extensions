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
      let n = 0;
      const f = () => {
        setTimeout(() => {
          n++;
          if (n > 1000) {
            return;
          }
          trigger().then(res => {
            res || f();
          });
        }, 0);
      };
      f();
    },
    {
      capture: true
    }
  );
}

async function trigger(): Promise<boolean> {
  const screenInspectorEl = document.querySelector<HTMLDivElement>(".screen-inspector.inspector.expanded");
  if (!screenInspectorEl) {
    return false;
  }
  const sectionNodeBoxs = getAllSectionNodeBox(screenInspectorEl);
  const codeSectionNode = sectionNodeBoxs.find(item => item.title === "代码");
  if (!codeSectionNode) {
    return false;
  }

  const customElClass = "custom-el-class";
  codeSectionNode.contentEl.querySelector(`.${customElClass}`)?.remove();
  await createAppEl({
    com: Controller,
    handleEl: el => {
      el.className = customElClass;
      codeSectionNode.contentEl.insertBefore(el, codeSectionNode.contentEl.firstChild);
    }
  });
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(!!codeSectionNode.contentEl.querySelector(`.${customElClass}`));
    }, 0);
  });
}
