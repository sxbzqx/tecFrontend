"use client";

import { Layout, Typography } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function FooterWrapper() {
  return (
    <Layout.Footer
      style={{
        padding: "20px 32px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          maxWidth: 1320,
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              background: "rgba(255,255,255,0.1)",
              color: "#A89FE8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
            }}
          >
            <ThunderboltOutlined />
          </span>
          <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 500 }}>
            МП Бишкек ТЭЦ
          </Text>
        </div>

        <Text style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
          Система управления ТЭЦ г. Бишкек © {new Date().getFullYear()}
        </Text>
      </div>
    </Layout.Footer>
  );
}