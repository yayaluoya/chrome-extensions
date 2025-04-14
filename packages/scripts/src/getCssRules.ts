export type cssPropType = {
  name: string;
  value: string;
};

export type CssRulesType = {
  query?: string;
  props: cssPropType[];
};

export function getCssRules(
  sectionNodeContentEl: Element,
  includePropsName: (string | RegExp)[] = [],
  excludeProps: cssPropType[] = [],
  addProps: cssPropType[] = []
) {
  const cssRules: CssRulesType[] = [];
  const cssCode = sectionNodeContentEl.querySelectorAll(".css-node__code--item")[0]?.textContent || "";
  const cssRulesRegexp = /\s*\.(.*?)\s*{([\s\S]*?)}/g;
  const cssRulesMatch = [...cssCode.matchAll(cssRulesRegexp)];

  const getProps = (css: string) => {
    const cssPropsRegexp = /\s*([a-zA-Z-]+)\s*:\s*([^;]+)\s*;/g;
    return [...css.matchAll(cssPropsRegexp)].reduce<cssPropType[]>((a, b) => {
      const name = b[1];
      const value = b[2];
      if (
        includePropsName.some(item => (typeof item === "string" ? item === name : item.test(name))) &&
        !excludeProps.some(item => item.name === name && item.value === value)
      ) {
        a.push({
          name,
          value
        });
      }
      return a;
    }, []);
  };

  if (cssRulesMatch.length === 0) {
    cssRules.push({
      props: getProps(cssCode)
    });
  } else {
    cssRulesMatch.forEach(item => {
      cssRules.push({
        query: item[1],
        props: getProps(item[2])
      });
    });
  }
  cssRules.forEach(({ props }) => {
    addProps.forEach(addProp => {
      if (!props.some(p => p.name === addProp.name)) {
        props.push(addProp);
      }
    });
  });
  return cssRules;
}
