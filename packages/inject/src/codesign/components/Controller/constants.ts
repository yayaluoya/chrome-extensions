export const ITEM_TYPE_MAP = {
  img: "图片",
  icon: "切图",
  text: "文本",
  div: "盒子"
} as const;

export const OBJECT_TYPE_LIST = [
  { value: "pc" as const, label: "pc" },
  { value: "mp" as const, label: "mp" },
  { value: "app" as const, label: "app" }
];

export const CSS_PROP_INCLUDES = {
  text: [
    "color",
    "text-align",
    "font-family",
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
  ] as (string | RegExp)[],
  icon: ["width", "height"] as (string | RegExp)[],
  img: ["width", "height", "box-shadow", "border-radius"] as (string | RegExp)[],
  div: [
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
    /^padding-?/
  ] as (string | RegExp)[]
} as const;
