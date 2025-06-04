import { useLocalStorage } from ".";

export interface GenVarNameLocalStorage {
  genVarNameInput?: string;
}

export const genVarNameLocalStorage = useLocalStorage<string, GenVarNameLocalStorage>("gen-var-name-local-storage", {
  genVarNameInput: ""
});
