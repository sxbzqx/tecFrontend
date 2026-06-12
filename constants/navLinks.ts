import { DOC_FILES } from "./documents";

export const NAV_LINKS = [
  {
    key: "/",
    label: "Главная",
    roles: ["Guest", "Worker", "Admin", "SuperAdmin"],
  },
  {
    key: "/news",
    label: "Новости",
    roles: ["Guest", "Worker", "Admin", "SuperAdmin"],
  },
  {
    key: "admin-sub",
    label: "Администрирование",
    roles: ["SuperAdmin", "Admin"],
    children: [
      { key: "/admin/users", label: "Управление ролями" },
      { key: "/admin/news", label: "Управление новостями" },
      { key: "/documents", label: "Архив заявок" },
      {
        key: "/biznesplan",
        label: "Бизнес-Планы",
      },
    ],
  },
  {
    key: "workers",
    label: "Сотрудники",
    roles: ["SuperAdmin", "Admin"],
    children: [
      { key: "/otdels", label: "Отделы" },
      { key: "/workers", label: "Список сотрудников" },
    ],
  },
  {
    key: "docs-sub",
    label: "Бланки",
    roles: ["Workers", "Admin", "SuperAdmin"],
    children: DOC_FILES.map(file => ({
      ...file,
      isDownload: true
    }))
  },
  {
    key: "bids-sub",
    label: "Заявки",
    roles: ["Admin", "SuperAdmin"],
    children: [
      { key: "/bids/create", label: "Создать"},
      { key: "/bids/incoming", label: "Исходящие"}
    ]
  }
];
