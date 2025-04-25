import { requestApiDetails, requestDataSchemas } from "../../api/apifox";
import { ApiMethod, ValueType, type ApiDetail, type Type } from "../../api/type";

type DependencyInterfacesType = { id: number; name: string; description: string; typeStr: string };

export async function getApiCallFile(projectId: string, apiId: number) {
  const ApiDetails = await requestApiDetails(projectId);
  const DataSchemas = await requestDataSchemas(projectId);

  const apiDetail = ApiDetails.find(item => item.id === apiId);

  if (!apiDetail) {
    return;
  }

  const dependencyInterfaces: DependencyInterfacesType[] = [];

  const apiFunStr = generateTheApiFun(apiDetail, dependencyInterfaces);

  /**
   * 生成api调用方法
   * @param apiDetail
   */
  function generateTheApiFun(apiDetail: ApiDetail, dependencyInterfaces: DependencyInterfacesType[] = []) {
    const {
      id: apiId,
      name: apiName,
      method: apiMethod,
      path: apiPath,
      parameters: { query = [] },
      requestBody,
      responses: responsess
    } = apiDetail;
    const responses = responsess.find(item => item.code === 200);

    const queryType =
      query.length > 0
        ? `{${query
            .map(item => {
              return getProp(item.name, getType({ type: item.type as ValueType }).typeStr, item.description);
            })
            .join("\n")}}`.trim()
        : "";
    const requestBodyType =
      requestBody.type === "application/json" ? getType(requestBody.jsonSchema, dependencyInterfaces) : undefined;
    const responsesType = responses?.contentType === "json" ? getType(responses.jsonSchema, dependencyInterfaces) : undefined;
    const apiFunName = `request${(apiPath.match(/(\w+)$/)?.[1] || "").replace(/^[a-z]/, _ => _.toLocaleUpperCase())}`;
    const argType = apiMethod === ApiMethod.Get ? queryType : apiMethod === ApiMethod.Post ? requestBodyType?.typeStr : "";
    return `
    /**
     * ${apiName}
     * ${apiMethod} ${apiPath}
     * 接口ID: ${apiId}
     * 接口地址: https://app.apifox.com/link/project/${projectId}/apis/api-${apiId}
     */
    export const ${apiFunName} = (${argType ? `data: ${argType}` : ""})=>{
      return request.${apiMethod}<${responsesType ? responsesType.typeStr : "none"}>({
        url: "${apiPath}",
        ${argType ? "data" : ""}
      }); 
    }
    `.trim();
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
    interface?: string;
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
        interface: schemaName
      };
    }
    // 对象
    else if (type.properties) {
      const properties = type.properties;
      const propertieTypes = Object.keys(properties).map(key => ({
        key,
        t: getType(properties[key], dependencyInterfaces)
      }));
      return {
        typeStr: `{\n${propertieTypes
          .map(({ key, t }) => {
            return getProp(key, t.typeStr, properties[key].description);
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

  function getProp(name: string, type: string, description?: string) {
    return `${description ? `/** ${description} */\n` : ""}${name}?: ${type};`;
  }

  return `
  ${dependencyInterfaces
    .map(item =>
      `
/** 
* ${item.description || item.name}
* ID: ${item.id}
*/    
export interface ${item.name} ${item.typeStr}`.trim()
    )
    .join("\n")}
  ${apiFunStr}
  `;
}
