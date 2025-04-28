import "element-plus/dist/index.css";
import { createApp, h, type DefineSetupFnComponent } from "vue";

export async function createAppEl<T extends DefineSetupFnComponent<any>>({
  handleEl,
  com,
  props
}: {
  handleEl: (el: HTMLDivElement) => void;
  com: T;
  props?: T extends DefineSetupFnComponent<infer P> ? P : never;
}) {
  const el = document.createElement("div");
  handleEl(el);
  const shadowRoot = el.attachShadow({ mode: "open" });
  const html = document.createElement("html");
  shadowRoot.appendChild(html);

  const head = document.createElement("head");
  html.appendChild(head);
  const body = document.createElement("body");
  body.style.margin = "0";
  html.appendChild(body);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = chrome.runtime.getURL("inject/index.css");
  await new Promise<void>(resolve => {
    link.addEventListener("load", () => resolve());
    head.appendChild(link);
  });
  const mountEl = document.createElement("div");
  body.appendChild(mountEl);
  createApp({
    render() {
      return h(com, props);
    }
  }).mount(mountEl);
}
