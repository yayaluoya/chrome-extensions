import { useLocalStorage } from ".";

export interface ConfigLocalStorage {
  baiduAppId: string;
  baiduKey: string;
  popupActiveTab: string;
  genVarNameInput: string;
}

export const configLocalStorage = useLocalStorage<string, ConfigLocalStorage>("config-local-storage", {
  popupActiveTab: "",
  baiduAppId: "",
  baiduKey: "",
  genVarNameInput: ""
});
