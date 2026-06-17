"use client";

import Link from "next/link";
import {
  Button,
  Row,
  Col,
  Card,
  Typography,
  Divider,
  Collapse,
  Tag,
} from "antd";
import {
  ThunderboltOutlined,
  ArrowRightOutlined,
  ReadOutlined,
  TeamOutlined,
  FileTextOutlined,
  UserOutlined,
  MessageOutlined,
  LockOutlined,
} from "@ant-design/icons";
import styles from "@/components/main/Main.module.css";
import FAQ_ITEMS from "@/components/main/faq";
import FEATURES from "@/components/main/features";
import QUICK_LINKS from "@/components/main/quickLinks";

const { Title, Paragraph, Text } = Typography;

export default function HomePage() {
  return (
    <div className={styles.landingPage}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <Tag
          icon={<ThunderboltOutlined />}
          className={styles.heroBadge}
        >
          Корпоративная система
        </Tag>

        <Title className={styles.heroTitle}>
          Добро пожаловать в&nbsp;
          <span className={styles.heroAccent}>МП Бишкек ТЭЦ</span>
        </Title>

        <Paragraph className={styles.heroSub}>
          Единый портал для сотрудников теплоэлектроцентрали —
          новости, документы и управление всё здесь
        </Paragraph>

        <div className={styles.heroBtns}>
          <Link href="/news">
            <Button
              type="primary"
              size="large"
              icon={<ArrowRightOutlined />}
              className={styles.btnPrimary}
            >
              Перейти в раздел
            </Button>
          </Link>
          <Link href="/workers">
            <Button size="large" className={styles.btnGhost}>
              Узнать больше
            </Button>
          </Link>
        </div>

        <div className={styles.heroStats}>
          <div className={styles.heroStatItem}>
            <span className={styles.heroStatVal}>1700+</span>
            <span className={styles.heroStatLbl}>Сотрудников</span>
          </div>
          <div className={styles.heroStatDivider} />
          <div className={styles.heroStatItem}>
            <span className={styles.heroStatVal}>30+</span>
            <span className={styles.heroStatLbl}>Отделов</span>
          </div>
          <div className={styles.heroStatDivider} />
          <div className={styles.heroStatItem}>
            <span className={styles.heroStatVal}>{new Date().getFullYear() - 60}</span>
            <span className={styles.heroStatLbl}>Год основания</span>
          </div>
          <div className={styles.heroStatDivider} />
          <div className={styles.heroStatItem}>
            <span className={styles.heroStatVal}>24/7</span>
            <span className={styles.heroStatLbl}>Работа системы</span>
          </div>
        </div>
      </section>

      <div className={styles.landingContent} style={{ padding: '0 24px 24px 24px' }}>

        {/* ── Features ── */}
        <section className={styles.section}>
          <Text className={styles.sectionLabel}>Возможности</Text>
          <Title level={2} className={styles.sectionTitle}>
            Всё что нужно — в одном месте
          </Title>
          <Paragraph className={styles.sectionSub}>
            Портал объединяет ключевые инструменты для ежедневной работы сотрудников
          </Paragraph>

          <Row gutter={[16, 16]} style={{ marginTop: 32 }}>
            {FEATURES.map((f) => (
              <Col key={f.title} xs={12} md={6}>
                <Card className={styles.featureCard} variant="borderless">
                  <div
                    className={styles.featureIcon}
                    style={{ background: f.iconBg, color: f.iconColor }}
                  >
                    {f.icon}
                  </div>
                  <Title level={5} className={styles.featureTitle}>{f.title}</Title>
                  <Paragraph className={styles.featureDesc}>{f.desc}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        <Divider className={styles.divider} />

        {/* ── Quick links ── */}
        <section className={styles.section}>
          <Text className={styles.sectionLabel}>Навигация</Text>
          <Title level={2} className={styles.sectionTitle}>Быстрый переход</Title>
          <Paragraph className={styles.sectionSub}>
            Основные разделы портала — всё под рукой
          </Paragraph>

          <Row gutter={[12, 12]} style={{ marginTop: 28 }}>
            {QUICK_LINKS.map((l) => (
              <Col key={l.title} xs={12} md={6}>
                <Link href={l.href}>
                  <Card className={styles.linkCard} variant="borderless">
                    <div className={styles.linkCardInner}>
                      <div
                        className={styles.linkIcon}
                        style={{ background: l.iconBg, color: l.iconColor }}
                      >
                        {l.icon}
                      </div>
                      <div className={styles.linkText}>
                        <span className={styles.linkTitle}>{l.title}</span>
                        <span className={styles.linkSub}>{l.sub}</span>
                      </div>
                      <ArrowRightOutlined className={styles.linkArrow} />
                    </div>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </section>

        {/* ── CTA Banner ── */}
        <Card className={styles.ctaBanner} variant="borderless">
          <div className={styles.ctaInner}>
            <div>
              <Title level={4} className={styles.ctaTitle}>
                Есть идеи по улучшению портала?
              </Title>
              <Paragraph className={styles.ctaSub}>
                Оставьте предложение — мы читаем каждое сообщение
                и стараемся сделать систему лучше
              </Paragraph>
            </div>
            <Link href="/suggestions">
              <Button type="primary" size="large" className={styles.btnPrimary}>
                Написать
              </Button>
            </Link>
          </div>
        </Card>

        {/* ── FAQ ── */}
        <section className={styles.section}>
          <Text className={styles.sectionLabel}>Справка</Text>
          <Title level={2} className={styles.sectionTitle}>Частые вопросы</Title>

          <Collapse
            items={FAQ_ITEMS}
            defaultActiveKey={["1"]}
            accordion
            className={styles.faqCollapse}
          />
        </section>

      </div>
    </div>
  );
}