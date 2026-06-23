"use client";

import React from "react";
import Link from "next/link";
import { Card, Typography } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface AuthShellProps {
  title: string;
  subtitleText: string;
  subtitleLinkHref: string;
  subtitleLinkText: string;
  children: React.ReactNode;
}

export default function AuthShell({
  title,
  subtitleText,
  subtitleLinkHref,
  subtitleLinkText,
  children,
}: AuthShellProps) {
  return (
    <div
      style={{
        minHeight: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
        background: "linear-gradient(180deg, #faf9ff 0%, #f4f6f8 100%)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              width: 48,
              height: 48,
              margin: "0 auto 12px",
              borderRadius: 12,
              background: "#EEEDFE",
              color: "#534AB7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            <ThunderboltOutlined />
          </div>
          <div style={{ fontWeight: 700, color: "#0f172a" }}>МП Бишкек ТЭЦ</div>
        </div>

        <Card
          variant="borderless"
          style={{ boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)", borderRadius: 16 }}
          styles={{ body: { padding: 32 } }}
        >
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <Title level={3} style={{ margin: 0, fontWeight: 600, letterSpacing: "-0.5px" }}>
              {title}
            </Title>
            <Text type="secondary" style={{ fontSize: 14, marginTop: 8, display: "block" }}>
              {subtitleText}{" "}
              <Link href={subtitleLinkHref} style={{ color: "#534AB7", fontWeight: 500 }}>
                {subtitleLinkText}
              </Link>
            </Text>
          </div>
          {children}
        </Card>
      </div>
    </div>
  );
}