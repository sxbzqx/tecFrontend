"use client";

import React, { useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Layout, Menu, Button, Space, Tag, Segmented, Tooltip } from "antd";
import { BulbOutlined, BulbFilled } from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import { useThemeMode } from "@/context/ThemeContext";
import { useLocale } from "@/context/LocaleContext";
import { NAV_LINKS } from "@/constants/navLinks";
import Link from "next/link";
import type { MenuProps } from "antd";

const { Header } = Layout;

const findItemByKey = (items: any[], key: string): any => {
  for (const item of items) {
    if (item.key === key) return item;
    if (item.children) {
      const found = findItemByKey(item.children, key);
      if (found) return found;
    }
  }
  return null;
};

const prepareMenuItems = (links: any[], userRole: string, locale: string): any[] => {
  return links
    .filter((link) => !link.roles || link.roles.includes(userRole))
    .map(({ isDownload, roles, children, label, labelKg, ...rest }) => ({
      ...rest,
      label: locale === "kg" && labelKg ? labelKg : label,
      children: children ? prepareMenuItems(children, userRole, locale) : undefined,
    }));
};

export default function Navbar() {
  const { auth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { mode, toggleTheme } = useThemeMode();
  const { locale, setLocale, t } = useLocale();

  const menuItems = useMemo(
    () => prepareMenuItems(NAV_LINKS, auth.role, locale),
    [auth.role, locale],
  );

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const item = findItemByKey(NAV_LINKS, e.key);

    if (item?.isDownload) {
      const link = document.createElement("a");
      link.href = e.key;
      link.download = item.label || "download";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (e.key.startsWith("/")) {
      router.push(e.key);
    }
  };

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        padding: 0,
        margin: 0,
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 2px 16px rgba(15, 11, 40, 0.18)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginLeft: 24,
          marginRight: 32,
          cursor: "pointer",
          flexShrink: 0,
        }}
        onClick={() => router.push("/")}
      >
        <span style={{ fontWeight: 700, color: "#fff", fontSize: 16, letterSpacing: "-0.2px" }}>
          МП Бишкек ТЭЦ
        </span>
      </div>

      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ flex: 1, minWidth: 0, borderBottom: "none", background: "transparent" }}
      />

      <Space size={20} style={{ marginRight: 24, flexShrink: 0 }}>
        <Space size={10}>
          <Segmented
            size="small"
            value={locale}
            onChange={(value) => setLocale(value as "ru" | "kg")}
            options={[
              { label: "RU", value: "ru" },
              { label: "KG", value: "kg" },
            ]}
            aria-label={t("langSwitchLabel")}
          />
          <Tooltip title={mode === "dark" ? t("themeToggleToLight") : t("themeToggleToDark")}>
            <Button
              type="text"
              onClick={toggleTheme}
              icon={
                mode === "dark" ? (
                  <BulbFilled style={{ color: "#facc15" }} />
                ) : (
                  <BulbOutlined style={{ color: "rgba(255,255,255,0.85)" }} />
                )
              }
              aria-label={mode === "dark" ? t("themeToggleToLight") : t("themeToggleToDark")}
            />
          </Tooltip>
        </Space>

        {auth.role !== "Guest" ? (
          <>
            <Space size={8}>
              <Tag color={auth.role === "SuperAdmin" ? "volcano" : "purple"}>{auth.role}</Tag>
              <span style={{ color: "rgba(255,255,255,0.85)" }}>{auth.loginName}</span>
            </Space>
            {pathname === "/profile" ? (
              <Link href="/">
                <Button type="primary">{t("navBackHome")}</Button>
              </Link>
            ) : (
              <Link href="/profile">
                <Button type="primary">{t("navProfile")}</Button>
              </Link>
            )}
          </>
        ) : (
          <Button type="primary" onClick={() => router.push("/login")}>
            {t("navLogin")}
          </Button>
        )}
      </Space>
    </Header>
  );
}
