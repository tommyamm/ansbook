# StasikHub

Сайт-шпаргалка для подготовки к ЕГЭ по информатике. Здесь собраны шаблоны решений задач разных типов с объяснениями и примерами кода на Python.

🌐 **[stasikhub.ru](https://stasikhub.ru)**

---

## О проекте

StasikHub — это небольшое SPA-приложение, где задачи сгруппированы по типам ЕГЭ. Каждая задача — это отдельный Markdown-файл с условием, пошаговым планом решения и готовым кодом на Python. Поддерживаются математические формулы (KaTeX) и подсветка синтаксиса.

## Стек

- **React 19** + **React Router 7** — роутинг и UI
- **Vite 6** — сборка
- **Tailwind CSS 4** — стилизация
- **Framer Motion** — анимации
- **react-markdown** + **remark-gfm** + **rehype-highlight** — рендеринг Markdown
- **KaTeX** — математические формулы
- **Radix UI** — базовые компоненты (ScrollArea, Separator и др.)
- **tsparticles** — эффект частиц
- **pnpm** — менеджер пакетов

## Структура проекта

```
ansbook/
├── content/                  # Контент задач (Markdown + изображения)
│   ├── type_2/ogurets/
│   ├── type_5/irishka/
│   └── ... и так далее 
├── src/
│   ├── components/
│   │   ├── common/           # ParticleEffect, AnimateCollapse
│   │   ├── layout/           # Header, Sidebar
│   │   ├── markdown/         # MdRender, MdError
│   │   └── ui/               # Button, Card, Badge, Input и др.
│   ├── hooks/
│   │   ├── useTaskLoader.js  # Загрузка Markdown-файлов
│   │   ├── useMobile.js      # Определение мобильного устройства
│   │   └── useMdRender.js    # Рендеринг Markdown
│   ├── pages/
│   │   ├── HomePage.jsx      # Главная страница
│   │   └── TaskView.jsx      # Страница задачи
│   └── App.jsx
├── taskConfig.js             # Список задач и их маршруты
├── vite.config.js
└── package.json
```

## Запуск локально

```bash
# Установка зависимостей
pnpm install

# Режим разработки
pnpm dev

# Сборка для продакшена
pnpm build

# Предпросмотр собранного проекта
pnpm preview
```

## Добавление новой задачи

1. Создайте папку `content/type_<N>/<slug>/`
2. Положите туда `<slug>.md` (и изображения, если нужны)
3. Зарегистрируйте задачу в `taskConfig.js`:

```js
{
    type: 'Тип N',
    tasks: [
        { name: 'Название', slug: 'slug', mdFile: '/content/type_N/slug/slug.md' },
    ],
}
```

## Деплой

Автоматически через GitHub Actions при пуше в ветку `main`. Сборка деплоится на GitHub Pages с кастомным доменом `stasikhub.ru`.

## Контакт

Вопросы и предложения — [@stdoq](https://t.me/stdoq) в Telegram.