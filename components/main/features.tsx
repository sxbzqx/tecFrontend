"use client"

import { FileTextOutlined, LockOutlined, ReadOutlined, TeamOutlined } from "@ant-design/icons";


const FEATURES = [
  {
    icon: <ReadOutlined />,
    iconBg: "#EEEDFE",
    iconColor: "#3C3489",
    title: "Новости и события",
    desc: "Важные объявления, приказы и новости предприятия в режиме реального времени",
  },
  {
    icon: <TeamOutlined />,
    iconBg: "#E1F5EE",
    iconColor: "#085041",
    title: "Сотрудники",
    desc: "Справочник персонала, контакты отделов и структура предприятия",
  },
  {
    icon: <FileTextOutlined />,
    iconBg: "#FAEEDA",
    iconColor: "#633806",
    title: "Документы",
    desc: "Нормативные акты, инструкции и формы для скачивания и работы",
  },
  {
    icon: <LockOutlined />,
    iconBg: "#E6F1FB",
    iconColor: "#0C447C",
    title: "Личный профиль",
    desc: "Управление данными, настройки и доступ к персональной информации",
  },
];


export default FEATURES;