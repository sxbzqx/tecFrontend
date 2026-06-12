"use client";
import { Layout } from "antd";

export default function FooterWrapper() {
  return (
    <Layout.Footer style={{ textAlign: "center", color: "#8c8c8c" }}>
      Система управления ТЭЦ г. Бишкек © {new Date().getFullYear()}
    </Layout.Footer>
  );
}