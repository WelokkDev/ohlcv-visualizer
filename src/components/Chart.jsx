import { useEffect, useRef } from 'react';
import { createOhlcvChart } from '../lib/chart/createOhlcvChart.js';

export default function Chart({ data }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !data) return;
    const handle = createOhlcvChart(containerRef.current, data);
    return () => handle.destroy();
  }, [data]);

  return <div ref={containerRef} className="chart-container" />;
}
