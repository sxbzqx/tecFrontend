# Changelog

Все заметные изменения в этом проекте документируются в этом файле.

![TS](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
<a href="http:localhost:3000">![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)</a>
![Axios](https://img.shields.io/badge/axios-671ddf?&style=for-the-badge&logo=axios&logoColor=white")
![Antd](https://img.shields.io/badge/antd%2Fui-000000?style=for-the-badge&logo=a&logoColor=white)

## [1.0.0] - 2026-05-20

### Added

- **Страницы и компоненты:**
  - Создана страница **Сотрудники** (`/workers`) с выводом списка в виде таблицы.
  - Создана страница **Отделы** (`/otdels`) с возможностью фильтрации.
- **Интеграция с API:** Настроен клиент (Axios/Fetch) для отправки запросов на бэкенд.

## [Unrealeased]

### Planed

- Внедрение Auth-системы.

## [1.0.1] - 2026-05-28

### Added

- **ChatPage**: Локальный чат.
  - `api/chat` - функционал отправки и чтения сообщений.

## [1.0.2] - 2026-05-29

### Added

- **Страницы:**
  - `BiznesplanPage` — Страница Бизнес-планов.
  - `DocumentPage` — Страница с документами заявок за период `2017 – 2026` гг.

## [1.0.3] - 2026-06-01

### Fixed

- Компоненты и Страницы

## [1.0.4] - 2026-06-04

### Added

- **Интеграция Auth-сервис**:
  - config/request files:
    - `utils/api.ts`
    - `api/api.ts`
    - `api/authService.ts`
  - Страницы/Компоненты:
    - `LoginPage`
    - `RegisterPage`

- `middleware` - защита страниц

- **Чат с ИИ**:
  - `api/chat/route.ts`
