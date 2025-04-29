import { useLocalStorage } from ".";

export interface TapdLocalStorage {
  workitemCount: {
    story: number;
    task: number;
    bug: number;
  };
  errMsg?: string;
}

export const tapdLocalStorage = useLocalStorage<string, TapdLocalStorage>("tapd-local-storage", {
  workitemCount: {
    story: 0,
    task: 0,
    bug: 0
  }
});
