"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { $api } from "@/app/api/api";
import { Biznesplan } from "@/types/biznesplan";
import { Spin, Alert, Table, Input, Select, Typography, Space } from "antd";

const { Title } = Typography;
const { Option } = Select;

export default function BusinessPlansList() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // 1. React Query запрос
  const { data: plans = [], isLoading, error } = useQuery({
    queryKey: ["biznesplans"],
    queryFn: async () => {
      const response = await $api.get("/biznesplan");
      return response.data as Biznesplan[];
    },
  });

  // 2. Мемоизация фильтров
  const uniqueYears = useMemo(() => 
    Array.from(new Set(plans.map((p) => p.year.trim()))).filter(Boolean).sort((a, b) => b.localeCompare(a)),
    [plans]
  );

  const uniqueTypes = useMemo(() => 
    Array.from(new Set(plans.map((p) => p.typeBp.trim()))).filter(Boolean).sort(),
    [plans]
  );

  // 3. Логика фильтрации
  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const matchesSearch = plan.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ?? true;
      const matchesYear = selectedYear ? plan.year.trim() === selectedYear : true;
      const matchesType = selectedType ? plan.typeBp.trim() === selectedType : true;
      return matchesSearch && matchesYear && matchesType;
    });
  }, [plans, searchQuery, selectedYear, selectedType]);

  // Сброс страницы при изменении фильтров
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedYear, selectedType]);

  const currentPlans = filteredPlans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);

  // 4. Отработка состояний
  if (isLoading) return <div style={{ padding: 50, textAlign: "center" }}><Spin size="large" /></div>;
  if (error) return <Alert message="Ошибка загрузки" description={(error as Error).message} type="error" showIcon />;

  return (
    <div style={{ padding: "24px", backgroundColor: "#f4f6f8"}}>
      <Title level={2}>Реестр бизнес-планов</Title>

      {/* Панель фильтров */}
      <Space wrap style={{ marginBottom: 24, padding: 16, background: "#fff", borderRadius: 8 }}>
        <Input 
          placeholder="Поиск по комментарию..." 
          onChange={(e) => setSearchQuery(e.target.value)} 
          style={{ width: 250 }} 
        />
        <Select placeholder="Год" allowClear onChange={setSelectedYear} style={{ width: 120 }}>
          {uniqueYears.map(y => <Option key={y} value={y}>{y}</Option>)}
        </Select>
        <Select placeholder="Тип БП" allowClear onChange={setSelectedType} style={{ width: 120 }}>
          {uniqueTypes.map(t => <Option key={t} value={t}>{t}</Option>)}
        </Select>
      </Space>

      {/* Таблица */}
      <div style={{ background: "#fff", padding: 16, borderRadius: 8 }}>
        <Table
          dataSource={currentPlans}
          rowKey="id"
          pagination={false}
          columns={[
            { title: "ID", dataIndex: "id" },
            { title: "Год", dataIndex: "year" },
            { title: "Тип", dataIndex: "typeBp" },
            { title: "Комментарий", dataIndex: "comment" },
            { title: "Дата создания", dataIndex: "datecreate", render: (d) => new Date(d).toLocaleString() }
          ]}
        />
        
        {/* Пагинация */}
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Space>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Назад</button>
            <span>{currentPage} из {totalPages || 1}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Вперед</button>
          </Space>
        </div>
      </div>
    </div>
  );
}