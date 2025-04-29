import { useLocalStorage } from ".";

export interface ApifoxLocalStorage {
  /** 当前的项目类型 */
  onObjectType: string;
  /** 模板列表 */
  tems: { objectType: string; value: string }[];
}

export const apifoxLocalStorage = useLocalStorage<string, ApifoxLocalStorage>("apifox-local-storage", {
  onObjectType: "",
  tems: []
});
