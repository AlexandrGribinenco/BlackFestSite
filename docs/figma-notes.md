# Black Out Fest — заметки по макету Figma

Файл: https://www.figma.com/design/1dgclUhHhFy0h0mNPta1ul/Black-Out-Fest-%E2%80%94-Wireframes
File key: `1dgclUhHhFy0h0mNPta1ul`

Это вайрфреймы: вместо контента плейсхолдеры (`[PRICE]`, `[DATE]`, серые полосы-«скелетоны», боксы «Photo/Logo»).
Макет сгенерирован из HTML (в слоях видны `html1 / body1 / dc-root / sc-host`), поэтому структура близка к вёрстке.

Чтобы открыть любой узел в браузере и приблизить его, достаточно ссылки
`…/Black-Out-Fest-%E2%80%94-Wireframes?node-id=<id с дефисом>`, например `node-id=2-3446`.
Запросы MCP при этом не расходуются.

## Страницы и фреймы

### 01 · Desktop (1440 px)
| Фрейм | ID |
|---|---|
| D1 · Home | `1:2` (контент — Group `2:3446`, Footer `2:3447`) |
| D2 · Tickets | `2:2` |
| D3 · Checkout (steps 1–5) | `2:518` |
| D4 · Gallery | `2:1880` |
| D5 · Info & FAQ | `2:6223` |
| D6 · Contacts | `2:2749` |
| D7 · Legal page (template) | `2:3016` |
| D8 · States — cookies, 404, errors | `2:3565` |
| D9 · E-mail + PDF ticket | `2:3738` |
| D10 · Shop | `2:3910` |
| D11 · Product page | `2:4427` |
| D12 · Cart + shop checkout | `2:4805` |
| D13 · Bar & Restaurant | `179:2` |
| D14 · Partners | `179:1617` |
| D15 · Hotels | `179:2658` |
| 02 · UV Night (палитра) | `53:837` |

### 02 · Mobile (390 px)
| Фрейм | ID |
|---|---|
| M1 · Home | `2:7604` |
| M2 · Menu open | `2:8622` |
| M3 · Tickets | `3:9151` |
| M4.1–M4.5 · Checkout (Tickets, Seats, Details, Payment, Done) | `51:351`, `51:418`, `51:469`, `51:520`, `51:574` |
| M5 · Gallery | `3:10546` |
| M6 · Info & FAQ | `3:10899` |
| M7 · Contacts | `3:11262` |
| M8 · Legal + cookie banner | `3:11516` |
| M9 · Shop | `3:11696` |
| M10 · Product page | `3:12030` |
| M11 · Cart + checkout | `3:12334` |
| M12 · Bar & Restaurant | `179:778` |
| M13 · Partners | `179:2145` |
| M14 · Hotels | `179:3281` |

### 03 · Components
| Компонент | ID |
|---|---|
| Header · desktop (1440×80) | `1:481` |
| Header · mobile | `1:813` |
| Footer · desktop | `1:633` |
| Footer · mobile | `1:838` |
| Order summary | `1:751` |

### 04 · Colors
Очищена владельцем, не используется.

## Палитра «UV Night» (используется во всех вайрфреймах)
| Токен | Hex | Где |
|---|---|---|
| Background | `#0B0714` | фон страницы |
| Surface | `#171026` | полосы секций, карточки |
| Line | `#2C2245` | рамки, разделители, скелетоны; фон футера |
| Text | `#F4F0FF` | заголовки, текст |
| Muted | `#9A8FB3` | вторичный текст, подписи |
| Accent | `#8A3FFC` | кнопки, ссылки, активные состояния |
| On accent | `#FFFFFF` | текст на кнопках |
| Hot magenta | `#FF2E93` | бейджи, eyebrow в hero, счётчик корзины |

Hex-коды прочитаны со скриншота и сверены по пикселям. Расхождение возможно на ±1–2 единицы.

## Типографика и сетка (оценка по скриншотам)
- Шрифт похож на Inter.
- H1 (hero): ~64px, uppercase, 700, межстрочный ~93px.
- H2 секций: ~36px / 700. Малые H2 (Partners): ~24px.
- Карточка билета: заголовок ~20px / 600, цена ~28px / 700.
- Eyebrow: 11–12px uppercase, muted (в hero — magenta).
- Контейнер: 1440, поля 48 → контент 1344. Mobile: 390, поля 16.
- Шапка: высота 80px; LOGO-бокс ~152×44; кнопка Buy tickets ~134×44.

## Home: секции сверху вниз (desktop / mobile)
1. Header: LOGO, 7 ссылок, корзина с бейджем, Buy tickets. Mobile: LOGO, Tickets, корзина, бургер. Открытое меню: M2.
2. Hero: постер 3:4 (520×693) + текст (591px): eyebrow, H1, мета, 3 скелетона, обратный отсчёт (4 бокса), Buy tickets / Event info / «From [PRICE]».
3. Tickets (фон Surface): 3 карточки (Early bird — Sold out, Phase 1 GA, Phase 1 VIP). Mobile: горизонтальный свайп.
4. Official shop: 4 товара (фото, бейдж New/Pre-order, название, цена, цвета, Add to cart). Mobile: сетка 2×2 без кнопок.
5. The experience: 4 плитки 2×2 (The concept, Stage & sound, Bar & restaurant, Camping & parking). Mobile: в колонку.
6. Gallery: 5 плиток (Venue, Venue, 3D stage, Sound, Event map) + промо-видео 16:9. Mobile: 2×2.
7. Partners & sponsors: 6 логотипов + карточка For brands с акцентной рамкой. Mobile: логотипы 3×2, карточка ниже.
8. By the organizer (фон Surface): «More from View Bar», 2 карточки (Weekly events, Bar & Restaurant).
9. Footer (фон Line): подписка на рассылку, 4 колонки (бренд, Festival, Legal, Follow us), способы оплаты, копирайт.

## Бюджет MCP
Аккаунт Figma на тарифе Starter, лимит около 20 запросов MCP в месяц. Home сверстан без запросов MCP.
