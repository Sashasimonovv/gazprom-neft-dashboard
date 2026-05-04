import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { ECharts, EChartsOption } from 'echarts';

export type EChartsSetOptionOpts = NonNullable<Parameters<ECharts['setOption']>[1]>;

export type ReactEChartsProps = {
  option: EChartsOption;
  setOptionOpts?: EChartsSetOptionOpts;
  style?: React.CSSProperties;
  className?: string;
};

export const ReactECharts: React.FC<ReactEChartsProps> = ({
  option,
  setOptionOpts,
  style,
  className,
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ECharts | null>(null);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const chart = echarts.init(el);
    chartRef.current = chart;

    return () => {
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    chartRef.current?.setOption(option, setOptionOpts ?? { notMerge: true });
  }, [option, setOptionOpts]);

  useEffect(() => {
    const chart = chartRef.current;
    const el = hostRef.current;
    if (!chart || !el) return;

    const ro = new ResizeObserver(() => {
      chart.resize();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={hostRef}
      className={className}
      style={{ width: '100%', minHeight: 360, height: 420, ...style }}
    />
  );
};
