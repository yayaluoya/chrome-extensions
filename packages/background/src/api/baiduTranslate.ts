import { md5 } from "@taozi-chrome-extensions/common/src/md5";
import { getConfig } from "@taozi-chrome-extensions/common/src/local/config";

/**
 * 请求百度翻译api
 * @param str
 * @returns
 */
export async function requestBaiduTranslate(str: string): Promise<string> {
  if (!str) {
    throw new Error("没有需要翻译的内容");
  }
  const { baiduAppId = "", baiduKey = "" } = await getConfig();
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
