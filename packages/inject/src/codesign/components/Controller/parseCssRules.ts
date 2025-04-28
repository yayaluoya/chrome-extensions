export type CssRulesType = {
  query?: string;
  props: cssPropType[];
};

export type cssPropType = {
  name: string;
  value: string;
};

/**
 * 解析css规则
 * @returns
 */
export function parseCssRules({
  cssCode,
  includePropsName = [],
  excludeProps = [],
  supplementProps = []
}: {
  cssCode: string;
  /** 包含的css属性 */
  includePropsName?: (string | RegExp)[];
  /** 排除的css属性 */
  excludeProps?: cssPropType[];
  /** 补充的css属性 */
  supplementProps?: cssPropType[];
}) {
  const cssRules: CssRulesType[] = [];

  const rulesMatch = [...cssCode.matchAll(/\s*\.(.*?)\s*{([\s\S]*?)}/g)];

  const getProps = (css: string) => {
    const cssPropsRegexp = /\s*([a-zA-Z-]+)\s*:\s*([^;]+)\s*;/g;
    return [...css.matchAll(cssPropsRegexp)].reduce<cssPropType[]>((a, b) => {
      const name = b[1].trim();
      let value = b[2].trim();

      // 处理一些特殊值
      value = value.replace(/var\(--.*?,\s*#(.*?)\)/, (_, a) => {
        return "#" + a;
      });

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

  if (rulesMatch.length === 0) {
    cssRules.push({
      props: getProps(cssCode)
    });
  } else {
    rulesMatch.forEach(item => {
      cssRules.push({
        query: item[1],
        props: getProps(item[2])
      });
    });
  }

  // 添加需要补充的css属性
  cssRules.forEach(({ props }) => {
    supplementProps.forEach(addProp => {
      if (!props.some(p => p.name === addProp.name)) {
        props.push(addProp);
      }
    });
  });
  return cssRules;
}
