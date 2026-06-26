import { $api } from "@/app/api/api";
import { ActivityItem } from "@/types/activity";

export async function fetchRecentActivity(take = 10): Promise<ActivityItem[]> {
  const response = await $api.get<ActivityItem[]>("/activity", {
    params: { take },
  });
  return response.data;
}