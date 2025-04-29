import { useLocalStorage } from ".";

export interface CodesignLocalStorage {
  objectType: string;
  translateInputs: Record<string, string>;
  classNames: Record<string, string>;
}

export const codesignLocalStorage = useLocalStorage<string, CodesignLocalStorage>("codesign-local-storage", {
  objectType: "",
  translateInputs: {},
  classNames: {}
});
