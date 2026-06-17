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

const { Title, Paragraph, Text } = Typography;

const FEATURES = [
  {
    icon: <ReadOutlined />,
    iconBg: "#EEEDFE",
    iconColor: "#3C3489",
    title: "Новости и события",
    desc: "Важные объявления, приказы и новости предприятия в режиме реального времени",
  },
  {
    icon: <TeamOutlined />,
    iconBg: "#E1F5EE",
    iconColor: "#085041",
    title: "Сотрудники",
    desc: "Справочник персонала, контакты отделов и структура предприятия",
  },
  {
    icon: <FileTextOutlined />,
    iconBg: "#FAEEDA",
    iconColor: "#633806",
    title: "Документы",
    desc: "Нормативные акты, инструкции и формы для скачивания и работы",
  },
  {
    icon: <LockOutlined />,
    iconBg: "#E6F1FB",
    iconColor: "#0C447C",
    title: "Личный профиль",
    desc: "Управление данными, настройки и доступ к персональной информации",
  },
];

const QUICK_LINKS = [
  { icon: <ReadOutlined />, iconBg: "#EEEDFE", iconColor: "#3C3489", title: "Новости", sub: "Лента событий", href: "/news" },
  { icon: <TeamOutlined />, iconBg: "#E1F5EE", iconColor: "#085041", title: "Сотрудники", sub: "Справочник", href: "/workers" },
  { icon: <MessageOutlined />, iconBg: "#FAEEDA", iconColor: "#633806", title: "Предложения", sub: "Обратная связь", href: "/suggestions" },
  { icon: <UserOutlined />, iconBg: "#E6F1FB", iconColor: "#0C447C", title: "Профиль", sub: "Мои данные", href: "/profile" },
];

const FAQ_ITEMS = [
  {
    key: "1",
    label: "Как войти в систему?",
    children: (
      <Paragraph className={styles.faqAnswer}>
        Используйте логин и пароль, выданные HR-отделом. Если возникли проблемы — обратитесь к системному администратору или нажмите{" "}
        <Link href="/login">Вход</Link> в меню.
      </Paragraph>
    ),
  },
  {
    key: "2",
    label: "Где посмотреть новости и объявления?",
    children: (
      <Paragraph className={styles.faqAnswer}>
        Перейдите в раздел <Link href="/news">Новости</Link> через верхнее меню. Там публикуются все важные объявления, приказы и события предприятия.
      </Paragraph>
    ),
  },
  {
    key: "3",
    label: "Как отправить предложение по улучшению?",
    children: (
      <Paragraph className={styles.faqAnswer}>
        Откройте раздел <Link href="/suggestions">Предложения</Link> в меню. Ваше сообщение будет рассмотрено администрацией в ближайшее время.
      </Paragraph>
    ),
  },
  {
    key: "4",
    label: "Как обновить данные профиля?",
    children: (
      <Paragraph className={styles.faqAnswer}>
        Перейдите в <Link href="/profile">Профиль</Link> через кнопку в правом верхнем углу. Там можно обновить контактную информацию и настройки уведомлений.
      </Paragraph>
    ),
  },
];

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