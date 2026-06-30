"use client";

import { Button, Input } from "antd";

export default function SuggestionsPage() {
  return (
    <>
      <h1>Страница предложений</h1>
      <div>
        <Input style={{ width: "320px" }} />
        <Button color="cyan" >Отправить</Button>
      </div>
    </>
  );
}
