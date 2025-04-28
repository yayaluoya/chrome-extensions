export enum ApiMethod {
  Get = "get",
  Post = "post",
  Put = "put",
  Delete = "delete"
}

export enum ApiStatus {
  /** 开发中 */
  Developing = "developing",
  /** 发布 */
  Released = "released",
  /** 弃用 */
  Deprecated = "deprecated"
}

export enum ValueType {
  String = "string",
  Number = "number",
  Integer = "integer",
  Boolean = "boolean",
  Object = "object",
  Array = "array",
  File = "file",
  None = "none"
}

export interface Type {
  $ref?: string;
  type?: ValueType | ValueType[];
  properties?: Record<string, Type>;
  items?: Type;
  description?: string;
  required?: string[];
}

export interface ApiDetail {
  id: number;
  name: string;
  method: ApiMethod;
  path: string;
  tags: string[];
  status: ApiStatus;
  parameters: {
    query?: {
      id: string;
      name: string;
      required: boolean;
      type: string;
      description: string;
      schema?: Type;
    }[];
  };
  requestBody: {
    type: "application/json" | "application/x-www-form-urlencoded" | "multipart/form-data" | "none";
    jsonSchema?: Type;
    parameters?: {
      id: string;
      name: string;
      required: boolean;
      type: string;
      description: string;
    }[];
  };
  responses: {
    id: number;
    name: string;
    code: 200 | 401 | 403 | 404;
    contentType: "json";
    jsonSchema: Type;
  }[];
}

export interface Schema {
  id: number;
  name: string;
  jsonSchema: Type;
  description?: string;
}
