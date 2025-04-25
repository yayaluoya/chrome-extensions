import { request } from "./request";
import type { ApiDetail, Schema } from "./type";

const getAuthorization = () => {
  return (localStorage.getItem("common.accessToken") || "").replace(/^"|"$/g, "");
};

const requestApiDetailsResult: Map<string, Promise<ApiDetail[]>> = new Map();
export function requestApiDetails(projectId: string) {
  if (!requestApiDetailsResult.has(projectId)) {
    requestApiDetailsResult.set(
      projectId,
      request<ApiDetail[]>(`https://api.apifox.com/api/v1/api-details?locale=zh-CN`, {
        method: "get",
        headers: {
          authorization: getAuthorization(),
          "x-project-id": projectId
        }
      })
    );
  }
  return requestApiDetailsResult.get(projectId)!;
}

const requestDataSchemasResult: Map<string, Promise<Schema[]>> = new Map();
export function requestDataSchemas(projectId: string) {
  if (!requestDataSchemasResult.has(projectId)) {
    requestDataSchemasResult.set(
      projectId,
      request<Schema[]>(`https://api.apifox.com/api/v1/projects/${projectId}/data-schemas?locale=zh-CN`, {
        headers: {
          authorization: getAuthorization(),
          "x-project-id": projectId
        }
      })
    );
  }
  return requestDataSchemasResult.get(projectId)!;
}
