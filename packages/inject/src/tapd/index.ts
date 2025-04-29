import { tapdLocalStorage } from "@taozi-chrome-extensions/common/src/local/tapd";
import { get_my_worktable_common } from "./api/get_my_worktable_common";

export function papdInject() {
  const f = () => {
    get_my_worktable_common()
      .then(data => {
        tapdLocalStorage.edit(v => {
          v.workitemCount.story = parseInt(data.workitem_count?.story || "0");
          v.workitemCount.task = parseInt(data.workitem_count?.task || "0");
          v.workitemCount.bug = parseInt(data.workitem_count?.bug || "0");
          v.viewConfig.current_tab = data.view_config?.current_tab || "";
        });
      })
      .catch(err => {
        tapdLocalStorage.edit(v => {
          v.errMsg = err;
        });
      })
      .finally(() => {
        setTimeout(() => {
          f();
        }, 1000);
      });
  };
  f();
}
