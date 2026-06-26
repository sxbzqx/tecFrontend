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
      {
        key: "/admin/users",
        label: "Управление ролями",
        roles: ["SuperAdmin"],
      },
      {
        key: "/admin/news",
        label: "Управление новостями",
        roles: ["SuperAdmin", "Admin"],
      },
    ],
  },
  {
    key: "workers",
    label: "Сотрудники",
    roles: ["SuperAdmin", "Admin", "Worker"],
    children: [
      {
        key: "/otdels",
        label: "Отделы",
        roles: ["SuperAdmin", "Admin", "Worker"],
      },
      {
        key: "/workers",
        label: "Список сотрудников",
        roles: ["SuperAdmin", "Admin"],
      },
    ],
  },
  {
    key: "docs-sub",
    label: "Бланки",
    roles: ["Admin", "SuperAdmin", "Worker"],
    children: DOC_FILES.map((file) => ({
      ...file,
      isDownload: true,
    })),
  },
  {
    key: "bids-sub",
    label: "Заявки",
    roles: ["Admin", "SuperAdmin"],
    children: [
      { key: "/bids/create", label: "Создать", roles: ["Admin", "SuperAdmin"] },
      {
        key: "/documents",
        label: "Архив заявок",
        roles: ["Admin", "SuperAdmin"],
      },
    ],
  },
];
