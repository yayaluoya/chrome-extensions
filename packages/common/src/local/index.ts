export function getStorageLocal(name: string) {
  return chrome.storage.local.get(name).then(a => {
    return (a[name] as string) || "";
  });
}

export function setStorageLocal(name: string, value: string) {
  return chrome.storage.local.set({ [name]: value });
}

export function storageLocal(name: string | (() => string)) {
  return {
    get: () => getStorageLocal(typeof name === "string" ? name : name()),
    set: (value: string) => setStorageLocal(typeof name === "string" ? name : name(), value)
  };
}
