import CryptoJS from "crypto-js";

export function queryBaiduTranslate(str: string) {
  const appId = "";
  const salt = "";
  const key = "";
  return fetch(
    `https://fanyi-api.baidu.com/api/trans/vip/translate?q=${str}&from=zh&to=en&appid=${appId}&salt=${salt}&sign=${CryptoJS.MD5(
      appId + str + salt + key
    )}`
  )
    .then(res => res.json())
    .then(json => {
      return json["trans_result"][0]["dst"];
    });
}
