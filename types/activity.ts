export type ActivityAction =
  | "post_created"
  | "post_updated"
  | "post_deleted"
  | "role_changed"
  | string;

export interface ActivityItem {
  id: number;
  action: ActivityAction;
  title: string;
  subtitle: string | null;
  createdAt: string;
}