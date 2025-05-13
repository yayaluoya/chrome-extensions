import { request } from "./request";
import type { ApiDetail, Schema } from "./type";

const requestApiDetailsResult: Map<string, Promise<ApiDetail[]>> = new Map();

/**
 * 请求API详情
 * @param projectId
 * @returns
 */
export const requestApiDetails = (projectId: string) => {
  if (!requestApiDetailsResult.has(projectId)) {
    requestApiDetailsResult.set(
      projectId,
      request<ApiDetail[]>(
        "/api/v1/api-details?locale=zh-CN",
        {
          method: "get"
        },
        projectId
      )
    );
  }
  return requestApiDetailsResult.get(projectId)!;
};

const requestDataSchemasResult: Map<string, Promise<Schema[]>> = new Map();

/**
 * 请求数据模型
 * @param projectId
 * @returns
 */
export const requestDataSchemas = (projectId: string) => {
  if (!requestDataSchemasResult.has(projectId)) {
    requestDataSchemasResult.set(
      projectId,
      request<Schema[]>(
        `/api/v1/projects/${projectId}/data-schemas?locale=zh-CN`,
        {
          method: "get"
        },
        projectId
      )
    );
  }
  return requestDataSchemasResult.get(projectId)!;
};
