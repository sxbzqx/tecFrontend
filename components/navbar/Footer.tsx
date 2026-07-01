"use client";

import { Layout, Typography, Space } from "antd";
import {
  FileTextOutlined,
  InfoCircleOutlined,
  ContactsOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

const { Text } = Typography;

export default function FooterWrapper() {
  const { t } = useLocale();

  return (
    <Layout.Footer
      style={{
        padding: "30px 50px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        background: "var(--header-bg)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          maxWidth: 1440,
          margin: "0 auto",
        }}
      >
        {/* Блок 1: Логотип и Название */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Text style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>
              МП Бишкек ТЭЦ
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.45)", fontSize: 11 }}>
              {t("footerSubtitle")}
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.65)" }}>
              <Link href="#" style={{ color: "rgba(255,255,255, 0.65)", fontSize: 12 }}>
                {t("footerHistory")}
              </Link>
            </Text>
          </div>
        </div>

        {/* Блок 2: Навигация */}
        <Space vertical size={4}>
          <Text style={{ color: "#fff", fontSize: 12, marginBottom: 5 }}>
            {t("footerSectionsTitle")}
          </Text>
          <Link
            href="/navigation"
            style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}
          >
            <FileTextOutlined /> {t("footerReports")}
          </Link>
          <Link
            href="/navigation"
            style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}
          >
            <InfoCircleOutlined /> {t("footerAbout")}
          </Link>
          <Link
            href="/navigation"
            style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}
          >
            <ContactsOutlined /> {t("footerContacts")}
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
            © {new Date().getFullYear()} Бишкек ТЭЦ · {t("footerRights")}
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.45)", fontSize: 11 }}>
            {t("footerMapData")}{" "}
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
