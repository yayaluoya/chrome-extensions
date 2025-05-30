import { useLocalStorage } from ".";

export interface TapdLocalStorage {
  workitemCount: {
    story: number;
    task: number;
    bug: number;
  };
  viewConfig: {
    current_tab: string;
  };
  todoList: {
    title: string;
    detail_url: string;
    priority_name: string;
    entity_type: string;
    short_id: string;
  }[];
  dataUpdateTime?: number;
  errMsg?: string;
}

export const tapdLocalStorage = useLocalStorage<string, TapdLocalStorage>("tapd-local-storage", {
  workitemCount: {
    story: 0,
    task: 0,
    bug: 0
  },
  viewConfig: {
    current_tab: ""
  },
  todoList: []
});
