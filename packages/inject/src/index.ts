import { apifoxInject } from "./apifox";
import { codesignInject } from "./codesign/index";

switch (location.hostname) {
  case "codesign.qq.com":
    codesignInject();
    break;
  case "app.apifox.com":
    apifoxInject();
    break;
}
