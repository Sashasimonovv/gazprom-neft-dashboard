import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchRates } from '../../api/fetchRates';
import { ReactECharts } from '../../Echarts/ReactECharts';
import type { CurrencyCode, RatePoint } from '../../types/rates';
import { Button } from '@consta/uikit/Button';
import { Informer } from '@consta/uikit/Informer';
import { Card } from '@consta/uikit/Card';
import { ChoiceGroup } from '@consta/uikit/ChoiceGroup';
import { Loader } from '@consta/uikit/Loader';
import { Text } from '@consta/uikit/Text';
import { buildLineChartOption, CHART_ORANGE, computeAverage } from './chartOption';

import './DashboardPage.css';

/** Элемент переключателя валют для ChoiceGroup (label — символ на кнопке). */
type CurrencyChoice = { label: string; code: CurrencyCode };

const CURRENCY_ITEMS: CurrencyChoice[] = [
  { label: '$', code: 'USD' },
  { label: '€', code: 'EUR' },
  { label: '¥', code: 'CNY' },
];

const PAGE_TITLES: Record<CurrencyCode, string> = {
  USD: 'КУРС ДОЛЛАРА, $/₽',
  EUR: 'КУРС ЕВРО, €/₽',
  CNY: 'КУРС ЮАНЯ, ¥/₽',
};

const money = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

export const DashboardPage: React.FC = () => {
  const [rows, setRows] = useState<RatePoint[] | null>(null);
  const [fromApi, setFromApi] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<CurrencyChoice>(CURRENCY_ITEMS[0]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, fromApi: api } = await fetchRates();
      setRows(data);
      setFromApi(api);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const average = useMemo(() => {
    if (!rows?.length) return 0;
    return computeAverage(rows, currency.code);
  }, [rows, currency.code]);

  const chartOption = useMemo(() => {
    if (!rows?.length) return null;
    return buildLineChartOption(rows, currency.code, average);
  }, [rows, currency.code, average]);

  const avgFormatted = money.format(average);

  return (
    <div className="dashboard">
      {error && (
        <>
          <Informer
            className="dashboard__alert"
            status="alert"
            view="filled"
            title="Ошибка загрузки"
            label={error}
          />
          <Button className="dashboard__retry" label="Повторить запрос" onClick={() => void load()} />
        </>
      )}

      {!error && (
        <Card verticalSpace="2xl" horizontalSpace="2xl" shadow border className="dashboard__card">
          <div className="dashboard__cardHead">
            <div className="dashboard__titles">
              <Text size="xs" view="secondary" className="dashboard__crumb">
                Курс валют
              </Text>
              <Text size="2xl" weight="bold" as="h1" className="dashboard__mainTitle">
                {PAGE_TITLES[currency.code]}
              </Text>
              {fromApi && (
                <Text size="xs" view="success" className="dashboard__apiHint">
                  Данные с API
                </Text>
              )}
            </div>
            <ChoiceGroup<CurrencyChoice>
              className="dashboard__currencySwitch"
              name="currency"
              size="s"
              form="round"
              view="primary"
              items={CURRENCY_ITEMS}
              value={currency}
              getItemLabel={(item) => item.label}
              onChange={({ value }) => {
                if (value) setCurrency(value);
              }}
            />
          </div>

          {loading && (
            <div className="dashboard__loaderWrap">
              <Loader size="m" />
              <Text size="s" view="secondary">
                Загрузка…
              </Text>
            </div>
          )}

          {!loading && rows?.length === 0 && (
            <Text view="secondary">Нет данных для отображения.</Text>
          )}

          {!loading && chartOption && (
            <div className="dashboard__body">
              <div className="dashboard__chart">
                <ReactECharts option={chartOption} />
              </div>
              <aside className="dashboard__aside" aria-label="Среднее за период">
                <Text size="s" view="secondary" className="dashboard__asideLabel">
                  Среднее за период
                </Text>
                <p className="dashboard__asideValue">
                  <span className="dashboard__asideValueNum" style={{ color: CHART_ORANGE }}>
                    {avgFormatted}
                  </span>
                  <span className="dashboard__asideValueRub"> ₽</span>
                </p>
              </aside>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
