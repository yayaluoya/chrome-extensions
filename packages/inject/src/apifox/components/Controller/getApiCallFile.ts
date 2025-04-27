import { handleVarName1 } from "@taozi-chrome-extensions/common/src/utils/global";
import { requestApiDetails, requestDataSchemas } from "../../api/apifox";
import { ApiMethod, ValueType, type ApiDetail, type Type } from "../../api/type";
import { apiTemLocal } from "@taozi-chrome-extensions/common/src/local/apiTem";
import { ApifoxTemFields } from "@taozi-chrome-extensions/common/src/constant/apifoxTemFields";
import { evalFunction } from "@taozi-chrome-extensions/common/src/eval/index";

type DependencyInterfacesType = {
  id: number;
  name: string;
  description: string;
  typeStr: string;
};

export async function getApiCallFile(projectId: string, apiId: number, objectType: string) {
  const ApiDetails = await requestApiDetails(projectId);
  const DataSchemas = await requestDataSchemas(projectId);

  const apiDetail = ApiDetails.find(item => item.id === apiId);

  if (!apiDetail) {
    return;
  }

  const dependencyInterfaces: DependencyInterfacesType[] = [];

  const apiFunInfo = await getApiFunInfo(apiDetail, dependencyInterfaces);

  async function getApiFunInfo(apiDetail: ApiDetail, dependencyInterfaces: DependencyInterfacesType[] = []) {
    const {
      name: apiName,
      method: apiMethod,
      path: apiPath,
      parameters: { query = [] },
      requestBody,
      responses: responsess
    } = apiDetail;
    const responses = responsess.find(item => [200, 201, 204].includes(item.code));

    const queryTypeStr =
      query.length > 0
        ? `{\n${query
            .map(item => {
              return getTypeProp(
                item.name,
                getType({ type: item.type as ValueType }).typeStr,
                item.description,
                item.required,
                "s"
              );
            })
            .join("\n")}\n}`.trim()
        : "";
    const requestBodyTypeStr =
      requestBody.type === "application/json"
        ? getType(requestBody.jsonSchema, dependencyInterfaces)?.typeStr
        : requestBody.type === "application/x-www-form-urlencoded"
        ? requestBody.parameters
          ? `{\n${requestBody.parameters
              .map(item => {
                return getTypeProp(
                  item.name,
                  getType({ type: item.type as ValueType }).typeStr,
                  item.description,
                  item.required,
                  "s"
                );
              })
              .join("\n")}\n}`.trim()
          : ""
        : "";
    let responsesTypeStr = "void";
    if (responses && responses.contentType === "json") {
      let jsonSchema: Type | undefined = responses.jsonSchema;
      if (jsonSchema.$ref) {
        const schemaId = jsonSchema.$ref.match(/^#\/definitions\/([0-9]+)$/)?.[1] || "";
        jsonSchema = DataSchemas.find(item => item.id === parseInt(schemaId))?.jsonSchema;
      }
      jsonSchema = jsonSchema?.properties?.["data"];
      if (jsonSchema) {
        responsesTypeStr = getType(jsonSchema, dependencyInterfaces)?.typeStr || responsesTypeStr;
      }
    }
    const apiCallFunName = handleVarName1(
      `request${(apiPath.match(/(\w+)$/)?.[1] || "").replace(/^[a-z]/, _ => _.toLocaleUpperCase())}`
    );
    const funParamTypeStr = apiMethod === ApiMethod.Get ? queryTypeStr : requestBodyTypeStr;

    return {
      apiName,
      apiMethod,
      apiPath,
      apiCallFunName,
      funParamTypeStr,
      responsesTypeStr
    };
  }

  /**
   * 获取类型
   * @param type
   */
  function getType(
    type: Type,
    dependencyInterfaces: DependencyInterfacesType[] = []
  ): {
    typeStr: string;
    interfaceId?: number;
    interfaceName?: string;
  } {
    // 引用
    if (type.$ref) {
      const schemaId = type.$ref.match(/^#\/definitions\/([0-9]+)$/)?.[1] || "";
      const schema = DataSchemas.find(item => item.id === parseInt(schemaId));
      if (!schema) {
        return { typeStr: "any" };
      }
      const schemaName = schema.name.replace(/«/g, "").replace(/»/g, "");
      if (!dependencyInterfaces.some(item => item.id === schema.id)) {
        const dependencyInterface: DependencyInterfacesType = {
          id: schema.id,
          name: schemaName,
          description: schema.description || "",
          typeStr: ""
        };
        dependencyInterfaces.push(dependencyInterface);
        dependencyInterface.typeStr = getType(schema.jsonSchema, dependencyInterfaces).typeStr;
      }
      return {
        typeStr: schemaName,
        interfaceId: schema.id,
        interfaceName: schemaName
      };
    }
    // 对象
    else if (type.properties) {
      const properties = type.properties;
      const propertieTypes = Object.keys(properties).map(key => ({
        key,
        t: getType(properties[key], dependencyInterfaces)
      }));
      if (propertieTypes.length <= 0) {
        return {
          typeStr: "{ [key: string]: any }"
        };
      }
      return {
        typeStr: `{\n${propertieTypes
          .map(({ key, t }) => {
            return getTypeProp(key, t.typeStr, properties[key].description, type.required?.includes(key), "m");
          })
          .join("\n")}\n}`
      };
    }
    // 数组
    else if (type.items) {
      const t = getType(type.items, dependencyInterfaces);
      t.typeStr = `${t.typeStr}[]`;
      return t;
    }
    // 基本数据类型
    else {
      const types = (Array.isArray(type.type) ? type.type : [type.type]).map(item => {
        if (item === ValueType.Integer) {
          return ValueType.Number;
        }
        return item;
      });
      return {
        typeStr: types.join("|")
      };
    }
  }

  function getTypeProp(name: string, type: string, description?: string, required?: boolean, descriptionType: "s" | "m" = "s") {
    return (
      `
${
  description
    ? descriptionType === "s"
      ? `/** ${description} */`
      : `
/** 
${description
  .split(/\n+/)
  .map(item => ` * ${item}`)
  .join("\n")}
 */
`.trim()
    : ""
}
`.trim() +
      (description ? "\n" : "") +
      `${name}${required ? "" : "?"}: ${type};`
    );
  }

  const apiTems = ((await apiTemLocal.get())?.find(item => item.objectType === objectType)?.value || "").split(/\n+----\n+/);

  const result: string[] = [];
  const apiTemFields = {
    [ApifoxTemFields.projectId]: projectId,
    [ApifoxTemFields.apiId]: apiId.toString(),
    [ApifoxTemFields.apiName]: apiFunInfo.apiName,
    [ApifoxTemFields.apiMethod]: apiFunInfo.apiMethod,
    [ApifoxTemFields.apiMethodCapital]: apiFunInfo.apiMethod.toLocaleUpperCase(),
    [ApifoxTemFields.apiPath]: apiFunInfo.apiPath,
    [ApifoxTemFields.apiCallFunName]: apiFunInfo.apiCallFunName,
    [ApifoxTemFields.funParamTypeStr]: apiFunInfo.funParamTypeStr,
    [ApifoxTemFields.responsesTypeStr]: apiFunInfo.responsesTypeStr ? apiFunInfo.responsesTypeStr : "void",
    [ApifoxTemFields.dependencyInterfacesTypeStr]: dependencyInterfaces
      .map(item =>
        `
/** 
* ${item.description || item.name}
* SchemaID: ${item.id}
*/    
export interface ${item.name} ${item.typeStr}
`.trim()
      )
      .join("\n\n")
  } as Record<ApifoxTemFields, string>;
  for (let apiTem of apiTems) {
    result.push(await evalFunction(`{${Object.keys(apiTemFields).join(",")}}`, `return \`${apiTem}\``, apiTemFields));
  }
  return result;
}
