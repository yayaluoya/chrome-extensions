export interface MyWorktableCommonRes {
  view_config?: {
    current_tab: string;
  };
  workitem_count?: {
    story: string;
    task: string;
    bug: string;
  };
  select_workspace_ids: string[];
  group_list: {
    group_id: string;
    group_name: string;
  }[];
}

export interface MyWorktableByPage {
  workitem_list: {
    name: string;
    title: string;
    owner: string;
    project_name: string;
    status_alias: string;
    detail_url: string;
    /** 提出人 */
    reporter: string;
    /** 优先级 */
    priority_name: string;
    entity_type: string;
    /** 短id */
    short_id: string;
  }[];
}
