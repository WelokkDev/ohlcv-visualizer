import { useState } from 'react';
import FilePicker from './components/FilePicker.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import Chart from './components/Chart.jsx';
import ChartHeader from './components/ChartHeader.jsx';
import ErrorBanner from './components/ErrorBanner.jsx';
import { parseFile } from './lib/parsers/index.js';
import './App.css';

const VIEW = {
  IDLE: 'idle',
  LOADING: 'loading',
  CHART: 'chart',
};

export default function App() {
  const [view, setView] = useState(VIEW.IDLE);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelected = async (file) => {
    setError(null);
    setView(VIEW.LOADING);
    try {
      const parsed = await parseFile(file);
      setData(parsed);
      setView(VIEW.CHART);
    } catch (err) {
      setError(err.message ?? 'Failed to parse file.');
      setView(VIEW.IDLE);
    }
  };

  const handleReset = () => {
    setData(null);
    setError(null);
    setView(VIEW.IDLE);
  };

  return (
    <div className="app">
      {error && (
        <ErrorBanner message={error} onDismiss={() => setError(null)} />
      )}

      {view === VIEW.IDLE && (
        <FilePicker onFileSelected={handleFileSelected} />
      )}

      {view === VIEW.LOADING && <LoadingScreen label="Parsing file…" />}

      {view === VIEW.CHART && data && (
        <div className="chart-view">
          <ChartHeader meta={data.meta} onReset={handleReset} />
          <Chart data={data} />
        </div>
      )}
    </div>
  );
}
