import { useLocalStorage } from ".";

export interface ApifoxLocalStorage {
  /** 当前的代码模板id */
  onCodeTemplateId: string;
  /** 代码模板列表 */
  codeTemplates: { id: string; name: string; value: string }[];
  /** 响应data字段名 */
  responseDataName: string;
}

export const apifoxLocalStorage = useLocalStorage<string, ApifoxLocalStorage>("apifox-local-storage", {
  onCodeTemplateId: "",
  codeTemplates: [],
  responseDataName: "data"
});
