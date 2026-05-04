import type { EChartsOption } from 'echarts';
import type { CurrencyCode, RatePoint } from '../../types/rates';

type AxisTooltipItem = { dataIndex?: number };

export const CHART_ORANGE = '#F38B00';

const money = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

const monthYearUpper = (isoDate: string) =>
  new Intl.DateTimeFormat('ru-RU', { month: 'short', year: 'numeric' })
    .format(new Date(isoDate))
    .replace(/\./g, '')
    .toUpperCase();

const seriesLabelRu: Record<CurrencyCode, string> = {
  USD: 'Курс доллара',
  EUR: 'Курс евро',
  CNY: 'Курс юаня',
};

export function computeAverage(points: RatePoint[], currency: CurrencyCode): number {
  if (points.length === 0) return 0;
  const sum = points.reduce((acc, p) => acc + p.rates[currency], 0);
  return sum / points.length;
}

export function buildLineChartOption(
  points: RatePoint[],
  currency: CurrencyCode,
  average: number,
): EChartsOption {
  const dates = points.map((p) => p.date);
  const values = points.map((p) => p.rates[currency]);
  const tipSeries = seriesLabelRu[currency];

  return {
    animationDuration: 400,
    color: [CHART_ORANGE],
    grid: {
      left: 48,
      right: 8,
      top: 16,
      bottom: 28,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      renderMode: 'html',
      appendToBody: true,
      borderWidth: 0,
      padding: 0,
      backgroundColor: 'transparent',
      extraCssText: 'box-shadow:none;',
      axisPointer: {
        type: 'line',
        lineStyle: { color: CHART_ORANGE, width: 1, type: 'dashed' },
      },
      formatter: (raw: AxisTooltipItem | AxisTooltipItem[]) => {
        const arr = Array.isArray(raw) ? raw : [raw];
        const first = arr[0];
        if (!first || typeof first.dataIndex !== 'number') return '';
        const idx = first.dataIndex;
        const row = points[idx];
        if (!row) return '';
        const v = row.rates[currency];
        const head = monthYearUpper(row.date);
        const val = money.format(v);
        return `
          <div style="
            min-width:160px;
            padding:12px 14px 14px;
            background:#fff;
            border-radius:8px;
            box-shadow:0 4px 16px rgba(0,32,51,0.12);
            font-family:system-ui,-apple-system,sans-serif;
          ">
            <div style="font-size:13px;font-weight:700;color:#002033;text-transform:uppercase;letter-spacing:0.02em;">
              ${head}
            </div>
            <div style="margin-top:10px;font-size:13px;color:#002033;line-height:1.4;">
              <span style="color:${CHART_ORANGE};font-size:16px;line-height:0;vertical-align:-2px;">●</span>
              <span style="margin-left:6px;">${tipSeries}</span>
              <span style="margin-left:6px;font-weight:700;">${val}</span>
              <span style="color:#667985;font-weight:600;"> ₽</span>
            </div>
          </div>
        `;
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLine: { lineStyle: { color: '#D1D5DB' } },
      axisTick: { show: false },
      axisLabel: {
        color: '#667985',
        fontSize: 11,
        formatter: (val: string) =>
          new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' })
            .format(new Date(val))
            .replace(/\./g, ''),
      },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      scale: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#667985',
        fontSize: 11,
        formatter: (v: number) =>
          new Intl.NumberFormat('ru-RU', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          }).format(v),
      },
      splitLine: {
        show: true,
        lineStyle: { color: '#E4E8EB', type: 'dashed', width: 1 },
      },
    },
    series: [
      {
        name: tipSeries,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        showSymbol: true,
        lineStyle: { width: 3, color: CHART_ORANGE },
        itemStyle: { color: CHART_ORANGE, borderColor: '#fff', borderWidth: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(243, 139, 0, 0.22)' },
              { offset: 1, color: 'rgba(243, 139, 0, 0.02)' },
            ],
          },
        },
        data: values,
        markLine: {
          symbol: 'none',
          silent: true,
          label: { show: false },
          lineStyle: { type: 'dashed', color: 'rgba(0, 32, 51, 0.18)', width: 1 },
          data: [{ yAxis: average }],
        },
      },
    ],
  };
}
