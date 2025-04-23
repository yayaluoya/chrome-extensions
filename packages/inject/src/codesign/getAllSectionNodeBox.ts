export function getAllSectionNodeBox(screenInspectorEl: Element) {
  let list: { sectionNodeEl: HTMLDivElement; title: string; contentEl: HTMLDivElement }[] = [];
  screenInspectorEl.querySelectorAll<HTMLDivElement>("section.node-box").forEach(sectionNodeEl => {
    const title = (sectionNodeEl.querySelector(".node-box__header .node-box__header--title")?.textContent || "").trim();
    const contentEl = sectionNodeEl.querySelector<HTMLDivElement>(".node-box__content")!;
    list.push({
      sectionNodeEl,
      title,
      contentEl
    });
  });
  return list;
}
