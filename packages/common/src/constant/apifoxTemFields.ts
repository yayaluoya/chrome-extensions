export enum ApifoxTemFields {
  /** 项目id */
  projectId = "projectId",
  /** apiId */
  apiId = "apiId",
  /** api名字 */
  apiName = "apiName",
  /** apiHttp方法名 */
  apiMethod = "apiMethod",
  /** apiHttp方法名大写 */
  apiMethodCapital = "apiMethodCapital",
  /** api路径 */
  apiPath = "apiPath",
  /** api调用方法名 */
  apiCallFunName = "apiCallFunName",
  /** 调用方法参数类型字符串 */
  funParamTypeStr = "funParamTypeStr",
  /** requestBody类型 */
  requestBodyType = "requestBodyType",
  /** 响应类型字符串 */
  responsesTypeStr = "responsesTypeStr",
  /** 依赖接口类型字符串 */
  dependencyInterfacesTypeStr = "dependencyInterfacesTypeStr"
}

export const ApifoxTemFieldsDocs: Record<ApifoxTemFields, string> = {
  [ApifoxTemFields.projectId]: "项目id",
  [ApifoxTemFields.apiId]: "apiId",
  [ApifoxTemFields.apiName]: "api名字",
  [ApifoxTemFields.apiMethod]: "apiHttp方法名",
  [ApifoxTemFields.apiMethodCapital]: "apiHttp方法名大写",
  [ApifoxTemFields.apiPath]: "api路径",
  [ApifoxTemFields.apiCallFunName]: "api调用方法名",
  [ApifoxTemFields.funParamTypeStr]: `调用方法参数类型字符串`,
  [ApifoxTemFields.requestBodyType]: "requestBody类型",
  [ApifoxTemFields.responsesTypeStr]: "响应类型字符串",
  [ApifoxTemFields.dependencyInterfacesTypeStr]: "依赖接口类型字符串"
};
