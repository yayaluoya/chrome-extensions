import { ElMessage } from "element-plus";
import Controller from "./components/Controller/index.vue";
import { createAppEl } from "../createAppEl";
import { debounce, wait } from "@taozi-chrome-extensions/common/src/utils/global";
import { RETRY_COUNT, RETRY_DELAY, MOUNT_CHECK_DELAY, CUSTOM_EL_CLASS_APIFOX } from "@/constant";

export async function apifoxInject() {
  document.addEventListener(
    "click",
    debounce((e: MouseEvent) => {
      if (
        e.target instanceof HTMLDivElement &&
        document.querySelector(".ui-tree-list")?.contains(e.target) &&
        e.target.className === "truncate"
      ) {
        trigger().catch(err => {
          console.log(err);
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
    buttonP.querySelector(`.${CUSTOM_EL_CLASS_APIFOX}`)?.remove();
    const mountEl = document.createElement("div");
    mountEl.className = CUSTOM_EL_CLASS_APIFOX;
    buttonP.insertBefore(mountEl, buttonP.firstChild);
    // 等待100ms后，如果存在customElClass，则创建app
    const res = await new Promise<boolean>(resolve => {
      setTimeout(() => {
        resolve(!!buttonP.querySelector(`.${CUSTOM_EL_CLASS_APIFOX}`));
      }, MOUNT_CHECK_DELAY);
    });
    if (res) {
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
