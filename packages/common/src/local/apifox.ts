import { useLocalStorage } from ".";

export interface ApifoxLocalStorage {
  /** 当前的代码模板id */
  onCodeTemplateId?: string;
  /** 代码模板列表 */
  codeTemplates?: ApifoxCodeTemplate[];
  /** 响应data字段名 */
  responseDataName?: string;
}

export interface ApifoxCodeTemplate {
  id: string;
  name: string;
  value: string;
}

export const apifoxLocalStorage = useLocalStorage<string, ApifoxLocalStorage>("apifox-local-storage", {
  onCodeTemplateId: "",
  codeTemplates: [],
  responseDataName: "data"
});
