"use client";

import { Layout, Typography, Space } from "antd";
import {
  ThunderboltOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  ContactsOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Text } = Typography;

export default function FooterWrapper() {
  return (
    <Layout.Footer
      style={{
        padding: "30px 50px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        background: "#001529",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          // gap: 30,
          maxWidth: 1440,
          margin: "0 auto",
        }}
      >
        {/* Блок 1: Логотип и Название */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* <span
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "rgba(255,255,255,0.1)",
              color: "#A89FE8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            <ThunderboltOutlined />
          </span> */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Text style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>
              МП Бишкек ТЭЦ
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.45)", fontSize: 11 }}>
              Система управления инфраструктурой
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.65)" }}>
              <Link href="#" style={{ color: "rgba(255,255,255, 0.65)", fontSize: 12 }}>
                История
              </Link>
            </Text>
          </div>
        </div>

        {/* Блок 2: Навигация */}
        <Space vertical size={4}>
          <Text style={{ color: "#fff", fontSize: 12, marginBottom: 5 }}>
            Основные разделы
          </Text>
          <Link
            href="/reports"
            style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}
          >
            <FileTextOutlined /> Отчеты
          </Link>
          <Link
            href="/about"
            style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}
          >
            <InfoCircleOutlined /> О системе
          </Link>
          <Link
            href="/contacts"
            style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}
          >
            <ContactsOutlined /> Контакты
          </Link>
        </Space>

        {/* Блок 3: Копирайт и данные карты */}
        <div style={{ textAlign: "right" }}>
          <Text
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: 12,
              display: "block",
            }}
          >
            © {new Date().getFullYear()} Бишкек ТЭЦ
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.45)", fontSize: 11 }}>
            Данные карты:{" "}
            <Link
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#A89FE8" }}
            >
              OpenStreetMap
            </Link>
          </Text>
        </div>
      </div>
    </Layout.Footer>
  );
}
