"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Typography,
  Card,
  Space,
  Popconfirm,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { $api } from "@/app/api/api";
import { Post } from "@/types/post";

import { App } from "antd";

const { Title } = Typography;
const { TextArea } = Input;

export default function AdminNewsPage() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [form] = Form.useForm();

  // 1. Запрос постов
  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ["admin-posts"],
    queryFn: async () => (await $api.get("/admin/posts")).data,
  });

  // 2. Запрос категорий для выпадающего списка
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await $api.get("/categories")).data,
  });

  // 3. Мутация для создания/обновления
  const mutation = useMutation({
    mutationFn: async (values: any) => {
      if (editingPost) {
        return $api.put(`/admin/posts/${editingPost.id}`, values);
      }
      return $api.post("/admin/posts", values);
    },
    onSuccess: () => {
      message.success(editingPost ? "Обновлено" : "Создано");
      setIsModalOpen(false);
      form.resetFields();
      setEditingPost(null);
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
    },
  });

  // 4. Мутация для удаления
  const deleteMutation = useMutation({
    mutationFn: (id: number) => $api.delete(`/admin/posts/${id}`),
    onSuccess: () => {
      message.success("Удалено");
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
    },
  });

  const columns = [
    { title: "Заголовок", dataIndex: "title", key: "title" },
    {
      title: "Категория",
      dataIndex: "category",
      key: "category",
      render: (cat: any) => cat?.name || "Без категории",
    },
    {
      title: "Действия",
      key: "actions",
      render: (_: any, record: Post) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingPost(record);
              form.setFieldsValue({
                ...record,
                categoryId: record.category?.id,
              });
              setIsModalOpen(true);
            }}
          />
          <Popconfirm
            title="Удалить?"
            onConfirm={() => deleteMutation.mutate(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <Title level={3}>Управление новостями</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingPost(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Добавить новость
        </Button>
      </div>

      <Card>
        <Table
          dataSource={posts}
          columns={columns}
          rowKey="id"
          loading={isLoading}
        />
      </Card>

      <Modal
        title={editingPost ? "Редактировать" : "Создать"}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => mutation.mutate(values)}
        >
          {/* ЭТО ПОЛЕ ДОЛЖНО БЫТЬ ОБЯЗАТЕЛЬНО */}
          <Form.Item
            name="name"
            label="Имя автора"
            rules={[{ required: true }]}
          >
            <Input placeholder="Введите имя" />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Категория"
            rules={[{ required: true }]}
          >
            <Select placeholder="Выберите категорию">
              {categories.map((cat: any) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="title"
            label="Заголовок"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="content"
            label="Содержание"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
