export function getStorageLocal<N extends string = string, V extends string = string>(name: N): Promise<V | undefined> {
  return chrome.storage.local.get(name).then(a => {
    return a[name];
  });
}

export function setStorageLocal<N extends string = string, V extends string = string>(name: N, value?: V) {
  return chrome.storage.local.set({ [name]: value });
}

export function storageLocal<N extends string = string, V extends string = string>(name: N | (() => N)) {
  return {
    get: () => getStorageLocal<N, V>(typeof name === "string" ? name : name()),
    set: (value: V | undefined) => setStorageLocal<N, V>(typeof name === "string" ? name : name(), value)
  };
}
