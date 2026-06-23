"use client";

import styles from "../styles/Dashboard.module.css";

interface ActivityItem {
  id: number;
  icon: string;
  title: string;
  sub: string;
  time: string;
  color: "purple" | "green" | "amber" | "blue";
}

const MOCK_ACTIVITY: ActivityItem[] = [
  { id: 1, icon: "✏️", title: "Обновлён профиль", sub: "Кузнецов А.И.", time: "10 мин", color: "purple" },
  { id: 2, icon: "👤", title: "Добавлен сотрудник", sub: "Морозов Д.С.", time: "1 ч", color: "green" },
  { id: 3, icon: "📄", title: "Шаблон изменён", sub: "«Поздравление»", time: "3 ч", color: "amber" },
  { id: 4, icon: "🔔", title: "Рассылка отправлена", sub: "5 получателей", time: "вчера", color: "blue" },
];

const COLOR_MAP = {
  purple: { bg: "#EEEDFE", color: "#3C3489" },
  green:  { bg: "#E1F5EE", color: "#085041" },
  amber:  { bg: "#FAEEDA", color: "#633806" },
  blue:   { bg: "#E6F1FB", color: "#0C447C" },
};

export const ActivityFeed = () => (
  <div className={styles.sectionCard}>
    <div className={styles.sectionHeader}>
      <div className={styles.sectionTitleGroup}>
        <span className={styles.sectionIconActivity}>⚡</span>
        <h2 className={styles.sectionTitle}>Последние события</h2>
      </div>
    </div>

    <div>
      {MOCK_ACTIVITY.map((item) => {
        const c = COLOR_MAP[item.color];
        return (
          <div key={item.id} className={styles.activityRow}>
            <div
              className={styles.activityIcon}
              style={{ background: c.bg, color: c.color }}
            >
              {item.icon}
            </div>
            <div className={styles.activityBody}>
              <p className={styles.activityTitle}>{item.title}</p>
              <p className={styles.activitySub}>{item.sub}</p>
            </div>
            <span className={styles.activityTime}>{item.time}</span>
          </div>
        );
      })}
    </div>
  </div>
);