"use client";

import { Row, Col } from "antd";
import {
  GiftOutlined,
  CheckCircleOutlined,
  BellOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { BirthdayTable } from "@/components/main/birthdayTable";
import { Notifications } from "@/components/main/notifications";
import { ActivityFeed } from "@/components/main/activityFeed";
import { BirthdayChart } from "@/components/main/birthdayChart";
import { useBirthday } from "@/hooks/useBirthday";
import styles from "@/components/styles/Dashboard.module.css";
import FAQ_ITEMS from "@/components/main/faq";

export default function HomePage() {
  const { upcomingBirthdays, allWorkers, loading } = useBirthday();

  const today = new Date().toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const STATS = [
    {
      icon: <GiftOutlined />,
      value: upcomingBirthdays.length,
      label: "Именинников",
      hint: "сегодня и завтра",
      accent: "#534AB7",
      iconBg: "#EEEDFE",
      iconColor: "#534AB7",
    },
    {
      icon: <CheckCircleOutlined />,
      value: "2",
      label: "Новостей",
      hint: "за сегодня",
      accent: "#1D9E75",
      iconBg: "#E1F5EE",
      iconColor: "#0F6E56",
    },
    {
      icon: <BellOutlined />,
      value: 2,
      label: "Уведомлений",
      hint: "требуют внимания",
      accent: "#BA7517",
      iconBg: "#FAEEDA",
      iconColor: "#854F0B",
    },
    {
      icon: <TeamOutlined />,
      value: allWorkers?.length ?? "—",
      label: "Сотрудников",
      hint: "в базе данных",
      accent: "#378ADD",
      iconBg: "#E6F1FB",
      iconColor: "#185FA5",
    },
  ];

  return (
    <div className={styles.container}>

      {/* ── Hero ── */}
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <span className={styles.eyebrow}>
            <ThunderboltOutlined />
            МП Бишкек ТЭЦ
          </span>
          <h1 className={styles.heroTitle}>Корпоративная панель</h1>
          <p className={styles.heroSub}>
            Отслеживайте именинников, важные новости и системные события — всё в одном месте
          </p>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.dateChip}>
            <CalendarOutlined className={styles.dateIcon} />
            <span>{today}</span>
          </div>
          <div className={styles.statusPill}>
            <span className={styles.statusDot} />
            Все системы работают
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <Row gutter={[16, 16]} className={styles.statsRow}>
        {STATS.map((s, i) => (
          <Col key={i} xs={12} sm={12} md={6}>
            <div
              className={styles.statCard}
              style={{ "--accent": s.accent } as React.CSSProperties}
            >
              <div
                className={styles.statIcon}
                style={{ background: s.iconBg, color: s.iconColor }}
              >
                {s.icon}
              </div>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
              <div className={styles.statHint}>{s.hint}</div>
            </div>
          </Col>
        ))}
      </Row>

      {/* ── Main grid: table + notifications ── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} xl={16}>
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleGroup}>
                <GiftOutlined className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Ближайшие дни рождения</h2>
              </div>
              <span className={styles.countBadge}>{upcomingBirthdays.length}</span>
            </div>
            <BirthdayTable data={upcomingBirthdays} loading={loading} />
          </div>
        </Col>
        <Col xs={24} xl={8}>
          <div className={styles.sectionCard} style={{ height: "100%" }}>
            <Notifications />
          </div>
        </Col>
      </Row>

      {/* ── Bottom grid: activity + chart + faq ── */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <ActivityFeed />
        </Col>
        <Col xs={24} md={8}>
          <BirthdayChart workers={allWorkers ?? []} />
        </Col>
        <Col xs={24} md={8}>
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleGroup}>
                <h2 className={styles.sectionTitle}>Частые вопросы</h2>
              </div>
            </div>
            <div className={styles.faqInner}>
              <FAQ_ITEMS />
            </div>
          </div>
        </Col>
      </Row>

    </div>
  );
}