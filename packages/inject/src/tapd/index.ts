import { tapdLocal } from "@taozi-chrome-extensions/common/src/local/tapd";
import { get_my_worktable_common } from "./api/get_my_worktable_common";

export function papdInject() {
  const f = () => {
    get_my_worktable_common()
      .then(data => {
        tapdLocal.set({
          story: parseInt(data.workitem_count?.story || "0"),
          task: parseInt(data.workitem_count?.task || "0"),
          bug: parseInt(data.workitem_count?.bug || "0")
        });
      })
      .catch(err => {
        tapdLocal.set({
          story: 0,
          task: 0,
          bug: 0,
          errMsg: err
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
