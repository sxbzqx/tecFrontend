"use client";

import styles from "./Main.module.css";
import { Worker as IWorker } from "@/types/worker";

const MONTHS = ["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"];

interface Props {
  workers: IWorker[];
}

export const BirthdayChart = ({ workers }: Props) => {
  const currentMonth = new Date().getMonth();

  const counts = Array(12).fill(0);
  workers.forEach((w) => {
    const m = new Date(w.dr).getMonth();
    counts[m]++;
  });

  const max = Math.max(...counts, 1);

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleGroup}>
          <span className={styles.sectionIconChart}>📊</span>
          <h2 className={styles.sectionTitle}>Дни рождения по месяцам</h2>
        </div>
      </div>

      <div className={styles.chartWrap}>
        {counts.map((count, i) => {
          const isActive = i === currentMonth;
          const height = count === 0 ? 4 : Math.max(8, (count / max) * 100);
          return (
            <div key={i} className={styles.chartCol}>
              <span className={`${styles.chartCount} ${isActive ? styles.chartCountActive : ""}`}>
                {count > 0 ? count : ""}
              </span>
              <div
                className={`${styles.chartBar} ${isActive ? styles.chartBarActive : ""}`}
                style={{ height: `${height}%` }}
              />
              <span className={`${styles.chartLabel} ${isActive ? styles.chartLabelActive : ""}`}>
                {MONTHS[i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};