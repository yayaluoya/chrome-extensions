export function getCssRules(sectionNodeContentEl: Element, includeProps: (string | RegExp)[] = [], excludeProps: { name: string; value: string; }[] = []) {
    const cssRules: {
        query?: string;
        props: Record<string, string>;
    }[] = [];
    const cssCode = sectionNodeContentEl.querySelectorAll(".css-node__code--item")[0]?.textContent || "";
    const cssRulesRegexp = /\s*\.(.*?)\s*{([\s\S]*?)}/g;
    const cssRulesMatch = [...cssCode.matchAll(cssRulesRegexp)];

    const getProps = (css: string) => {
        const cssPropsRegexp = /\s*([a-zA-Z-]+)\s*:\s*([^;]+)\s*;/g;
        return [...css.matchAll(cssPropsRegexp)].reduce<Record<string, string>>((a, b) => {
            const name = b[1];
            const value = b[2];
            if (includeProps.some(item => typeof item === 'string' ? item === name : item.test(name)) && !excludeProps.some(item => item.name === name && item.value === value)) {
                a[name] = value;
            }
            return a;
        }, {});
    }

    if (cssRulesMatch.length === 0) {
        cssRules.push({
            props: getProps(cssCode),
        });
    }
    else {
        cssRulesMatch.forEach(item => {
            cssRules.push({
                query: item[1],
                props: getProps(item[2]),
            });
        })
    }
    return cssRules;
}