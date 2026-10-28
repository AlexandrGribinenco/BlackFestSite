# Сайт на хостинге host.md (Node.js в Plesk)

Боевой сайт с оплатой maib работает на хостинге клиента в host.md. Тестовый сайт на GitHub Pages остаётся как есть.

Что подтвердил host.md:
- Node.js новее 20.9 доступен на любом пакете хостинга;
- в Plesk есть модуль Git;
- IP-адрес хостинга постоянный.

SSH на Shared Hosting нет. Он и не нужен: сайт приходит на хостинг из GitHub, а настраивается в панели Plesk.

**Ещё не ответили:**
- есть ли SSH на Premium Hosting;
- разрешены ли исходящие HTTPS-запросы к `api.maibmerchants.md`. Без них оплата не заработает, и тогда нужен VPS.

## Как это устроено

1. В GitHub, во вкладке Actions, вручную запускается workflow **Build for hosting** (`.github/workflows/hosting.yml`).
2. Он собирает сайт в режиме `standalone`: `server.js`, только нужные `node_modules`, статика и `public/`. Всё это коммитится в ветку `deploy`.
3. Plesk Git забирает ветку `deploy` в папку сайта: сам по вебхуку GitHub или по кнопке.
4. Plesk запускает `server.js` через Node.js (Passenger). В каждой сборке меняется `tmp/restart.txt`, поэтому приложение перезапускается само. Если не перезапустилось — кнопка **Restart App**.

`npm install` на хостинге не нужен. Секреты (ключи maib, пароль почты) хранятся только в Plesk, не в репозитории: репозиторий публичный.

Параметры при запуске workflow:
- **payments**:
  - выключена — Checkout только имитирует оплату, как на тестовом сайте;
  - включена — Checkout создаёт платёж через `/api/payments`. Включать, когда в Plesk есть ключи maib и цены заданы в коде.
- **site_url** — адрес сайта, по умолчанию `https://www.auroraaustralishub.com.md`. Он попадает в превью ссылок, карту сайта и PDF-билеты. Должен совпадать с `SITE_URL` в Plesk.
- **search_engines** — пустить поисковики. Пока выключена, на всех страницах стоит `noindex`, а `robots.txt` закрывает сайт. Включить при запуске, когда на сайте не останется заглушек.

## Настройка в Plesk (один раз)

Пункты меню — по Plesk Obsidian; у host.md названия могут немного отличаться.

**1. Хостинг и домен.**
- Купить хостинг на домен клиента (рекомендация — Premium Hosting).
- Сейчас домен `auroraaustralishub.com.md` не открывается: DNS отвечает ошибкой. Нужно, чтобы host.md привязал его к новому хостингу.
- Сайт можно открыть на поддомене, но тогда это нужно согласовать с maib: в заявке указан `www.auroraaustralishub.com.md`.

**2. HTTPS.**
- SSL/TLS Certificates → Install → Let's Encrypt, для домена и `www`.
- В Hosting Settings включить постоянный редирект 301 с HTTP на HTTPS.

**3. Почта для писем-подтверждений.**
- Mail → Create Email Address: например, `tickets@<домен>`, с надёжным паролем.
- В настройках почты домена включить DKIM и проверить SPF, иначе письма попадут в спам.
- Отправлять почту через сторонние SMTP или сервисы host.md запрещает. Ограничения: 500 писем в час на домен, 20 получателей в письме.

**4. Git.** Websites & Domains → Git → Add Repository:
- Remote Git hosting, URL `https://github.com/alexandrgribinenco/BlackFestSite.git`. Ключ не нужен: репозиторий публичный.
- Ветка `deploy`. Она появится после первого запуска Build for hosting.
- Deployment mode — Automatic, Server path — `/httpdocs`. Перед первым деплоем удалить из `httpdocs` стандартные файлы Plesk.
- Чтобы деплой шёл сам, скопировать Webhook URL из настроек репозитория в Plesk в GitHub: Settings → Webhooks → Add webhook, событие push.

**5. Node.js.** Websites & Domains → Node.js → Enable Node.js:

| Поле | Значение |
|---|---|
| Node.js Version | самая новая из доступных, не ниже 20.9 (лучше 22 или 24) |
| Application Mode | production |
| Application Root | `/httpdocs` |
| Document Root | `/httpdocs/public` |
| Application Startup File | `server.js` |

Кнопка **NPM install** не нужна. После сохранения нажать **Restart App**.

**6. Переменные окружения** — Custom environment variables в той же странице Node.js:

| Переменная | Значение |
|---|---|
| `SITE_URL` | `https://<домен>` |
| `MAIB_PROJECT_ID` | из письма maib (тест) или из Production Project |
| `MAIB_PROJECT_SECRET` | там же |
| `MAIB_SIGNATURE_KEY` | там же |
| `SMTP_HOST` | `mail.<домен>` |
| `SMTP_PORT` | `465` (SSL) или `587` (TLS) |
| `SMTP_USER` | `tickets@<домен>` |
| `SMTP_PASSWORD` | пароль ящика |
| `EMAIL_FROM` | `Black Out Fest <tickets@<домен>>` |

Полный список с пояснениями — в `.env.example`. После изменения переменных — Restart App.

## Проверка после установки

Откройте `https://<домен>/api/health`. Это служебная страница вместо SSH, она показывает:
- какие переменные окружения заполнены (только да или нет, без значений);
- отвечает ли серверу maib (`maib`) и пускает ли почтовый сервер (`smtp`);
- исходящий IP хостинга (`outgoingIp`) — его указывают в Merchant Portal maib;
- версию Node.js и включена ли оплата в сборке (`paymentsInBuild`).

Страница не создаёт платежей и не отправляет писем. Результат обновляется не чаще раза в минуту.

## Данные для maib

- **IP сервера** для Merchant Portal: `outgoingIp` на странице `/api/health`. Сверить с IP в Plesk на странице домена (Hosting Settings).
- **Callback URL**: `https://<домен>/api/payments/callback`.
- **Ok URL** и **Fail URL**: `https://<домен>/checkout/result`.

maib присылает callback со своих серверов 91.250.245.70, 91.250.245.71 и 91.250.245.142. На общем хостинге входящие HTTPS-запросы обычно открыты для всех.

## Обновление сайта

1. GitHub → Actions → Build for hosting → Run workflow. Ветка `main`, нужные значения payments, site_url и search_engines.
2. Через пару минут сборка в ветке `deploy`. Plesk забирает её по вебхуку, или нажать Pull Updates / Deploy в Plesk → Git.
3. Если сайт не обновился — Restart App.

## Если что-то не работает

- **Логи.** Вывод приложения — строки `[payments]` и `[email]` — ищем в логах домена (Websites & Domains → Logs). Если его там нет, спросить host.md, куда пишет Node.js-приложение.
- **Приложение не стартует.** Проверить в Plesk версию Node.js (не ниже 20.9) и Application Startup File (`server.js`). Есть риск, что Passenger не запустит `server.js` из сборки Next.js как есть; тогда понадобится небольшой файл-обёртка.
- **Ограничения хостинга.**
  - Shared: 512 МБ памяти и 50% CPU.
  - Premium: 1024 МБ и 75%.
  - Сайту на Next.js обычно хватает 150–300 МБ.
- **Запасной вариант** — VPS. Он понадобится, если host.md не пускает исходящие запросы к maib, или если Passenger не справится.
