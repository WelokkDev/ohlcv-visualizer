import { useRef } from 'react';
import { ACCEPT_ATTR, SUPPORTED_EXTENSIONS } from '../lib/parsers/index.js';

export default function FilePicker({ onFileSelected }) {
  const inputRef = useRef(null);

  const openPicker = () => inputRef.current?.click();

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
    e.target.value = '';
  };

  return (
    <div className="picker">
      <div className="picker-card">
        <h1 className="picker-title">OHLCV Visualizer</h1>
        <p className="picker-subtitle">
          Load a file to render its candles &amp; volume.
        </p>
        <button type="button" className="picker-button" onClick={openPicker}>
          Open file
        </button>
        <p className="picker-hint">
          Supports {SUPPORTED_EXTENSIONS.map((e) => `.${e}`).join(', ')}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTR}
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}
