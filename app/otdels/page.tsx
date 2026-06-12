"use client";
import { Table, Tag, Typography } from "antd";
import { useDepartments } from "@/hooks/useDepartments";

const { Title } = Typography;

export default function DepartmentsList() {
  const { data, isLoading, error } = useDepartments();

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "Название", dataIndex: "nameOtd", key: "nameOtd" },
    { 
      title: "ID Отдела (C#)", 
      dataIndex: "idOtd", 
      key: "idOtd",
      render: (val: number) => <Tag color="blue">{val}</Tag> 
    },
    { title: "ID Департамента", dataIndex: "idDep", key: "idDep" },
    { 
      title: "ID Бухгалтера", 
      dataIndex: "idOtdBuhgalter", 
      key: "idOtdBuhgalter",
      render: (val: any) => val || "—" 
    },
  ];

  if (error) return <div>Ошибка загрузки</div>;

  return (
    <div style={{ padding: "24px" }}>
      <Title level={3}>Список отделов</Title>
      <Table 
        columns={columns} 
        dataSource={data} 
        loading={isLoading} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
}