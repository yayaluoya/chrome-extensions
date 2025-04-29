import { storageLocal } from ".";

export interface Config extends Record<string, string | undefined> {
  baiduAppId?: string;
  baiduKey?: string;
}

const configStorage = storageLocal<"config", Config>("config");

export const getConfig = () => {
  return configStorage.get().then(v => v || ({} as Config));
};

export const setConfig = async (c: Config) => {
  return configStorage.set({
    ...(await getConfig()),
    ...c
  });
};
