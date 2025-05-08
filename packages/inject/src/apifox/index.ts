import { ElMessage } from "element-plus";
import Controller from "./components/Controller/index.vue";
import { createAppEl } from "../utils/createAppEl";
import { debounce, wait } from "@taozi-chrome-extensions/common/src/utils/global";
import { TRIGGER_RETRY_COUNT, TRIGGER_RETRY_DELAY } from "@/constant";
import { insertMountEl } from "../utils/insertMountEl";

/**
 * apifox 注入
 */
export async function apifoxInject() {
  document.addEventListener(
    "click",
    debounce((e: MouseEvent) => {
      // 点击api列表
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
  for (let i = 0; i < TRIGGER_RETRY_COUNT; i++) {
    await wait(TRIGGER_RETRY_DELAY);
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
    const actionsWrapEl = onPane.querySelector(".actions-wrap");
    if (!actionsWrapEl) {
      continue;
    }
    const mountEl = await insertMountEl(
      actionsWrapEl,
      () => actionsWrapEl.firstChild as HTMLElement,
      "taozi-chrome-extensions-apifox-custom-el-class"
    );
    if (mountEl) {
      await createAppEl({
        mountEl,
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
