import type { CssProp } from "./parseCssRules";

export enum ElType {
  Img = "img",
  Icon = "icon",
  Text = "text",
  Div = "div"
}

export const ElTypeDesc: Record<ElType, string> = {
  [ElType.Img]: "图片",
  [ElType.Icon]: "切图",
  [ElType.Text]: "文本",
  [ElType.Div]: "盒子"
} as const;

export enum ObjectType {
  PC = "pc",
  MP = "mp",
  H5 = "h5",
  APP = "app"
}

export const OBJECT_TYPE_OPTIONS: { value: ObjectType; label: string }[] = [
  { value: ObjectType.PC, label: "PC" },
  // 以下项目都是以 uniapp 开发为准
  { value: ObjectType.MP, label: "MP" },
  { value: ObjectType.H5, label: "H5" },
  { value: ObjectType.APP, label: "APP" }
];

export const getCssPropConfig = (
  objectType: ObjectType,
  {
    ignoreCssFontFamily = false
  }: {
    /** 是否忽略 font-family 属性 */
    ignoreCssFontFamily?: boolean;
  } = {}
) => {
  /** 包含的css属性 */
  const includePropNames: Record<ElType, (string | RegExp)[]> = {
    [ElType.Text]: [
      "color",
      "text-align",
      ignoreCssFontFamily ? "" : "font-family",
      "font-size",
      "font-style",
      "font-weight",
      "line-height",
      "letter-spacing",
      // 多行省略
      "display",
      /^-webkit-/,
      "overflow",
      "text-overflow"
    ],
    [ElType.Icon]: ["width", "height"],
    [ElType.Img]: ["width", "height", "box-shadow", "border-radius", "overflow"],
    [ElType.Div]: [
      "width",
      "height",
      "display",
      /^flex-/,
      "align-items",
      "justify-content",
      "overflow",
      "box-sizing",
      /^background-?/,
      /^backdrop-?/,
      "box-shadow",
      /^border-?/,
      /^padding-?/,
      "gap"
    ]
  };
  // APP 项目中不支持 gap 属性
  if (objectType === ObjectType.APP) {
    includePropNames[ElType.Div] = includePropNames[ElType.Div].filter(item => item !== "gap");
  }

  /** 排除的css属性 */
  const excludeProps: Record<ElType, CssProp<string | RegExp, string | RegExp>[]> = {
    [ElType.Text]: [{ name: "font-style", value: "normal" }],
    [ElType.Icon]: [],
    [ElType.Img]: [],
    [ElType.Div]: []
  };

  /** 补充的css属性 */
  const supplementProps: Record<ElType, CssProp[]> = {
    [ElType.Text]: [],
    [ElType.Icon]: [],
    [ElType.Img]: [
      {
        name: "overflow",
        value: "hidden"
      }
    ],
    [ElType.Div]: []
  };
  return {
    includePropNames,
    excludeProps,
    supplementProps
  };
};
