import { requestApiDetails, requestDataSchemas } from "../../api/apifox";
import { ApiMethod, ValueType, type ApiDetail, type Type } from "../../api/type";
import { apiTemLocal } from "@yayaluoya-extensions/common/src/local/apiTem";

type DependencyInterfacesType = { id: number; name: string; description: string; typeStr: string };

export async function getApiCallFile(projectId: string, apiId: number, objectType: string) {
  const ApiDetails = await requestApiDetails(projectId);
  const DataSchemas = await requestDataSchemas(projectId);

  const apiDetail = ApiDetails.find(item => item.id === apiId);

  if (!apiDetail) {
    return;
  }

  const dependencyInterfaces: DependencyInterfacesType[] = [];

  const apiFunInfo = await generateTheApiFun(apiDetail, dependencyInterfaces);

  /**
   * 生成api调用方法
   */
  async function generateTheApiFun(apiDetail: ApiDetail, dependencyInterfaces: DependencyInterfacesType[] = []) {
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

    return {
      apiName,
      apiMethod,
      apiPath,
      apiFunName,
      argType,
      responsesType: responsesType?.typeStr
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

  const apiTem = (await apiTemLocal.get())?.find(item => item.objectType === objectType)?.value || "";

  return apiTem.replace(/\$\{(.*?)\}/g, (_, a: string) => {
    return {
      projectId: projectId,
      apiId: apiId,
      apiName: apiFunInfo.apiName,
      apiMethod: apiFunInfo.apiMethod,
      apiPath: apiFunInfo.apiPath,
      apiFunName: apiFunInfo.apiFunName,
      argType: apiFunInfo.argType ? `data: ${apiFunInfo.argType}` : "",
      dataArg: apiFunInfo.argType ? "data" : "",
      responsesType: apiFunInfo.responsesType ? apiFunInfo.responsesType : "void",
      dependencyInterfaces: dependencyInterfaces
        .map(item =>
          `
/** 
* ${item.description || item.name}
* ID: ${item.id}
*/    
export interface ${item.name} ${item.typeStr}`.trim()
        )
        .join("\n")
    }[a.trim()] as string;
  });
}
