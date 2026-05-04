# Дешборд курсов валют

React, [Apache ECharts](https://echarts.apache.org/), [Consta UI Kit](https://consta.design/libs/uikit). Макет: [Figma](https://www.figma.com/file/CppcOcor3NP1BfrppRgd4a/Test?node-id=0%3A1&mode=dev).

## Запуск

```bash
npm install
npm start
```

Сборка:

```bash
npm run build
```

## Переменные окружения

Файл `.env.local` в корне проекта (рядом с `package.json`):

```env
REACT_APP_RATES_API_URL=https://example.mockapi.io/v1/rates
```

Если переменная не задана, используются данные из `src/data/data.ts`.

Ответ API — JSON-массив. Элемент: либо `{ "date": "YYYY-MM-DD", "rates": { "USD", "EUR", "CNY" } }`, либо плоские поля `date` и `usd`/`eur`/`cny` (или `USD`/`EUR`/`CNY`). Шаблон: `.env.example`.

## Структура

| Путь | Назначение |
|------|------------|
| `src/Echarts/ReactECharts.tsx` | Обёртка над ECharts |
| `src/data/data.ts` | Статические ряды |
| `src/api/fetchRates.ts` | Загрузка данных |
| `src/types/rates.ts` | Типы |
| `src/features/dashboard/chartOption.ts` | Опции графика |
| `src/features/dashboard/DashboardPage.tsx` | UI дешборда |

В репозиторий не добавляют `node_modules/`, `build/`, `.env.local`. По условиям задания репозиторий должен быть публичным, в ответе — ссылка на него.
