# Iamsainto

Статический сайт-визитка для GitHub Pages. Сторонних клиентских скриптов, аналитики и cookies нет.

## Live-статистика

Workflow `.github/workflows/update-live-stats.yml` раз в час обновляет локальный `live-stats.json`. Если секреты отсутствуют или API недоступны, существующий файл не меняется, а сайт использует ручные значения из `STATS`.

В `Settings → Secrets and variables → Actions` добавьте:

- `YOUTUBE_API_KEY` — ключ YouTube Data API v3 из Google Cloud Console;
- `YOUTUBE_CHANNELS_JSON` — JSON вида `{"Eleganthy":"UC...","Eleganty":"UC..."}`;
- `TWITCH_CLIENT_ID` и `TWITCH_CLIENT_SECRET` — данные приложения из Twitch Developer Console;
- `TWITCH_CHANNELS_JSON` — JSON вида `{"sa1n1o":"123456789","saintique898":"987654321"}`, где значения — broadcaster ID.

YouTube API должен быть включён для проекта ключа. Twitch application access token workflow получает самостоятельно. Если Twitch изменит требования к endpoint followers, понадобится пользовательский токен владельца — это отмечено в TODO ниже.

<!-- TODO: заполнить реальные YouTube channel ID и Twitch broadcaster ID в GitHub Secrets. -->
<!-- TODO: при необходимости добавить refresh-токен владельца Twitch, не помещая его в репозиторий. -->

## PWA

`manifest.webmanifest` и `sw.js` используют относительные пути, поэтому работают в подпапке GitHub Pages `/Iamsainto/`. При изменении набора статики увеличьте `CACHE_VERSION` в `sw.js`.

## Безопасность репозитория

- Секреты хранятся только в GitHub Actions Secrets и не должны попадать в файлы, Issues или логи.
- Для аккаунта владельца нужно включить 2FA и сохранить recovery codes офлайн.
- Для `main` рекомендуется включить branch protection: запрет force-push и удаления, pull request перед изменением, обязательная проверка workflow.
- В настройках репозитория рекомендуется включить secret scanning, push protection и Dependabot alerts, если они доступны для аккаунта.
- Уязвимости следует отправлять приватно по инструкции в `SECURITY.md`.
