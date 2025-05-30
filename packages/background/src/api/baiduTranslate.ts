import { md5 } from "@taozi-chrome-extensions/common/src/utils/md5";
import { configLocalStorage } from "@taozi-chrome-extensions/common/src/local/config";

/**
 * 请求百度翻译api
 * @param str
 * @returns
 */
export async function requestBaiduTranslate(str: string): Promise<string> {
  if (!str) {
    throw new Error("没有需要翻译的内容");
  }
  let { baiduAppId = "", baiduKey = "" } = (await configLocalStorage.get()) || {};
  baiduAppId = baiduAppId.trim();
  baiduKey = baiduKey.trim();
  if (!baiduAppId || !baiduKey) {
    throw new Error("请配置百度翻译的 appId 和 key");
  }
  const salt = md5(Date.now().toString());
  return fetch(
    `https://fanyi-api.baidu.com/api/trans/vip/translate?q=${str}&from=zh&to=en&appid=${baiduAppId}&salt=${salt}&sign=${md5(
      baiduAppId + str + salt + baiduKey
    ).toString()}`
  )
    .then(res => res.json())
    .then(json => {
      if (json["error_code"]) {
        throw new Error(json["error_msg"]);
      } else {
        return json["trans_result"][0]["dst"];
      }
    });
}
