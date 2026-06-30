"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { $api } from "@/app/api/api"; // Используем ваш axios инстанс
import { Typography, Spin, Table, Select, Button, Space, message, Row, Col } from "antd";
import { PrinterOutlined, ReloadOutlined } from "@ant-design/icons";
import { Document } from "@/types/document";

const { Title, Text } = Typography;

export default function DocumentsPage() {
  const [year, setYear] = useState<number>(2024);
  const [month, setMonth] = useState<number>(3);

  const { data: documents, isLoading, isError, refetch } = useQuery({
    queryKey: ["documents", year, month],
    queryFn: async () => {
      const response = await $api.get(`/documents/${year}/${month}`);
      return response.data as Document[];
    },
  });

  const handlePrint = () => {
    window.print();
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Отправитель", dataIndex: "idUser", key: "idUser", render: (id: number) => `Пользователь #${id}` },
    { title: "Получатель", dataIndex: "idReceiver", key: "idReceiver", render: (id: number) => `Пользователь #${id}` },
    { title: "Ресурс", dataIndex: "idResource", key: "idResource", render: (id: number) => `Ресурс ${id}` },
    { title: "Кол-во", dataIndex: "amount", key: "amount" },
    { title: "Комментарий", dataIndex: "comment", key: "comment", render: (text: string) => text || "—" },
    { title: "Дата подачи", dataIndex: "dateFirst", key: "dateFirst", render: (date: string) => new Date(date).toLocaleString() },
    { 
      title: "Статус", 
      dataIndex: "made", 
      key: "made", 
      render: (made: number) => (
        made === 1 
          ? <span style={{ color: 'green', fontWeight: 'bold' }}>Выполнено</span> 
          : <span style={{ color: 'orange' }}>В обработке</span>
      ) 
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {/* Стили для печати остаются те же */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>

      <Title level={2}>Архив заявок</Title>

      <div className="no-print" style={{ marginBottom: 24 }}>
        <Space size="middle">
          <Select value={year} onChange={setYear} style={{ width: 120 }}>
            {[2024, 2025, 2026].map(y => <Select.Option key={y} value={y}>{y}</Select.Option>)}
          </Select>
          <Select value={month} onChange={setMonth} style={{ width: 120 }}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <Select.Option key={m} value={m}>{m.toString().padStart(2, '0')}</Select.Option>
            ))}
          </Select>
          <Button icon={<PrinterOutlined />} onClick={handlePrint} disabled={!documents || documents.length === 0}>
            Распечатать
          </Button>
        </Space>
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: 50 }}><Spin size="large" /></div>
      ) : isError ? (
        <div style={{ textAlign: "center" }}>
          <Text type="danger">Ошибка загрузки документов</Text>
          <br />
          <Button icon={<ReloadOutlined />} onClick={() => refetch()} style={{ marginTop: 10 }}>Повторить</Button>
        </div>
      ) : (
        <Table 
          dataSource={documents} 
          columns={columns} 
          rowKey="id" 
          pagination={false} 
        />
      )}
    </div>
  );
}