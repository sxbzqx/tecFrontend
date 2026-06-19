"use client";

import { Button, Result } from "antd";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
      <Result
        status="404"
        title="404: Страница не найдена"
        subTitle="Страница, которую вы ищете, переехала или удалена."
        extra={
          <Button type="primary" size="large" onClick={() => router.push("/")}>
            На главную
          </Button>
        }
      />
    </div>
  );
}
