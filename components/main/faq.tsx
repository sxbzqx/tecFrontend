import React from "react";
import { Collapse } from "antd";
import type { CollapseProps } from "antd";
import styles from "@/components/main/Main.module.css";

const items: CollapseProps["items"] = [
  {
    key: "1",
    label: "Как войти или зарегистрироваться?",
    children: <p>Нажмите на кнопку <a href="/login">Вход</a></p>,
  },
  {
    key: "2",
    label: "Где посмотреть посты или новости?",
    children: <p>Перейдите во вкладку <a href="/news">Новости</a></p>,
  },
  {
    key: "3",
    label: "Куда писать по предложениям по улучшению сайта?",
    children: <p>Писать по поводу улучшения сайта: <a href="/suggestions">Предложка</a></p>,
  },
];

const FAQ: React.FC = () => (
  <div style={{width: "65%", marginTop: "20px"}}>
    <Collapse className={styles.customCollapse} items={items} accordion />
  </div>
);

export default FAQ;
