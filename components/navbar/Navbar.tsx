"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Layout, Menu, Button, Space, Tag } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { authService } from "@/api/authService";
import { useAuth } from "@/hooks/useAuth";
import { NAV_LINKS } from "@/constants/navLinks";
import Link from "next/link";

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

const prepareMenuItems = (links: any[], userRole: string): any[] => {
  return links
    .filter((link) => !link.roles || link.roles.includes(userRole))
    .map(({ isDownload, roles, children, ...rest }) => ({
      ...rest,
      children: children ? prepareMenuItems(children, userRole) : undefined,
    }));
};

export default function Navbar() {
  const { auth, isMounted } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await authService.logout(); 
  };

  const menuItems = prepareMenuItems(NAV_LINKS, auth.role);

  return (
    <Header
      style={{ display: "flex", alignItems: "center", backgroundColor: "#fff" }}
    >
      <div
        style={{ marginRight: "32px", cursor: "pointer", fontWeight: 800 }}
        onClick={() => router.push("/")}
      >
        МП Бишкек ТЭЦ
      </div>

      <Menu
        mode="horizontal"
        selectedKeys={[pathname]}
        items={menuItems}
        onClick={(e) => {
          const item = findItemByKey(NAV_LINKS, e.key);

          if (item?.isDownload) {
            const link = document.createElement("a");
            link.href = e.key;
            link.download = item.label;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else if (e.key.startsWith("/")) {
            router.push(e.key);
          }
        }}
        style={{ flex: 1, borderBottom: "none" }}
      />

      <Space>
        {isMounted && auth.role !== "Guest" ? (
          <>
            <Tag color={auth.role === "SuperAdmin" ? "volcano" : "blue"}>
              {auth.role}
            </Tag>
            <span>{auth.loginName}</span>

            {pathname === "/profile" ? (
              <Button
                type="default"
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              >
                Выйти
              </Button>
            ) : (
              <Link href="/profile">
                <Button type="primary" style={{ marginLeft: "30px" }}>
                  Профиль
                </Button>
              </Link>
            )}
          </>
        ) : (
          <Button type="primary" style={{ marginLeft: "30px" }} onClick={() => router.push("/login")}>
            Вход
          </Button>
        )}
      </Space>
    </Header>
  );
}
