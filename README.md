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
    layout.tsx      корневой layout: шрифт Inter, метаданные
    globals.css     общие стили и токены палитры «UV Night»
    (site)/         страницы с шапкой и подвалом сайта
      layout.tsx
      page.tsx      главная (Home)
      tickets/      страница Tickets и её стили
    checkout/       оформление заказа: своя шапка, без подвала
      page.tsx
      checkout.css
  components/
    checkout/       шаги Checkout: CheckoutFlow (состояние и переходы), TicketsStep, SeatsStep,
                    DetailsStep, PaymentStep, DoneStep, OrderSummary, MobileOrderBar и др.
    SiteHeader.tsx  шапка и мобильное меню
    SiteFooter.tsx  подвал
    NewsletterForm.tsx
    TicketCard.tsx, ProductCard.tsx, OrganizerCard.tsx            карточки Home
    ReleaseCard.tsx, TicketOptionCard.tsx, AddonCard.tsx, PhaseCard.tsx  карточки Tickets
    Countdown.tsx   обратный отсчёт (до фестиваля, до повышения цены)
    Breadcrumbs.tsx, AdaptiveText.tsx, SectionHead.tsx, Skeleton.tsx, Logo.tsx, Socials.tsx
  lib/
    navigation.ts   ссылки меню, подвала и соцсетей
    event.ts        данные события (дата начала и т.д.)
    checkout.ts     типы билетов, допы, схема мест, правила заказа
docs/
  figma-notes.md    заметки по макету
  screens/          скриншоты Home и Tickets (десктоп и мобильная версия)
public/
  images/coming-soon.svg  исходная временная картинка вместо фото
  images/coming-soon-bg.svg, coming-soon-text.svg  её фон и надпись отдельными слоями:
                          так компонент ComingSoonImage заполняет блок любых пропорций без обрезки текста
```

## Что ещё не готово

- Готовы Home, Tickets и Checkout. Ссылки на остальные страницы (Shop, Gallery, Info и т.д.) пока ведут на 404.
- Даты — заглушки (`src/lib/event.ts`, `PRICE_STEP_AT` в `src/app/(site)/tickets/page.tsx`).
- Checkout — прототип без бэкенда: заказ живёт в памяти браузера, места и занятость — заглушки,
  оплата имитируется (поля карты никуда не отправляются, их нужно заменить полями платёжного провайдера),
  промокоды не работают, «Download PDF» открывает печать билета.
- Форма подписки и кнопки «Add to cart» ещё никуда не подключены.
- Ссылки на соцсети — заглушки `#` (`src/lib/navigation.ts`).
