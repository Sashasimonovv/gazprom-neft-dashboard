# Дешборд курсов валют

Веб-приложение: динамика курсов USD, EUR и CNY к рублю по дням. Стек: React, TypeScript, [Apache ECharts](https://echarts.apache.org/), [Consta UI Kit](https://consta.design/libs/uikit). Макет: [Figma](https://www.figma.com/file/CppcOcor3NP1BfrppRgd4a/Test?node-id=0%3A1&mode=dev).

## Запуск

```bash
npm install
npm start
```

Продакшен-сборка:

```bash
npm run build
```

## Данные

По умолчанию используются статические ряды из `src/data/data.ts`.

Опционально можно подключить свой API через переменную в `.env.local` (см. `.env.example`):

```env
REACT_APP_RATES_API_URL=https://your-api.example/v1/rates
```

Ожидается JSON-массив объектов с полем `date` (`YYYY-MM-DD`) и курсами: вложенный объект `rates` с ключами `USD`, `EUR`, `CNY` или плоские поля `usd`/`eur`/`cny` (регистр ключей поддерживается).

## Структура проекта

| Путь | Назначение |
|------|------------|
| `src/features/dashboard/DashboardPage.tsx` | Страница дешборда |
| `src/features/dashboard/chartOption.ts` | Конфигурация графика ECharts |
| `src/data/data.ts` | Локальные данные |
| `src/api/fetchRates.ts` | Загрузка с API |
| `src/types/rates.ts` | Типы данных |
| `src/Echarts/ReactECharts.tsx` | Обёртка над ECharts |

## Описание реализации

Структура кода и принятые решения: [`README_REPORT.md`](./README_REPORT.md).
