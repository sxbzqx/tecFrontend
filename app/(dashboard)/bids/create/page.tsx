"use client";

import Link from "next/link";

export default function CreateBidsPage() {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          margin: "200px 0"
        }}
      >
        <h1>Cоздать заявку</h1>
        <p>Данный отдел еще в разработке...</p>

        <p>
          Перейти в <Link href="/">главную</Link>
        </p>
      </div>
    </>
  );
}