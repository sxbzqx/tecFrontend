"use client";

import Link from "next/link";
import styles from "@/components/main/Main.module.css";
import Paragraph from "antd/es/typography/Paragraph";

const FAQ_ITEMS = [
  {
    key: "1",
    label: "Как войти в систему?",
    children: (
      <Paragraph className={styles.faqAnswer}>
        Нажмите на <Link href="/login">Вход</Link> в меню и используйте логин, пароль и
        выберите отдел в котором работаете. Если возникли проблемы — обратитесь
        к администратору.
      </Paragraph>
    ),
  },
  {
    key: "2",
    label: "Где посмотреть новости и объявления?",
    children: (
      <Paragraph className={styles.faqAnswer}>
        Перейдите в раздел <Link href="/news">Новости</Link> через верхнее меню.
        Там публикуются все важные объявления, приказы и события предприятия.
      </Paragraph>
    ),
  },
  {
    key: "3",
    label: "Как отправить предложение по улучшению?",
    children: (
      <Paragraph className={styles.faqAnswer}>
        Откройте раздел <Link href="/suggestions">Предложения</Link> в меню.
        Ваше сообщение будет рассмотрено администрацией в ближайшее время.
      </Paragraph>
    ),
  },
  {
    key: "4",
    label: "Как обновить данные профиля?",
    children: (
      <Paragraph className={styles.faqAnswer}>
        Перейдите в <Link href="/profile">Профиль</Link> через кнопку в правом
        верхнем углу. Там можно обновить контактную информацию и настройки
        уведомлений.
      </Paragraph>
    ),
  },
];

export default FAQ_ITEMS;
