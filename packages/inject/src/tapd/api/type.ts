export interface MyWorktableCommonRes {
  view_config?: {
    current_tab: string;
  };
  workitem_count?: {
    story: string;
    task: string;
    bug: string;
  };
}
