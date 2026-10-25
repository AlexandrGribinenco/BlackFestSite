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
    layout.tsx      корневой layout: шрифт Inter, метаданные, баннер cookies
    globals.css     общие стили и токены палитры «UV Night»
    not-found.tsx   страница 404
    (site)/         страницы с шапкой и подвалом сайта
      layout.tsx
      error.tsx     страница ошибки
      page.tsx      главная (Home)
      tickets/      страница Tickets и её стили
      info/         Info & FAQ
      contacts/     Contacts
      legal/[slug]/ шаблон юридических страниц: /legal/terms, privacy, cookies, personal-data
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
    CookieConsent.tsx  баннер и окно настроек cookies (выбор хранится в localStorage)
    ContactForm.tsx, LegalDocNav.tsx, SectionNav.tsx, FaqList.tsx, StatePanel.tsx, ErrorState.tsx
    Breadcrumbs.tsx, AdaptiveText.tsx, SectionHead.tsx, Skeleton.tsx, Logo.tsx, Socials.tsx
  lib/
    navigation.ts   ссылки меню, подвала и соцсетей
    event.ts        данные события (дата начала и т.д.)
    checkout.ts     типы билетов, допы, схема мест, правила заказа
    legal.ts        список юридических документов и их разделов
docs/
  figma-notes.md    заметки по макету
  screens/          скриншоты Home и Tickets (десктоп и мобильная версия)
public/
  images/coming-soon.svg  исходная временная картинка вместо фото
  images/coming-soon-bg.svg, coming-soon-text.svg  её фон и надпись отдельными слоями:
                          так компонент ComingSoonImage заполняет блок любых пропорций без обрезки текста
```

## Что ещё не готово

- Готовы Home, Tickets, Checkout, Info & FAQ, Contacts, юридические страницы, 404 и баннер cookies.
  Shop, Gallery, Hotels, Bar & Restaurant, Partners и корзина пока ведут на 404.
- Тексты юридических документов, ответы FAQ и контакты — заглушки.
- Форма Contacts не отправляет сообщения (показывает, что форма пока не подключена).
- Выбор cookies сохраняется, но аналитики и рекламы на сайте пока нет — подключать их нужно с учётом этого выбора.
- Ошибку оплаты можно посмотреть, переключив `SIMULATED_PAYMENT_RESULT` в `src/lib/checkout.ts` на `"failure"`.
- Даты — заглушки (`src/lib/event.ts`, `PRICE_STEP_AT` в `src/app/(site)/tickets/page.tsx`).
- Checkout — прототип без бэкенда: заказ живёт в памяти браузера, места и занятость — заглушки,
  оплата имитируется (поля карты никуда не отправляются, их нужно заменить полями платёжного провайдера),
  промокоды не работают, «Download PDF» открывает печать билета.
- Форма подписки и кнопки «Add to cart» ещё никуда не подключены.
- Ссылки на соцсети — заглушки `#` (`src/lib/navigation.ts`).
