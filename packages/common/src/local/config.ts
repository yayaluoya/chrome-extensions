import { useLocalStorage } from ".";

export interface ConfigLocalStorage {
  baiduAppId: string;
  baiduKey: string;
  /** 当前激活的标签页 */
  popupActiveTab: string;
  /** 代理服务地址 */
  proxyServiceUrl: string;
}

export const configLocalStorage = useLocalStorage<string, ConfigLocalStorage>("config-local-storage", {
  popupActiveTab: "",
  baiduAppId: "",
  baiduKey: "",
  proxyServiceUrl: ""
});
