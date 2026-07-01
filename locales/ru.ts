export const ru = {
  // Navbar
  navLogin: "Вход",
  navProfile: "Профиль",
  navBackHome: "На главную",
  themeToggleToLight: "Светлая тема",
  themeToggleToDark: "Тёмная тема",
  langSwitchLabel: "Язык интерфейса",

  // Footer
  footerSubtitle: "Система управления инфраструктурой",
  footerHistory: "История",
  footerSectionsTitle: "Основные разделы",
  footerReports: "Отчеты",
  footerAbout: "О системе",
  footerContacts: "Контакты",
  footerMapData: "Данные карты:",
  footerRights: "Все права защищены",

  // /navigation page
  navPageEyebrow: "Навигация",
  navPageTitle: "Куда обратиться и что где искать",
  navPageSubtitle:
    "Краткий обзор всех разделов портала МП Бишкек ТЭЦ — чтобы вы быстро находили нужный инструмент",
  navPageSectionsTitle: "Разделы портала",
  navPageGuestNotice:
    "Часть разделов доступна только после входа в систему. Войдите, чтобы увидеть больше инструментов.",
  navPageMapTitle: "Карта территории ТЭЦ",
  navPageMapHint: "Основные объекты и границы территории станции",
  navPageDepartmentsTitle: "Подразделения",
  navPageDepartmentsEmpty: "Список подразделений пока пуст",
  navPageGoButton: "Перейти",
  navPageRoleAll: "Всем",
  navPageRoleAuth: "Сотрудникам",
  navPageRoleAdmin: "Администраторам",

  // section cards
  secHomeTitle: "Главная панель",
  secHomeDesc: "Дни рождения коллег, новости компании и уведомления — всё в одном месте",
  secNewsTitle: "Новости",
  secNewsDesc: "Актуальные объявления и события предприятия",
  secProfileTitle: "Профиль",
  secProfileDesc: "Личные данные, смена логина и пароля",
  secOtdelsTitle: "Отделы",
  secOtdelsDesc: "Структура подразделений предприятия",
  secWorkersTitle: "Сотрудники",
  secWorkersDesc: "Полный список сотрудников и их данные",
  secBidsTitle: "Архив заявок",
  secBidsDesc: "История поданных заявок",
  secDocsTitle: "Бланки документов",
  secDocsDesc: "Приказы, заявления и типовые бланки для скачивания",
  secAdminUsersTitle: "Управление ролями",
  secAdminUsersDesc: "Назначение прав доступа сотрудникам",
  secAdminNewsTitle: "Управление новостями",
  secAdminNewsDesc: "Публикация и редактирование новостей",
  secMapTitle: "Карта ТЭЦ",
  secMapDesc: "Интерактивная карта территории станции",
} as const;

export type TranslationKey = keyof typeof ru;
