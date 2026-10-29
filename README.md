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
Тестовый сайт закрыт от поисковиков (`noindex` и `robots.txt`), чтобы заглушки не попали в поиск.

## SEO

- Адрес сайта и разрешение индексации задаются при сборке (`src/lib/site.ts`):
  - `NEXT_PUBLIC_SITE_URL` — адрес сайта;
  - `NEXT_PUBLIC_INDEXABLE=1` — пустить поисковики, только при запуске.
- У каждой страницы свои заголовок, описание, canonical и превью для соцсетей: `pageMetadata()` в `src/lib/site.ts`.
- Картинка превью `/og.png` рисуется при сборке (`src/app/og.png/route.tsx`).
- Иконки: `public/icon.svg` и `/apple-icon.png` (`src/app/apple-icon.png/route.tsx`). Сейчас это временный значок-«затмение», заменить на логотип, когда он будет.
- Генерируются `robots.txt` и `sitemap.xml` (`src/app/robots.ts`, `src/app/sitemap.ts`).
- Структурированные данные для Google (`src/lib/structured-data.ts`): фестиваль как событие (MusicEvent) и товары с ценой.
  Пока дата, площадка и цены — заглушки, они не выводятся.

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
        [slug]/     страница товара /shop/<id> — по вайрфреймам D11 / M10
      cart/         корзина и оформление заказа мерча (D12 / M11), стили оформления берёт из checkout.css
      legal/[slug]/ шаблон юридических страниц: /legal/terms, privacy, cookies, personal-data
    checkout/       оформление заказа: своя шапка, без подвала
      page.tsx
      checkout.css
      result/       страница возврата после оплаты на maib
    api/payments/   API оплаты maib: создать платёж, callback, статус (только серверная сборка)
    api/health/     служебная проверка хостинга: настройки, связь с maib и почтой, исходящий IP
  server/           серверный код: клиент API maib, расчёт заказа, письмо-подтверждение (SMTP) с PDF-билетами
  components/
    checkout/       шаги Checkout: CheckoutFlow (состояние и переходы), TicketsStep, SeatsStep,
                    DetailsStep, PaymentStep, DoneStep, OrderSummary, MobileOrderBar и др.
    gallery/        VenueGallery и Lightbox (фото на весь экран), ZoomableMedia (зум и полный экран), EventMap
    bar/            BarMenu (меню с фильтром по категориям), MenuTagBadge
    hotels/         HotelList (фильтр и сортировка), HotelCard
    shop/           ShopCatalog (категории, фильтр, сортировка), ShopProductCard, FestivalPackCard,
                    ProductArt (винил, постер, рамка, журнал — нарисованы в CSS вместо фото),
                    ProductDetail (фото и выбор опций на странице товара)
    cart/           ShopCheckout (шаги корзины), CartStep, DeliveryStep, ShopPaymentStep, ShopDoneStep, ShopOrderSummary
    PartnerTile.tsx, PartnerLogo.tsx  карточка партнёра и его логотип
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
    cart.ts         корзина магазина: хранится в localStorage браузера, счётчик в шапке
    legal.ts        список юридических документов и их разделов
    bar-menu.ts     меню бара: категории, позиции, метки
    hotels.ts       отели-партнёры
    partners.ts     партнёры фестиваля для страницы Partners и главной
    shop.ts         товары магазина (описания, опции, цены), способы доставки, Festival pack
    company.ts      юридические данные организатора (IDNO, адрес) — требование maib
    payments.ts     оплата из браузера: старт платежа и статус
    tickets.ts      электронные билеты заказа: по одному на место и на каждый доп
    ticket-pdf.ts   PDF-билеты по макету D9: в браузере (Download PDF) и на сервере (вложение в письмо)
    links.ts        внешние ссылки открываются в новой вкладке
docs/
  figma-notes.md    заметки по макету
  payments-maib.md  план подключения оплаты maib
  deploy-hostmd.md  сайт на хостинге host.md: Plesk, Git, Node.js, почта
  screens/          скриншоты Home и Tickets (десктоп и мобильная версия)
public/
  fonts/            Inter (TTF, лицензия OFL) для PDF-билетов: в стандартных шрифтах PDF нет ș, ț, ă
  images/payments/  официальные логотипы maib и платёжных систем
  images/coming-soon.svg  исходная временная картинка вместо фото
  images/coming-soon-bg.svg, coming-soon-text.svg  её фон и надпись отдельными слоями:
                          так компонент ComingSoonImage заполняет блок любых пропорций без обрезки текста
```

## Что ещё не готово

- Готовы Home, Tickets, Checkout, Info & FAQ, Contacts, Gallery, Bar & Restaurant, Partners, Hotels, Shop,
  страница товара, корзина, юридические страницы, 404 и баннер cookies.
- Shop: товары, описания и цены — заглушки в квадратных скобках (`src/lib/shop.ts`), картинки товаров клиент сделает свои.
  «Sold out · Notify me» и «Get the pack» пока никуда не подключены; промокоды не работают.
- Оплата в корзине пока только имитируется: серверной части для заказов мерча (расчёт с доставкой, адрес для курьера) ещё нет.
  Если на сайте включена оплата maib, корзина показывает, что оплата заказов магазина скоро откроется.
- Вместо 3D-модели сцены и плана площадки — картинка-заглушка: кнопки зума и полного экрана работают с ней.
- Кнопки «Download map (PDF)», «Download menu (PDF)» и «Partner deck (PDF)» пока никуда не ведут — нет файлов.
- Спонсоры — только Red Bull и Absolut Vodka, по просьбе клиента от 29.10 (`src/lib/partners.ts`).
  Логотипы — их словесные знаки с Wikimedia Commons (`public/images/partners/`). Ссылки ведут на главные сайты брендов.
- Ссылки на сайты отелей — заглушки `#` (`src/lib/hotels.ts`).
- Меню бара и отели — заглушки (`src/lib/bar-menu.ts`, `src/lib/hotels.ts`).
- Тексты юридических документов, ответы FAQ и контакты — заглушки.
- Форма Contacts не отправляет сообщения (показывает, что форма пока не подключена).
- Выбор cookies сохраняется, но аналитики и рекламы на сайте пока нет — подключать их нужно с учётом этого выбора.
- Ошибку оплаты можно посмотреть, переключив `SIMULATED_PAYMENT_RESULT` в `src/lib/checkout.ts` на `"failure"`.
- Даты — заглушки (`src/lib/event.ts`, `PRICE_STEP_AT` в `src/app/(site)/tickets/page.tsx`).
- Checkout — прототип без бэкенда: заказ живёт в памяти браузера, места и занятость — заглушки,
  оплата имитируется (поля карты никуда не отправляются, их нужно заменить полями платёжного провайдера),
  промокоды не работают. «Download PDF» собирает PDF-билеты в браузере (`src/lib/ticket-pdf.ts`, макет D9).
- Форма подписки и кнопки «Add to cart» на главной ещё никуда не подключены.
- Ссылки на соцсети — заглушки `#` (`src/lib/navigation.ts`).
