import { md5 } from "../md5";

export function evalFunction(formParameter: string, content: string, ...arg: any[]) {
  return new Promise<string>((resolve, reject) => {
    const key = md5("sandbox-iframe" + Date.now() + Math.random()).toString();
    const sandboxIframe = document.createElement("iframe");
    sandboxIframe.src = chrome.runtime.getURL("sandbox/index.html");
    sandboxIframe.sandbox = "allow-scripts allow-same-origin";
    document.body.appendChild(sandboxIframe);

    const handleRes = ({ data: { key: onKey, success, msg = "", data } }: any) => {
      if (onKey === key) {
        end();
        if (success) {
          resolve(data);
        } else {
          reject(new Error(msg));
        }
      }
    };

    const t = setTimeout(() => {
      end();
      reject(new Error("evalFunction 超时"));
    }, 10 * 1000);

    const end = () => {
      t && clearTimeout(t);
      window.removeEventListener("message", handleRes);
      document.body.removeChild(sandboxIframe);
    };

    sandboxIframe.addEventListener("load", () => {
      sandboxIframe.contentWindow?.postMessage({ key, type: "evalFunction", data: { formParameter, content, arg } }, "*");

      window.addEventListener("message", handleRes);
    });
  });
}
