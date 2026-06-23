"use client";
import { Layout } from "antd";

export default function FooterWrapper() {
  return (
    <Layout.Footer
      style={{
        textAlign: "center",
        color: "rgba(255, 255, 255, 0.65)",
        backgroundColor: "#001529",
        borderTop: "2px solid #000",
        padding: "20px 0",
      }}
    >
      Система управления ТЭЦ г. Бишкек © {new Date().getFullYear()}
    </Layout.Footer>
  );
}
