const REQUIRED_COLUMNS = ['timestamp', 'open', 'high', 'low', 'close', 'volume'];

const UP_COLOR = 'rgba(38, 166, 154, 0.55)';
const DOWN_COLOR = 'rgba(239, 83, 80, 0.55)';

function stripBom(text) {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

function splitCsvLine(line) {
  return line.split(',').map((cell) => cell.trim());
}

function parseHeader(headerLine) {
  const cols = splitCsvLine(headerLine).map((c) => c.toLowerCase());
  const indices = {};
  for (const required of REQUIRED_COLUMNS) {
    const idx = cols.indexOf(required);
    if (idx === -1) {
      throw new Error(
        `Missing required column "${required}". Expected header: ${REQUIRED_COLUMNS.join(',')}`
      );
    }
    indices[required] = idx;
  }
  return indices;
}

function toUtcSeconds(raw) {
  const n = Number(raw);
  if (!Number.isFinite(n)) throw new Error(`Invalid timestamp: ${raw}`);
  return n > 1e12 ? Math.floor(n / 1000) : Math.floor(n);
}

function toNumber(raw, field, lineNo) {
  const n = Number(raw);
  if (!Number.isFinite(n)) {
    throw new Error(`Invalid ${field} on line ${lineNo}: "${raw}"`);
  }
  return n;
}

export async function parseCsv(file) {
  const text = stripBom(await file.text());
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);

  if (lines.length < 2) {
    throw new Error('CSV must contain a header row and at least one data row.');
  }

  const idx = parseHeader(lines[0]);
  const candles = [];
  const volumes = [];

  for (let i = 1; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i]);
    const time = toUtcSeconds(cells[idx.timestamp]);
    const open = toNumber(cells[idx.open], 'open', i + 1);
    const high = toNumber(cells[idx.high], 'high', i + 1);
    const low = toNumber(cells[idx.low], 'low', i + 1);
    const close = toNumber(cells[idx.close], 'close', i + 1);
    const volume = toNumber(cells[idx.volume], 'volume', i + 1);

    candles.push({ time, open, high, low, close });
    volumes.push({
      time,
      value: volume,
      color: close >= open ? UP_COLOR : DOWN_COLOR,
    });
  }

  candles.sort((a, b) => a.time - b.time);
  volumes.sort((a, b) => a.time - b.time);

  for (let i = 1; i < candles.length; i++) {
    if (candles[i].time === candles[i - 1].time) {
      throw new Error(`Duplicate timestamp at row ${i + 1}: ${candles[i].time}`);
    }
  }

  return {
    candles,
    volumes,
    meta: {
      fileName: file.name,
      rowCount: candles.length,
      firstTime: candles[0].time,
      lastTime: candles[candles.length - 1].time,
    },
  };
}
