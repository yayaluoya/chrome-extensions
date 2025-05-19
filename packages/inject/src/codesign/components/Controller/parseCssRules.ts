export type CssRule = {
  query: string;
  props: CssProp[];
};

export type CssProp<N extends string | RegExp = string, V extends string | RegExp = string> = {
  name: N;
  value: V;
};

/**
 * 解析css规则
 * @returns
 */
export function parseCssRules({
  cssCode,
  includePropNames = [],
  excludeProps = [],
  supplementProps = [],
  options = {}
}: {
  cssCode: string;
  /** 包含的css属性名 */
  includePropNames?: (string | RegExp)[];
  /** 排除的css属性*/
  excludeProps?: CssProp<string | RegExp, string | RegExp>[];
  /** 补充的css属性 */
  supplementProps?: CssProp[];
  /** 选项 */
  options?: {
    /** 在有padding属性时是否加入box-sizing: border-box */
    boxSizing?: boolean;
  };
}) {
  const cssRules: CssRule[] = [];

  const rulesMatch = [...cssCode.matchAll(/\s*\.(.*?)\s*{([\s\S]*?)}/g)];

  const getProps = (css: string) => {
    const cssPropsRegexp = /\s*([a-zA-Z-]+)\s*:\s*([^;]+)\s*;/g;
    return [...css.matchAll(cssPropsRegexp)].reduce<CssProp[]>((a, b) => {
      const propName = b[1].trim();
      let propValue = b[2].trim();

      // 处理一些特殊值
      propValue = propValue.replace(/var\(--.*?,\s*#(.*?)\)/, (_, a) => {
        return "#" + a;
      });

      if (
        includePropNames.some(item => (typeof item === "string" ? item === propName : item.test(propName))) &&
        !excludeProps.some(
          item =>
            (typeof item.name === "string" ? item.name === propName : item.name.test(propName)) &&
            (typeof item.value === "string" ? item.value === propValue : item.value.test(propValue))
        )
      ) {
        a.push({
          name: propName,
          value: propValue
        });
      }
      return a;
    }, []);
  };

  if (rulesMatch.length === 0) {
    cssRules.push({
      query: "",
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

  // 处理box-sizing
  if (options?.boxSizing) {
    cssRules.forEach(item => {
      if (
        item.props.some(p => /^padding/.test(p.name)) &&
        !item.props.some(p => p.name === "box-sizing" && p.value === "border-box")
      ) {
        item.props.push({ name: "box-sizing", value: "border-box" });
      }
    });
  }

  return cssRules;
}
