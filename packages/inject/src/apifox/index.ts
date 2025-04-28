import { ElMessage } from "element-plus";
import Controller from "./components/Controller/index.vue";
import { createAppEl } from "../createAppEl";

export async function apifoxInject() {
  document.addEventListener(
    "click",
    e => {
      if (
        e.target instanceof HTMLDivElement &&
        document.querySelector(".ui-tree-list")?.contains(e.target) &&
        e.target.className === "truncate"
      ) {
        setTimeout(() => {
          trigger().catch(err => {
            console.log(err);
            ElMessage({
              message: err,
              type: "error"
            });
          });
        }, 0);
      }
    },
    {
      capture: true
    }
  );
}

async function trigger() {
  const projectId = location.pathname.match(/\/project\/([0-9]+)\/?/)?.[1];
  if (!projectId) {
    return;
  }
  const onPane = document.querySelector(".ui-tabs-tabpane.ui-tabs-tabpane-active.main-tabs-pane");
  if (!onPane) {
    return;
  }
  const apiId = onPane.id.match(/\.([0-9]+)$/)?.[1];
  if (!apiId) {
    return;
  }
  const buttonP = onPane.querySelector(".actions-wrap");
  if (!buttonP) {
    return;
  }
  const customElClass = "custom-el-class";
  buttonP.querySelector(`.${customElClass}`)?.remove();
  await createAppEl({
    handleEl: el => {
      el.className = customElClass;
      buttonP.insertBefore(el, buttonP.firstChild);
    },
    com: Controller,
    props: {
      projectId,
      apiId: parseInt(apiId)
    }
  });
}
