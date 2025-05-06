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
        let n = 0;
        const f = () => {
          setTimeout(() => {
            n++;
            if (n > 1000) {
              return;
            }
            trigger()
              .then(res => {
                res || f();
              })
              .catch(err => {
                console.log(err);
                ElMessage({
                  message: err,
                  type: "error"
                });
              });
          }, 0);
        };
        f();
      }
    },
    {
      capture: true
    }
  );
}

async function trigger(): Promise<boolean> {
  const projectId = location.pathname.match(/\/project\/([0-9]+)\/?/)?.[1];
  if (!projectId) {
    return false;
  }
  const onPane = document.querySelector(".ui-tabs-tabpane.ui-tabs-tabpane-active.main-tabs-pane");
  if (!onPane) {
    return false;
  }
  const apiId = onPane.id.match(/\.([0-9]+)$/)?.[1];
  if (!apiId) {
    return false;
  }
  const buttonP = onPane.querySelector(".actions-wrap");
  if (!buttonP) {
    return false;
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
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(!!buttonP.querySelector(`.${customElClass}`));
    }, 0);
  });
}
