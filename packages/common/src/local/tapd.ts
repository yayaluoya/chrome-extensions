import { storageLocal } from ".";

export type TapdLocalInfo = {
  story: number;
  task: number;
  bug: number;
  errMsg?: string;
};

export const tapdLocal = storageLocal<"tapd-local", TapdLocalInfo>("tapd-local");
