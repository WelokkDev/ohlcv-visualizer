import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  ColorType,
  CrosshairMode,
} from 'lightweight-charts';
import { getPreferredTheme } from './theme.js';

const VOLUME_PRICE_SCALE = 'volume';

function buildChartOptions(theme) {
  return {
    layout: {
      background: { type: ColorType.Solid, color: theme.background },
      textColor: theme.text,
      fontFamily:
        "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      attributionLogo: false,
    },
    grid: {
      vertLines: { color: theme.grid },
      horzLines: { color: theme.grid },
    },
    crosshair: { mode: CrosshairMode.Normal },
    rightPriceScale: { borderColor: theme.border },
    timeScale: {
      borderColor: theme.border,
      timeVisible: true,
      secondsVisible: false,
    },
    autoSize: false,
  };
}

export function createOhlcvChart(container, data, options = {}) {
  const theme = options.theme ?? getPreferredTheme();
  const chart = createChart(container, {
    ...buildChartOptions(theme),
    width: container.clientWidth,
    height: container.clientHeight,
  });

  const candleSeries = chart.addSeries(CandlestickSeries, {
    upColor: theme.upColor,
    downColor: theme.downColor,
    borderUpColor: theme.upColor,
    borderDownColor: theme.downColor,
    wickUpColor: theme.upColor,
    wickDownColor: theme.downColor,
  });
  candleSeries.setData(data.candles);

  const volumeSeries = chart.addSeries(HistogramSeries, {
    priceFormat: { type: 'volume' },
    priceScaleId: VOLUME_PRICE_SCALE,
  });
  chart.priceScale(VOLUME_PRICE_SCALE).applyOptions({
    scaleMargins: { top: 0.78, bottom: 0 },
    borderVisible: false,
  });
  volumeSeries.setData(data.volumes);

  chart.timeScale().fitContent();

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      chart.applyOptions({ width, height });
    }
  });
  resizeObserver.observe(container);

  return {
    destroy() {
      resizeObserver.disconnect();
      chart.remove();
    },
  };
}
