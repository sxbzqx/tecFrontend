"use client";

import React, { useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Layout, Menu, Button, Space, Tag } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { authService } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import { NAV_LINKS } from "@/constants/navLinks";
import Link from "next/link";
import type { MenuProps } from "antd";

const { Header } = Layout;

// Рекурсивный поиск объекта элемента по ключу
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

// Подготовка элементов меню
const prepareMenuItems = (links: any[], userRole: string): any[] => {
  return links
    .filter((link) => !link.roles || link.roles.includes(userRole))
    .map(({ isDownload, roles, children, ...rest }) => ({
      ...rest,
      children: children ? prepareMenuItems(children, userRole) : undefined,
    }));
};

export default function Navbar() {
  const { auth, isMounted, refreshAuth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Мемоизируем меню, чтобы не пересчитывать при каждом рендере
  const menuItems = useMemo(
    () => prepareMenuItems(NAV_LINKS, auth.role),
    [auth.role],
  );

  const handleLogout = async () => {
    await authService.logout();
    await refreshAuth();
    router.push("/login");
  };

  // Обработчик клика меню
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const item = findItemByKey(NAV_LINKS, e.key);

    if (item?.isDownload) {
      const link = document.createElement("a");
      link.href = e.key;
      link.download = item.label || "download";
      link.target = "_blank"; // Безопаснее для скачивания
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
        backgroundColor: "#001529",
        // borderBottom: "2px solid #000",
        padding: 0,
        margin: 0,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        position: "relative",
      }}
    >
      <div
        style={{
          marginRight: "32px",
          cursor: "pointer",
          fontWeight: 800,
          color: "#fff",
          fontSize: "18px",
          marginLeft: "24px",
        }}
        onClick={() => router.push("/")}
      >
        МП Бишкек ТЭЦ
      </div>

      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{
          flex: 1,
          borderBottom: "none",
          backgroundColor: "transparent",
        }}
      />

      <Space style={{ marginRight: "24px" }}>
        {auth.role !== "Guest" ? (
          <>
            <Tag color={auth.role === "SuperAdmin" ? "volcano" : "blue"}>
              {auth.role}
            </Tag>
            <span style={{ color: "rgba(255, 255, 255, 0.85)" }}>
              {auth.loginName}
            </span>
            {pathname === "/profile" ? (
              <Link href="/">
                <Button type="primary">На главную</Button>
              </Link>
            ) : (
              <Link href="/profile">
                <Button type="primary">Профиль</Button>
              </Link>
            )}
          </>
        ) : (
          <Button type="primary" onClick={() => router.push("/login")}>
            Вход
          </Button>
        )}
      </Space>
    </Header>
  );
}
