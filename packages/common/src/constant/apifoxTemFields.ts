export enum ApifoxTemFields {
  projectId = "projectId",
  apiId = "apiId",
  apiName = "apiName",
  apiMethod = "apiMethod",
  apiMethodCapital = "apiMethodCapital",
  apiPath = "apiPath",
  apiCallFunName = "apiCallFunName",
  funParamTypeStr = "funParamTypeStr",
  responsesTypeStr = "responsesTypeStr",
  dependencyInterfacesTypeStr = "dependencyInterfacesTypeStr"
}

export const ApifoxTemFieldsDocs: Record<ApifoxTemFields, string> = {
  [ApifoxTemFields.projectId]: "项目id",
  [ApifoxTemFields.apiId]: "apiId",
  [ApifoxTemFields.apiName]: "api名字",
  [ApifoxTemFields.apiMethod]: "api调用方法名",
  [ApifoxTemFields.apiMethodCapital]: "api调用方法名大写",
  [ApifoxTemFields.apiPath]: "api路径",
  [ApifoxTemFields.apiCallFunName]: "api调用方法名",
  [ApifoxTemFields.funParamTypeStr]: `调用方法参数类型字符串`,
  [ApifoxTemFields.responsesTypeStr]: "响应类型字符串",
  [ApifoxTemFields.dependencyInterfacesTypeStr]: "依赖接口类型字符串"
};
