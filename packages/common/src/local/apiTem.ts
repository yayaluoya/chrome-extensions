import { storageLocal } from ".";

export type ApiTemLocalType = { objectType: string; value: string }[];

export const apiTemLocal = storageLocal<"api-tem-local", ApiTemLocalType>("api-tem-local");
