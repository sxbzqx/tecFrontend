"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Typography,
  Card,
  Space,
  message,
  Popconfirm,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { $api } from "@/api/api";

const { Title } = Typography;
const { TextArea } = Input;

// Тип для фронтенда
interface Post {
  id: number;
  name: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function AdminNewsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [form] = Form.useForm();

  // Запрос списка новостей
  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ["admin-posts"],
    queryFn: async () => (await $api.get("/admin/posts")).data,
  });

  // Мутации
  const mutation = useMutation({
    mutationFn: async (values: any) => {
      if (editingPost) {
        return $api.put(`/admin/posts/${editingPost.id}`, values);
      }
      return $api.post("/admin/posts", values);
    },
    onSuccess: () => {
      message.success(editingPost ? "Новость обновлена" : "Новость создана");
      setIsModalOpen(false);
      form.resetFields();
      setEditingPost(null);
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
    },
  });

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    form.setFieldsValue(post);
    setIsModalOpen(true);
  };

  const deleteMutation = useMutation({
    mutationFn: (id: number) => $api.delete(`/admin/posts/${id}`),
    onSuccess: () => {
      message.success("Новость удалена");
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
    },
  });

  const columns = [
    { title: "Заголовок", dataIndex: "title", key: "title" },
    { title: "Имя/Категория", dataIndex: "name", key: "name" },
    {
      title: "Действия",
      key: "actions",
      render: (_: any, record: Post) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Удалить новость?" onConfirm={() => deleteMutation.mutate(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <Title level={3}>Управление новостями</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingPost(null); form.resetFields(); setIsModalOpen(true); }}>
          Добавить новость
        </Button>
      </div>

      <Card>
        <Table dataSource={posts} columns={columns} rowKey="id" loading={isLoading} />
      </Card>

      <Modal
        title={editingPost ? "Редактировать новость" : "Создать новость"}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical" onFinish={(values) => mutation.mutate(values)}>
          <Form.Item name="name" label="Имя/Категория" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="title" label="Заголовок" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="content" label="Содержание" rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}