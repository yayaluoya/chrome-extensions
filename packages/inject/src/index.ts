import { apifoxInject } from "./apifox";
import { codesignInject } from "./codesign/index";
import { tapdInject } from "./tapd";

switch (location.hostname) {
  case "codesign.qq.com":
    codesignInject();
    break;
  case "app.apifox.com":
    apifoxInject();
    break;
  case "www.tapd.cn":
    tapdInject();
    break;
}
