"use client"

import { MessageOutlined, ReadOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";

const QUICK_LINKS = [
  { icon: <ReadOutlined />, iconBg: "#EEEDFE", iconColor: "#3C3489", title: "Новости", sub: "Лента событий", href: "/news" },
  { icon: <TeamOutlined />, iconBg: "#E1F5EE", iconColor: "#085041", title: "Сотрудники", sub: "Справочник", href: "/workers" },
  { icon: <MessageOutlined />, iconBg: "#FAEEDA", iconColor: "#633806", title: "Предложения", sub: "Обратная связь", href: "/suggestions" },
  { icon: <UserOutlined />, iconBg: "#E6F1FB", iconColor: "#0C447C", title: "Профиль", sub: "Мои данные", href: "/profile" },
];

export default QUICK_LINKS;