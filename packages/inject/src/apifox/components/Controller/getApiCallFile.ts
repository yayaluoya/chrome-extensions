import { kebabToCamelCase, toValidVariableName } from "@taozi-chrome-extensions/common/src/utils/global";
import { requestApiDetails, requestDataSchemas } from "../../api/apifox";
import { ApiMethod, ValueType, type ApiDetail, type Type } from "../../api/type";
import { apifoxLocalStorage } from "@taozi-chrome-extensions/common/src/local/apifox";
import { ApifoxTemFields } from "@taozi-chrome-extensions/common/src/constant/apifoxTemFields";
import { evalFunction } from "@taozi-chrome-extensions/common/src/eval/index";

type DependencyInterfacesType = {
  id: number;
  name: string;
  description: string;
  typeStr: string;
};

export async function getApiCallFile({
  projectId,
  apiId,
  codeTems,
  codeOp = { indent: "  " }
}: {
  projectId: string;
  apiId: number;
  codeTems: string[];
  codeOp?: { indent?: string };
}) {
  const ApiDetails = await requestApiDetails(projectId);
  const DataSchemas = await requestDataSchemas(projectId);

  const apiDetail = ApiDetails.find(item => item.id === apiId);

  if (!apiDetail) {
    return;
  }

  const dependencyInterfaces: DependencyInterfacesType[] = [];

  const apiFunInfo = await getApiFunInfo({ apiDetail, dependencyInterfaces });

  async function getApiFunInfo({
    apiDetail,
    dependencyInterfaces = []
  }: {
    apiDetail: ApiDetail;
    dependencyInterfaces?: DependencyInterfacesType[];
  }) {
    const {
      name: apiName,
      method: apiMethod,
      path: apiPath,
      parameters: { query = [] },
      requestBody,
      responses: responsesList
    } = apiDetail;
    const responses = responsesList.find(item => [200, 201, 204].includes(item.code));

    const queryTypeStr =
      query.length > 0
        ? `{\n${query
            .map(item => {
              return getTypeProp({
                name: item.name,
                type: getType({ type: { type: item.type as ValueType } }).typeStr,
                description: item.description,
                required: item.required,
                descriptionType: "s"
              });
            })
            .join("\n")}\n}`.trim()
        : "";
    const requestBodyType = requestBody.type;
    const requestBodyTypeStr =
      requestBodyType === "application/json"
        ? requestBody.jsonSchema
          ? getType({
              type: requestBody.jsonSchema,
              dependencyInterfaces
            })?.typeStr
          : ""
        : requestBodyType === "application/x-www-form-urlencoded" || requestBodyType === "multipart/form-data"
        ? requestBody.parameters
          ? `{\n${requestBody.parameters
              .map(item => {
                return getTypeProp({
                  name: item.name,
                  type: getType({
                    type: { type: item.type as ValueType }
                  }).typeStr,
                  description: item.description,
                  required: item.required,
                  descriptionType: "s"
                });
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
      const responseDataName = ((await apifoxLocalStorage.get())?.responseDataName || "").trim();
      jsonSchema = responseDataName ? jsonSchema?.properties?.[responseDataName] : jsonSchema;
      if (jsonSchema) {
        responsesTypeStr =
          getType({
            type: jsonSchema,
            dependencyInterfaces
          })?.typeStr || responsesTypeStr;
      }
    }
    const apiCallFunName = kebabToCamelCase(
      `request${kebabToCamelCase(toValidVariableName(apiPath.match(/(\w+)$/)?.[1] || ""), true)}`
    );
    const funParamTypeStr = apiMethod === ApiMethod.Get ? queryTypeStr : requestBodyTypeStr;

    return {
      apiName,
      apiMethod,
      apiPath,
      apiCallFunName,
      funParamTypeStr,
      requestBodyType,
      responsesTypeStr
    };
  }

  /**
   * 获取类型
   * @param type
   */
  function getType({
    type,
    dependencyInterfaces = [],
    layer = 1
  }: {
    type: Type;
    dependencyInterfaces?: DependencyInterfacesType[];
    layer?: number;
  }): {
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
        dependencyInterface.typeStr = getType({
          type: schema.jsonSchema,
          dependencyInterfaces
        }).typeStr;
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
      const propertiesTypes = Object.keys(properties).map(key => ({
        key,
        t: getType({
          type: properties[key],
          dependencyInterfaces,
          layer: layer + 1
        })
      }));
      if (propertiesTypes.length <= 0) {
        return {
          typeStr: "{ [key: string]: any }"
        };
      }
      return {
        typeStr: `{\n${propertiesTypes
          .map(({ key, t }) => {
            return getTypeProp({
              name: key,
              type: t.typeStr,
              description: properties[key].description,
              required: type.required?.includes(key),
              descriptionType: "m",
              layer
            });
          })
          .join("\n")}\n${new Array(layer - 1).fill(codeOp.indent).join("")}}`
      };
    }
    // 数组
    else if (type.items) {
      const t = getType({
        type: type.items,
        dependencyInterfaces,
        layer: layer + 1
      });
      t.typeStr = `${t.typeStr}[]`;
      return t;
    }
    // 基本数据类型
    else {
      const types = (Array.isArray(type.type) ? type.type : [type.type]).map(item => {
        if (item === ValueType.Integer) {
          return ValueType.Number;
        } else if (item === ValueType.File) {
          return "File";
        }
        return item;
      });
      return {
        typeStr: types.join(" | ")
      };
    }
  }

  function getTypeProp({
    name,
    type,
    description,
    required,
    descriptionType = "s",
    layer = 1
  }: {
    name: string;
    type: string;
    description?: string;
    required?: boolean;
    descriptionType?: "s" | "m";
    layer?: number;
  }) {
    const blankSpace = new Array(layer).fill(codeOp.indent).join("");
    description = getDescription({ description, descriptionType, blankSpace });
    return (
      description +
      (description ? "\n" : "") +
      `${blankSpace}${/^[\w$0-9]+$/.test(name) ? name : `"${name}"`}${required ? "" : "?"}: ${type};`
    );
  }

  function getDescription({
    description,
    descriptionType = "s",
    blankSpace = ""
  }: {
    description?: string;
    descriptionType?: "s" | "m";
    blankSpace?: string;
  }) {
    return description
      ? descriptionType === "s"
        ? `${blankSpace}/** ${description} */`
        : `${blankSpace}/**
${description
  .split(/\n+/)
  .filter(Boolean)
  .map(item => `${blankSpace} * ${item}`)
  .join("\n")}
${blankSpace} */`
      : "";
  }

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
    [ApifoxTemFields.requestBodyType]: apiFunInfo.requestBodyType,
    [ApifoxTemFields.responsesTypeStr]: apiFunInfo.responsesTypeStr ? apiFunInfo.responsesTypeStr : "void",
    [ApifoxTemFields.dependencyInterfacesTypeStr]: dependencyInterfaces
      .map(item =>
        `
${getDescription({
  description: `${item.description || item.name}\nSchemaID: ${item.id}`,
  descriptionType: "m"
})}
export interface ${item.name} ${item.typeStr}
`.trim()
      )
      .join("\n\n")
  } as Record<ApifoxTemFields, string>;
  for (let apiTem of codeTems) {
    result.push(await evalFunction(`{${Object.keys(apiTemFields).join(",")}}`, `return \`${apiTem}\``, apiTemFields));
  }
  return result;
}
