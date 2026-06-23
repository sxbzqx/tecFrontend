"use client";

import React from "react";
import { Result, Button } from "antd";
import { useRouter } from "next/navigation";

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" }}>
      <Result
        status="403"
        title="403: Доступ ограничен"
        subTitle="У вашей учетной записи сотрудника ТЭЦ нет прав для просмотра этого раздела. Если есть, то перезайдите в систему и попробуйте снова."
        extra={
          <Button type="primary" size="large" onClick={() => router.push("/")} style={{ backgroundColor: "#0d47a1" }}>
            На главную
          </Button>
        }
      />
    </div>
  );
}