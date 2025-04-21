import { codesignInject } from "./codesign/index";

switch (location.hostname) {
  case "codesign.qq.com":
    codesignInject();
    break;
}
