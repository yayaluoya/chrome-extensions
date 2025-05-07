import Controller from "./components/Controller/index.vue";
import { createAppEl } from "../createAppEl";
import { getAllSectionNodeBox } from "./getAllSectionNodeBox";
import { debounce, wait } from "@taozi-chrome-extensions/common/src/utils/global";
import { ElMessage } from "element-plus";
import { RETRY_COUNT, RETRY_DELAY, CUSTOM_EL_CLASS_CODESIGN } from "@/constant";
import { insertEl } from "../insertEl";

/**
 * 代码设计注入
 */
export function codesignInject() {
  document.addEventListener(
    "click",
    debounce((e: MouseEvent) => {
      // 点击非操作面板的地方
      if (e.target instanceof Node && document.querySelector(".screen-inspector.inspector.expanded")?.contains(e.target)) {
        return;
      }
      trigger().catch(err => {
        console.error(err);
        ElMessage({
          message: err + "",
          type: "error"
        });
      });
    }, 100),
    {
      capture: true
    }
  );
}

async function trigger() {
  for (let i = 0; i < RETRY_COUNT; i++) {
    await wait(RETRY_DELAY);
    const screenInspectorEl = document.querySelector<HTMLDivElement>(".screen-inspector.inspector.expanded");
    if (!screenInspectorEl) {
      continue;
    }
    const sectionNodeBoxs = getAllSectionNodeBox(screenInspectorEl);
    const codeSectionNode = sectionNodeBoxs.find(item => item.title === "代码");
    if (!codeSectionNode) {
      continue;
    }
    const mountEl = await insertEl(
      codeSectionNode.contentEl,
      () => codeSectionNode.contentEl.firstChild as HTMLElement,
      CUSTOM_EL_CLASS_CODESIGN
    );
    if (mountEl) {
      await createAppEl({
        mountElFunc: el => {
          mountEl.appendChild(el);
        },
        com: Controller
      });
      break;
    }
  }
}
