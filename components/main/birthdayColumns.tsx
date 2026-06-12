import React from "react";
import { Tag } from "antd";
import { GiftOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Worker as IWorker } from "@/types/worker";

export const birthdayColumns: ColumnsType<IWorker> = [
  {
    title: "ФИО",
    dataIndex: "fio",
    key: "fio",
    render: (text) => <span style={{ fontWeight: 600, color: "#1e293b" }}>{text}</span>,
  },
  {
    title: "Должность",
    dataIndex: "doljnost",
    key: "doljnost",
    render: (text) => <span style={{ color: "#64748b" }}>{text}</span>,
  },
  {
    title: "День рождения",
    dataIndex: "dr",
    key: "dr",
    render: (dr) => (
      <span style={{ fontWeight: 500, color: "#0f172a" }}>
        {new Date(dr).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}
      </span>
    ),
  },
  {
    title: "Статус",
    key: "when",
    render: (_, record) => {
      const isToday = new Date().getDate() === new Date(record.dr).getDate();
      return isToday ? (
        <Tag color="gold" icon={<GiftOutlined />}>СЕГОДНЯ</Tag>
      ) : (
        <Tag color="warning">Завтра</Tag>
      );
    },
  },
];