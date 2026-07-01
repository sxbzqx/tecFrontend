"use client";

import React, { useMemo } from "react";
import { Row, Col, List, Spin } from "antd";
import {
  CompassOutlined,
  HomeOutlined,
  NotificationOutlined,
  UserOutlined,
  ApartmentOutlined,
  TeamOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  EditOutlined,
  EnvironmentOutlined,
  AppstoreOutlined,
  ArrowRightOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useLocale } from "@/context/LocaleContext";
import { useDepartments } from "@/hooks/useDepartments";
import type { TranslationKey } from "@/locales/ru";
import styles from "@/components/styles/Navigation.module.css";

const MapComponent = dynamic(() => import("@/components/tecMap/tecMap"), { ssr: false });

type Role = "Guest" | "Worker" | "Admin" | "SuperAdmin";

interface FeatureSection {
  href: string;
  icon: React.ReactNode;
  roles: Role[];
  titleKey: TranslationKey;
  descKey: TranslationKey;
}

// Единая карта разделов портала. roles определяет, кому раздел виден и
// доступен — та же логика ролевого доступа, что и в Navbar.
const SECTIONS: FeatureSection[] = [
  {
    href: "/",
    icon: <HomeOutlined />,
    roles: ["Guest", "Worker", "Admin", "SuperAdmin"],
    titleKey: "secHomeTitle",
    descKey: "secHomeDesc",
  },
  {
    href: "/news",
    icon: <NotificationOutlined />,
    roles: ["Guest", "Worker", "Admin", "SuperAdmin"],
    titleKey: "secNewsTitle",
    descKey: "secNewsDesc",
  },
  {
    href: "/map",
    icon: <EnvironmentOutlined />,
    roles: ["Guest", "Worker", "Admin", "SuperAdmin"],
    titleKey: "secMapTitle",
    descKey: "secMapDesc",
  },
  {
    href: "/profile",
    icon: <UserOutlined />,
    roles: ["Worker", "Admin", "SuperAdmin"],
    titleKey: "secProfileTitle",
    descKey: "secProfileDesc",
  },
  {
    href: "/otdels",
    icon: <ApartmentOutlined />,
    roles: ["Worker", "Admin", "SuperAdmin"],
    titleKey: "secOtdelsTitle",
    descKey: "secOtdelsDesc",
  },
  {
    href: "/workers",
    icon: <TeamOutlined />,
    roles: ["Admin", "SuperAdmin"],
    titleKey: "secWorkersTitle",
    descKey: "secWorkersDesc",
  },
  {
    href: "/bids/archive",
    icon: <FileDoneOutlined />,
    roles: ["Admin", "SuperAdmin"],
    titleKey: "secBidsTitle",
    descKey: "secBidsDesc",
  },
  {
    href: "/",
    icon: <FileTextOutlined />,
    roles: ["Worker", "Admin", "SuperAdmin"],
    titleKey: "secDocsTitle",
    descKey: "secDocsDesc",
  },
  {
    href: "/admin/news",
    icon: <EditOutlined />,
    roles: ["Admin", "SuperAdmin"],
    titleKey: "secAdminNewsTitle",
    descKey: "secAdminNewsDesc",
  },
  {
    href: "/admin/users",
    icon: <SafetyCertificateOutlined />,
    roles: ["SuperAdmin"],
    titleKey: "secAdminUsersTitle",
    descKey: "secAdminUsersDesc",
  },
];

const roleTagKey = (roles: Role[]): TranslationKey => {
  if (roles.includes("Guest")) return "navPageRoleAll";
  if (roles.length === 1 && roles[0] === "SuperAdmin") return "navPageRoleAdmin";
  return "navPageRoleAuth";
};

export default function NavigationPage() {
  const { auth, isMounted } = useAuth();
  const { t } = useLocale();
  const { data: otdels = [], isLoading: otdelsLoading } = useDepartments();

  const visibleSections = useMemo(
    () => SECTIONS.filter((s) => s.roles.includes(auth.role as Role)),
    [auth.role],
  );

  return (
    <div className={styles.container}>
      {/* ── Hero ── */}
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <span className={styles.eyebrow}>
            <CompassOutlined />
            {t("navPageEyebrow")}
          </span>
          <h1 className={styles.heroTitle}>{t("navPageTitle")}</h1>
          <p className={styles.heroSub}>{t("navPageSubtitle")}</p>
        </div>
        {isMounted && auth.role === "Guest" && (
          <div className={styles.guestNotice}>
            <InfoCircleOutlined />
            <span>{t("navPageGuestNotice")}</span>
          </div>
        )}
      </div>

      {/* ── Sections grid ── */}
      <h2 className={styles.sectionsTitle}>{t("navPageSectionsTitle")}</h2>
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        {(isMounted ? visibleSections : SECTIONS.filter((s) => s.roles.includes("Guest"))).map(
          (section) => (
            <Col key={`${section.href}-${section.titleKey}`} xs={24} sm={12} lg={8} xl={6}>
              <Link href={section.href} className={styles.featureCard} style={{ display: "flex" }}>
                <div className={styles.featureIconRow}>
                  <div className={styles.featureIcon}>{section.icon}</div>
                  <span className={styles.roleBadge}>{t(roleTagKey(section.roles))}</span>
                </div>
                <h3 className={styles.featureTitle}>{t(section.titleKey)}</h3>
                <p className={styles.featureDesc}>{t(section.descKey)}</p>
                <span className={styles.featureLink}>
                  {t("navPageGoButton")} <ArrowRightOutlined />
                </span>
              </Link>
            </Col>
          ),
        )}
      </Row>

      {/* ── Map + departments ── */}
      <Row gutter={[16, 16]} align="stretch">
        <Col xs={24} lg={14}>
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleGroup}>
                <EnvironmentOutlined className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>{t("navPageMapTitle")}</h2>
              </div>
            </div>
            <div className={styles.mapWrap}>
              <MapComponent height={360} />
            </div>
            <p className={styles.mapHint}>{t("navPageMapHint")}</p>
          </div>
        </Col>

        <Col xs={24} lg={10}>
          <div className={styles.sectionCard} style={{ height: "100%" }}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleGroup}>
                <AppstoreOutlined className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>{t("navPageDepartmentsTitle")}</h2>
              </div>
              {!otdelsLoading && <span className={styles.countBadge}>{otdels.length}</span>}
            </div>

            {otdelsLoading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
                <Spin />
              </div>
            ) : otdels.length === 0 ? (
              <div className={styles.emptyState}>{t("navPageDepartmentsEmpty")}</div>
            ) : (
              <List
                dataSource={otdels}
                style={{ maxHeight: 360, overflowY: "auto" }}
                renderItem={(dep) => (
                  <div className={styles.deptItem}>
                    <div className={styles.deptIcon}>
                      <ApartmentOutlined />
                    </div>
                    <div>
                      <div className={styles.deptName}>{dep.nameOtd}</div>
                      <div className={styles.deptId}>ID: {dep.idOtd}</div>
                    </div>
                  </div>
                )}
              />
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
}
