import "element-plus/dist/index.css";
import { createApp, h, type DefineSetupFnComponent } from "vue";

export function createAppEl<T extends DefineSetupFnComponent<any>>(
  com: T,
  props: T extends DefineSetupFnComponent<infer P> ? P : never
) {
  const el = document.createElement("div");
  const shadowRoot = el.attachShadow({ mode: "open" });
  const html = document.createElement("html");
  shadowRoot.appendChild(html);
  const head = document.createElement("head");
  html.appendChild(head);
  const body = document.createElement("body");
  body.style.margin = "none";
  html.appendChild(body);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = chrome.runtime.getURL("inject/index.css");
  head.appendChild(link);
  const mountEl = document.createElement("div");
  body.appendChild(mountEl);
  createApp({
    render() {
      return h(com, props);
    }
  }).mount(mountEl);
  return el;
}
