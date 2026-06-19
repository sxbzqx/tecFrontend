"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { $api } from "@/api/api"; // Используем ваш axios инстанс
import { Typography, List, Card, Spin, Flex } from "antd";
import Link from "next/link";

const { Title, Text, Paragraph } = Typography;

export default function NewsPage() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["public-posts"],
    queryFn: async () => (await $api.get("/admin/posts/public")).data,
  });

  if (isLoading)
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px", }}>
      <Title level={2}>Новости ТЭЦ</Title>

      <Flex vertical gap="middle">
        {posts.map((post: any) => (
          <Card
            key={post.id} 
            hoverable
            title={post.title}
          >
            <Paragraph ellipsis={{ rows: 3 }}>{post.content}</Paragraph>
            <Link href={`/news/${post.id}`}>Читать далее</Link>
          </Card>
        ))}
      </Flex>
    </div>
  );
}
