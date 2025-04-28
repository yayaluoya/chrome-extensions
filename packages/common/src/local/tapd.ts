import { storageLocal } from ".";

export type tapdLocalType = { workitem_count?: { story: string; task: string; bug: string } };

export const tapdLocal = storageLocal<"tapd-local", tapdLocalType>("tapd-local");
