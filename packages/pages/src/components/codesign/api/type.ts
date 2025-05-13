export interface User {
  nickname: string;
  position: string;
  last_team_id: number;
}

export interface RecentViewed {
  data: RecentViewedItem[];
}

export interface RecentViewedItem {
  id: number;
  name: string;
  model: "design" | "prototype";
  cover_url: string;
  fallback_cover_url: string;
  updated_at: string;
  updater: {
    nickname: string;
  };
}
