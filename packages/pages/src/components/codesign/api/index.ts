import { request } from "./request";
import type { User, RecentViewed } from "./type";

/**
 * 获取用户信息
 * @returns
 */
export const requestUser = () => {
  return request<User>("/api/user", {
    method: "GET"
  });
};

/**
 * 获取最近浏览
 * @param teamId
 * @returns
 */
export const requestRecentViewed = (teamId: number) => {
  return request<RecentViewed>(
    "/api/designs?" +
      Object.entries({
        tab: "recent_viewed",
        per_page: 100,
        team_id: teamId,
        with_sample: true,
        show_prototypes: true
      })
        .map(([key, value]) => `${key}=${value}`)
        .join("&"),
    {
      method: "GET"
    }
  );
};
