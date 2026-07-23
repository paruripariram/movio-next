# Movio

<p align="left">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Auth.js-v5-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Auth.js v5" />
  <img src="https://img.shields.io/badge/Firebase-12.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase 12" />
  <img src="https://img.shields.io/badge/TMDB_API-v3-01b4e4?style=for-the-badge&logo=themoviedb&logoColor=white" alt="TMDB API" />
</p>

Веб-приложение для отслеживания и коллекционирования фильмов и сериалов. Синхронизирует данные пользователей с Firebase Firestore, использует Auth.js v5 для авторизации и TMDB API в качестве основного источника данных.

🔗 **Live Demo:** [movio-next.vercel.app](https://movio-next.vercel.app)

---

## Скриншоты

| Главная страница | Детали проекта |
| :---: | :---: |
| ![Home](./public/screenshots/home.png) | ![Details](./public/screenshots/details.png) |

| Личная коллекция | Аналитика |
| :---: | :---: |
| ![Collection](./public/screenshots/collection.png) | ![Analytics](./public/screenshots/analytics.png) |

---

## Функционал

- **Каталог & Поиск:** Интеграция с TMDB API (актуальная база фильмов, сериалов, актёров).
- **Коллекции:** Группировка проектов по статусам («Просмотрено», «В планах»).
- **Платформы:** Фиксация сервиса, на котором был просмотрен конкретный проект.
- **Аналитика:** Визуализация статистики просмотров и предпочтений на Recharts.
- **Аутентификация:** Защита роутов и сессии через Auth.js v5 (NextAuth) + bcryptjs.
- **UI/UX:** Адаптивный тёмный интерфейс, плавная анимация на Framer Motion, свайпер на Embla Carousel и тосты Sonner.

---

## Стек технологий

* **Core:** Next.js 16 (App Router), React 19, TypeScript
* **Auth & DB:** Auth.js v5 (`next-auth`), Firebase Firestore, Bcryptjs
* **State & Validation:** Zustand 5, Zod 4
* **UI & Styling:** Tailwind CSS 4, Framer Motion 12, Embla Carousel, Recharts, Lucide Icons, Sonner

---

## Локальный запуск

1. **Клонировать репозиторий:**
   ```bash
   git clone [https://github.com/your-username/movio-next.git](https://github.com/your-username/movio-next.git)
   cd movio-next