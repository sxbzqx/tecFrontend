"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/tecMap/tecMap"), {
  ssr: false,
  loading: () => <p>Загрузка карты...</p>,
});

export default function Page() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        margin: "150px 0",
      }}
    >
      <h1>Карта ТЭЦ</h1>
      <Map />
    </div>
  );
}
