document.addEventListener(
  "click",
  () => {
    setTimeout(() => {
      trigger();
    }, 0);
  },
  {
    capture: true
  }
);

function trigger() {
  const screenInspectorEl = document.querySelector<HTMLDivElement>(".screen-inspector.inspector.expanded");
  if (!screenInspectorEl) {
    return;
  }
  const sectionNodeBoxs = getAllSectionNodeBox(screenInspectorEl);
  if (sectionNodeBoxs.some(item => item.title === "文本")) {
    const textContent =
      sectionNodeBoxs.find(item => item.title == "内容")?.contentEl?.querySelector(".textarea__node.node-item__input span")
        ?.textContent || "";
    console.log("文本", textContent, getCssCode(sectionNodeBoxs.find(item => item.title == "代码")?.sectionNodeEl!));
  } else if (sectionNodeBoxs.some(item => item.title === "切图")) {
    const imgSrc = sectionNodeBoxs
      .find(item => item.title === "切图")
      ?.contentEl?.querySelector<HTMLImageElement>(".thumb img")?.src;
    console.log("切图", imgSrc, getCssCode(sectionNodeBoxs.find(item => item.title == "代码")?.sectionNodeEl!));
  } else {
    console.log("盒子", getCssCode(sectionNodeBoxs.find(item => item.title == "代码")?.sectionNodeEl!));
  }
}

function getAllSectionNodeBox(screenInspectorEl: Element) {
  let list: { sectionNodeEl?: HTMLDivElement; title: string; contentEl?: HTMLDivElement }[] = [];
  screenInspectorEl.querySelectorAll<HTMLDivElement>("section.node-box").forEach(sectionNodeEl => {
    const title = (sectionNodeEl.querySelector(".node-box__header .node-box__header--title")?.textContent || "").trim();
    const contentEl = sectionNodeEl.querySelector<HTMLDivElement>(".node-box__content") || undefined;
    list.push({
      sectionNodeEl,
      title,
      contentEl
    });
  });
  return list;
}

function getCssCode(sectionNodeContentEl: Element) {
  const cssCode = sectionNodeContentEl.querySelectorAll(".css-node__code--item")[0]?.textContent || "";
  return cssCode;
}
