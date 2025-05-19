import { useLocalStorage } from ".";

export interface CodesignLocalStorage {
  objectType: string;
  annotations: Record<string, string>;
  translateInputs: Record<string, string>;
  classNames: Record<string, string>;
  iconUrls: Record<string, string>;
  config: {
    /** 是否忽略css的字体 */
    ignoreCssFontFamily?: boolean;
    /** 在有padding属性时是否加入box-sizing: border-box */
    boxSizing?: boolean;
  };
}

export const codesignLocalStorage = useLocalStorage<string, CodesignLocalStorage>("codesign-local-storage", {
  objectType: "",
  annotations: {},
  translateInputs: {},
  classNames: {},
  iconUrls: {},
  config: {}
});
