"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Select,
  Typography,
  Card,
  Alert,
  message,
  Tag,
  Space,
  Input,
} from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { $api } from "@/api/api";
import { User } from "@/types/user";
import { AxiosError } from "axios";

const { Title, Text } = Typography;

const fetchUsers = async () => {
  const response = await $api.get<User[]>("/admin/users");
  return response.data;
};

const updateUserRole = async ({
  userId,
  newRole,
}: {
  userId: string;
  newRole: string;
}) => {
  const response = await $api.put(`/admin/users/${userId}/role`, {
    role: newRole,
  });
  return response.data;
};

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery<User[], Error>({
    queryKey: ["admin-users"],
    queryFn: fetchUsers,
  });

  const mutation = useMutation({
    mutationFn: updateUserRole,
    onSuccess: () => {
      message.success("Роль пользователя успешно обновлена");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      const errorMsg =
        err.response?.data?.message || err.message || "Не удалось изменить роль";
      message.error(`Ошибка: ${errorMsg}`);
    },
  });

  const handleRoleChange = (userId: string, newRole: string) => {
    mutation.mutate({ userId, newRole });
  };

  // Оптимизация: мемоизируем отфильтрованный список, чтобы не пересчитывать его при каждом рендере, 
  // если users или запрос не изменились.
  const filteredUsers = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return users.filter((user) => 
      user.username?.toLowerCase().includes(lowerQuery) || 
      user.email?.toLowerCase().includes(lowerQuery)
    );
  }, [users, searchQuery]);

  const getRoleTagColor = (role: string) => {
    switch (role) {
      case "SuperAdmin":
        return "volcano";
      case "Admin":
        return "gold";
      case "Worker":
        return "blue";
      default:
        return "gray";
    }
  };

  const columns = [
    {
      title: "Логин пользователя",
      dataIndex: "username",
      key: "username",
      render: (text: string) => (
        <Space>
          <UserOutlined style={{ color: "#1890ff" }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) => text || "—",
    },
    {
      title: "Текущая роль",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color={getRoleTagColor(role)} style={{ fontWeight: 500 }}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Действие (Изменить роль)",
      key: "action",
      render: (_: any, record: User) => (
        <Select
          value={record.role}
          style={{ width: 160 }}
          onChange={(value) => handleRoleChange(record.id, value)}
          disabled={mutation.isPending}
        >
          <Select.Option value="Guest">Guest</Select.Option>
          <Select.Option value="Worker">Worker</Select.Option>
          <Select.Option value="Admin">Admin</Select.Option>
        </Select>
      ),
    },
  ];

  if (error) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert
          title="Доступ запрещен или произошла ошибка"
          description="Убедитесь, что вы зашли под учетной записью SuperAdmin и бэкенд возвращает роуты управления ролями (/api/admin/users)."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: "12px" }}>
      <Title level={3} style={{ marginBottom: "6px" }}>
        Панель Главного Администратора (SuperAdmin)
      </Title>
      <Text type="secondary" style={{ display: "block", marginBottom: "24px" }}>
        Здесь вы можете повышать или понижать уровни доступа сотрудников ТЭЦ.
        Изменения вступают в силу немедленно.
      </Text>

      {/* Поиск */}
      <Card size="small" style={{ marginBottom: "20px", borderRadius: "8px" }}>
        <div style={{ maxWidth: 400 }}>
          <Text strong style={{ display: "block", marginBottom: 6 }}>
            Поиск учетной записи:
          </Text>
          <Input
            placeholder="Введите логин или email..."
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </Card>

      {/* Таблица пользователей */}
      <Card
        variant="borderless"
        style={{
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          borderRadius: "12px",
        }}
      >
        <Table
          dataSource={filteredUsers}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10, placement: ["bottomCenter"] }}
        />
      </Card>
    </div>
  );
}
