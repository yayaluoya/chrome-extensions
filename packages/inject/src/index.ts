import { codesignStart } from "./codesign.page";

switch (location.hostname) {
  case "codesign.qq.com":
    codesignStart();
    break;
}
