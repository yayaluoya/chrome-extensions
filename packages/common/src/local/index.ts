export function getLocalStorage<N extends string = string, V = string>(name: N): Promise<V | undefined> {
  return chrome.storage.local.get(name).then(a => {
    return a[name];
  });
}

export function setLocalStorage<N extends string = string, V = string>(name: N, value?: V) {
  return chrome.storage.local.set({ [name]: value });
}

export function useLocalStorage<N extends string = string, V = string>(name: N | (() => N), defV: V) {
  const get = () => getLocalStorage<N, V>(typeof name === "string" ? name : name());
  const set = (value: V | undefined) => setLocalStorage<N, V>(typeof name === "string" ? name : name(), value);
  const edit = async (e: (value: V) => void | Promise<void>) => {
    const value = (await get()) || defV;
    await e(value);
    await set(value);
  };
  return {
    get,
    set,
    edit
  };
}
