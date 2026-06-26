"use client";

import { Spin, Empty } from "antd";
import { useQuery } from "@tanstack/react-query";
import styles from "../styles/Dashboard.module.css";
import { fetchRecentActivity } from "@/services/activityService";
import { ActivityAction } from "@/types/activity";

type Color = "purple" | "green" | "amber" | "blue";

const ACTION_PRESENTATION: Record<string, { icon: string; color: Color }> = {
  post_created: { icon: "📝", color: "green" },
  post_updated: { icon: "✏️", color: "purple" },
  post_deleted: { icon: "🗑️", color: "amber" },
  role_changed: { icon: "👤", color: "blue" },
};

const DEFAULT_PRESENTATION = { icon: "🔔", color: "purple" as Color };

const COLOR_MAP: Record<Color, { bg: string; color: string }> = {
  purple: { bg: "#EEEDFE", color: "#3C3489" },
  green: { bg: "#E1F5EE", color: "#085041" },
  amber: { bg: "#FAEEDA", color: "#633806" },
  blue: { bg: "#E6F1FB", color: "#0C447C" },
};

function presentationFor(action: ActivityAction) {
  return ACTION_PRESENTATION[action] ?? DEFAULT_PRESENTATION;
}

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = Date.now(); 
  const diffMs = now - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  
  console.log("Дата из API:", date.toISOString()); // Проверьте, совпадает ли это с тем, что вы ожидаете
  console.log("Текущее время:", now.toString());

  if (diffMin < 1) return "только что";
  if (diffMin < 60) return `${diffMin} мин`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} ч`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "вчера";
  if (diffDays < 7) return `${diffDays} дн`;

  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

export const ActivityFeed = () => {
  const {
    data: items,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["recent-activity"],
    queryFn: () => fetchRecentActivity(10),
  });

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleGroup}>
          <span className={styles.sectionIconActivity}>⚡</span>
          <h2 className={styles.sectionTitle}>Последние события</h2>
        </div>
      </div>

      {isLoading && (
        <div style={{ textAlign: "center", padding: 24 }}>
          <Spin size="small" />
        </div>
      )}

      {!isLoading && (isError || !items?.length) && (
        <Empty description="Пока нет событий" style={{ padding: 24 }} />
      )}

      {!isLoading &&
        !isError &&
        items?.map((item) => {
          const presentation = presentationFor(item.action);
          const c = COLOR_MAP[presentation.color];
          return (
            <div key={item.id} className={styles.activityRow}>
              <div
                className={styles.activityIcon}
                style={{ background: c.bg, color: c.color }}
              >
                {presentation.icon}
              </div>
              <div className={styles.activityBody}>
                <p className={styles.activityTitle}>{item.title}</p>
                {item.subtitle && (
                  <p className={styles.activitySub}>{item.subtitle}</p>
                )}
              </div>
              <span className={styles.activityTime}>
                {formatRelativeTime(item.createdAt)}
              </span>
            </div>
          );
        })}
    </div>
  );
};