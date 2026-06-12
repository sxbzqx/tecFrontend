import { Button, Card } from "antd";
import { BellOutlined } from "@ant-design/icons";
import Link from "next/link";

export const Notifications = () => (
  <Card
    title={
      <div
        style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <BellOutlined style={{ color: "#1677ff" }} />
          Важные новости
        </div>
        <Link href="/news">
          <Button style={{ color: "#1677fa" }}>Открыть</Button>
        </Link>
      </div>
    }
    className="hover-card"
  >
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Link href="/news" style={{ display: "flex", flexDirection: "column", gap: "12px"}}>
        <Card
          size="small"
          title="Инфо-справка"
          style={{ borderLeft: "4px solid #1677ff" }}
        >
          Новость
        </Card>
        <Card
          size="small"
          title="Инфо-справка"
          style={{ borderLeft: "4px solid #64748b" }}
        >
          Новость
        </Card>
      </Link>
    </div>
  </Card>
);
