# Black Out Fest — сайт фестиваля

Next.js 16 (App Router) + React 19 + TypeScript. Вёрстка по вайрфреймам из Figma: ID фреймов, палитра и структура страниц описаны в [docs/figma-notes.md](docs/figma-notes.md).

## Запуск

```bash
npm install
npm run dev
```

Сайт откроется на http://localhost:3000.

Если PowerShell пишет, что выполнение сценариев отключено, вызывайте `npm.cmd` вместо `npm`.

Другие команды:

- `npm run build` — продакшен-сборка с проверкой типов
- `npm run start` — запуск собранной версии
- `npm run typecheck` — только проверка TypeScript

## Структура

```
src/
  app/
    layout.tsx      шапка, подвал, шрифт Inter, метаданные
    page.tsx        главная страница (Home)
    globals.css     стили и токены палитры «UV Night»
  components/
    SiteHeader.tsx  шапка и мобильное меню
    SiteFooter.tsx  подвал
    NewsletterForm.tsx
    TicketCard.tsx, ProductCard.tsx, OrganizerCard.tsx  карточки
    Countdown.tsx   обратный отсчёт до начала фестиваля
    SectionHead.tsx, Skeleton.tsx, Logo.tsx, Socials.tsx
  lib/
    navigation.ts   ссылки меню, подвала и соцсетей
docs/
  figma-notes.md    заметки по макету
  screens/          скриншоты Home (десктоп и мобильная версия)
```

## Что ещё не готово

- Готова только главная страница. Ссылки на остальные (Tickets, Shop, Gallery и т.д.) пока ведут на 404.
- Дата обратного отсчёта — заглушка (`FESTIVAL_START` в `src/app/page.tsx`).
- Форма подписки и кнопки «Add to cart» ещё никуда не подключены.
- Ссылки на соцсети — заглушки `#` (`src/lib/navigation.ts`).
