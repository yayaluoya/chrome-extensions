import { md5 } from "@yayaluoya-extensions/common/src/md5";
import { baiduAppIdStorage, baiduKeyStorage } from "@yayaluoya-extensions/common/src/local/baiduApp";

/**
 * 请求百度翻译api
 * @param str
 * @returns
 */
export async function requestBaiduTranslate(str: string) {
  const appId = await baiduAppIdStorage.get();
  const salt = md5(Date.now().toString());
  const key = await baiduKeyStorage.get();
  return fetch(
    `https://fanyi-api.baidu.com/api/trans/vip/translate?q=${str}&from=zh&to=en&appid=${appId}&salt=${salt}&sign=${md5(
      appId + str + salt + key
    ).toString()}`
  )
    .then(res => res.json())
    .then(json => {
      if (json["error_code"]) {
        throw json["error_code"];
      } else {
        return json["trans_result"][0]["dst"];
      }
    });
}
