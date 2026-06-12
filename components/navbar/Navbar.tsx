"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Layout, Menu, Button, Space, Tag } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { authService } from "@/api/authService";
import { useAuth } from "@/hooks/useAuth";
import { NAV_LINKS } from "@/constants/navLinks";

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

const prepareMenuItems:any = (links: any[]) => {
  return links.map(({ isDownload, roles, ...rest }) => ({
    ...rest,
    children: rest.children ? prepareMenuItems(rest.children) : undefined,
  }));
};

export default function Navbar() {
  const { auth, isMounted } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await authService.logout();
    Cookies.remove("accessToken");
    window.location.href = "/login";
  };

  // Фильтруем ссылки по ролям
  const filteredLinks = NAV_LINKS.filter((i) => i.roles.includes(auth.role));

  return (
    <Header style={{ display: "flex", alignItems: "center", backgroundColor: "#fff" }}>
      <div 
        style={{ marginRight: "32px", cursor: "pointer", fontWeight: 800 }} 
        onClick={() => router.push("/")}
      >
        МП Бишкек ТЭЦ
      </div>

      <Menu
        mode="horizontal"
        selectedKeys={[pathname]}
        items={prepareMenuItems(filteredLinks)}
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
            <Tag color={auth.role === "SuperAdmin" ? "volcano" : "blue"}>{auth.role}</Tag>
            <span>{auth.loginName}</span>
            <Button type="text" danger icon={<LogoutOutlined />} onClick={handleLogout}>
              Выйти
            </Button>
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