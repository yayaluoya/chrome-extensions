import { ElMessage } from "element-plus";
import Controller from "./components/Controller/index.vue";
import { createAppEl } from "../createAppEl";
import { debounce, wait } from "@taozi-chrome-extensions/common/src/utils/global";
import { RETRY_COUNT, RETRY_DELAY, CUSTOM_EL_CLASS_APIFOX } from "@/constant";
import { insertEl } from "../insertEl";

/**
 * apifox 注入
 */
export async function apifoxInject() {
  document.addEventListener(
    "click",
    debounce((e: MouseEvent) => {
      if (e.target instanceof HTMLDivElement && document.querySelector(".ui-tree-list")?.contains(e.target)) {
        trigger().catch(err => {
          console.error(err);
          ElMessage({
            message: err + "",
            type: "error"
          });
        });
      }
    }, 100),
    {
      capture: true
    }
  );
}

async function trigger() {
  for (let i = 0; i < RETRY_COUNT; i++) {
    await wait(RETRY_DELAY);
    const projectId = location.pathname.match(/\/project\/([0-9]+)\/?/)?.[1];
    if (!projectId) {
      continue;
    }
    const onPane = document.querySelector(".ui-tabs-tabpane.ui-tabs-tabpane-active.main-tabs-pane");
    if (!onPane) {
      continue;
    }
    const apiId = onPane.id.match(/\.([0-9]+)$/)?.[1];
    if (!apiId) {
      continue;
    }
    const buttonP = onPane.querySelector(".actions-wrap");
    if (!buttonP) {
      continue;
    }
    const mountEl = await insertEl(buttonP, () => buttonP.firstChild as HTMLElement, CUSTOM_EL_CLASS_APIFOX);
    if (mountEl) {
      await createAppEl({
        mountElFunc: el => {
          mountEl.appendChild(el);
        },
        com: Controller,
        props: {
          projectId,
          apiId: parseInt(apiId)
        }
      });
      break;
    }
  }
}
