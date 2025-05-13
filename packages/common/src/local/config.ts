import { useLocalStorage } from ".";

export interface ConfigLocalStorage {
  baiduAppId: string;
  baiduKey: string;
  popupActiveTab: string;
  genVarNameInput: string;
  /** cf worker 地址 */
  cfWorkerUrl: string;
}

export const configLocalStorage = useLocalStorage<string, ConfigLocalStorage>("config-local-storage", {
  popupActiveTab: "",
  baiduAppId: "",
  baiduKey: "",
  genVarNameInput: "",
  cfWorkerUrl: ""
});
