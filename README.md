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

## Тестовый сайт

https://alexandrgribinenco.github.io/BlackFestSite/

Собирается и выкладывается на GitHub Pages автоматически после каждого пуша в `main`
(`.github/workflows/deploy.yml`, ход сборки — во вкладке Actions репозитория).
Это статическая версия сайта: workflow передаёт `PAGES_BASE_PATH=/BlackFestSite`, и `next build`
складывает готовые страницы в `out/`. Без этой переменной сборка обычная, для `npm run start`.

## Оплата картой (maib)

План, требования банка и состояние — в [docs/payments-maib.md](docs/payments-maib.md). Коротко:
- серверная часть — `src/server/` и `src/app/api/payments/` (файлы `route.api.ts`). Она работает только на хостинге с сервером: статическая сборка для GitHub Pages её пропускает;
- настройки — в `.env.example`. Пока `NEXT_PUBLIC_PAYMENTS_API_URL` не задан, Checkout имитирует оплату.

## Боевой сайт на хостинге host.md

Node.js в Plesk. Workflow **Build for hosting** (`.github/workflows/hosting.yml`, запускается вручную во вкладке Actions)
собирает сайт с `STANDALONE_BUILD=1` и кладёт готовую сборку в ветку `deploy`, откуда её забирает Plesk Git.
Настройка Plesk, переменные окружения и данные для maib — в [docs/deploy-hostmd.md](docs/deploy-hostmd.md).

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
      gallery/      Gallery: фото площадки, сцена, звук, карта фестиваля
      bar-restaurant/  Bar & Restaurant с меню
      partners/     Partners
      hotels/       Hotels
      shop/         Shop — по новому дизайну со страницы Colors в Figma, свой шрифт заголовков Anton
      legal/[slug]/ шаблон юридических страниц: /legal/terms, privacy, cookies, personal-data
    checkout/       оформление заказа: своя шапка, без подвала
      page.tsx
      checkout.css
      result/       страница возврата после оплаты на maib
    api/payments/   API оплаты maib: создать платёж, callback, статус (только серверная сборка)
    api/health/     служебная проверка хостинга: настройки, связь с maib и почтой, исходящий IP
  server/           серверный код: клиент API maib, расчёт заказа, письмо-подтверждение (SMTP)
  components/
    checkout/       шаги Checkout: CheckoutFlow (состояние и переходы), TicketsStep, SeatsStep,
                    DetailsStep, PaymentStep, DoneStep, OrderSummary, MobileOrderBar и др.
    gallery/        VenueGallery и Lightbox (фото на весь экран), ZoomableMedia (зум и полный экран), EventMap
    bar/            BarMenu (меню с фильтром по категориям), MenuTagBadge
    hotels/         HotelList (фильтр и сортировка), HotelCard
    shop/           ShopCatalog (категории, фильтр, сортировка), ShopProductCard, FestivalPackCard,
                    ProductArt (винил, постер, рамка, журнал — нарисованы в CSS вместо фото)
    PartnerTile.tsx карточка партнёра
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
    bar-menu.ts     меню бара: категории, позиции, метки
    hotels.ts       отели-партнёры
    shop.ts         товары магазина и Festival pack
    company.ts      юридические данные организатора (IDNO, адрес) — требование maib
    payments.ts     оплата из браузера: старт платежа и статус
    links.ts        внешние ссылки открываются в новой вкладке
docs/
  figma-notes.md    заметки по макету
  payments-maib.md  план подключения оплаты maib
  deploy-hostmd.md  сайт на хостинге host.md: Plesk, Git, Node.js, почта
  screens/          скриншоты Home и Tickets (десктоп и мобильная версия)
public/
  images/coming-soon.svg  исходная временная картинка вместо фото
  images/coming-soon-bg.svg, coming-soon-text.svg  её фон и надпись отдельными слоями:
                          так компонент ComingSoonImage заполняет блок любых пропорций без обрезки текста
```

## Что ещё не готово

- Готовы Home, Tickets, Checkout, Info & FAQ, Contacts, Gallery, Bar & Restaurant, Partners, Hotels, Shop,
  юридические страницы, 404 и баннер cookies. Страницы товара и корзины пока нет: на ссылку корзины в шапке — 404.
- Shop: кнопки «Add to cart», «Buy & download», «Sold out · Notify me» и «Get the pack» пока никуда не подключены,
  товары и цены — заглушки (`src/lib/shop.ts`). Картинки товаров клиент сделает свои.
- Вместо 3D-модели сцены и плана площадки — картинка-заглушка: кнопки зума и полного экрана работают с ней.
- Кнопки «Download map (PDF)», «Download menu (PDF)» и «Partner deck (PDF)» пока никуда не ведут — нет файлов.
- Ссылки на сайты партнёров и отелей — заглушки `#` (`src/app/(site)/partners/page.tsx`, `src/lib/hotels.ts`).
- Меню бара, отели и партнёры — заглушки (`src/lib/bar-menu.ts`, `src/lib/hotels.ts`).
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
