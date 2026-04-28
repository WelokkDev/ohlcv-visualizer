import { parseCsv } from './csv.js';

const registry = {
  csv: parseCsv,
};

export const SUPPORTED_EXTENSIONS = Object.keys(registry);

export const ACCEPT_ATTR = SUPPORTED_EXTENSIONS.map((e) => `.${e}`).join(',');

function getExtension(name) {
  const dot = name.lastIndexOf('.');
  return dot === -1 ? '' : name.slice(dot + 1).toLowerCase();
}

export async function parseFile(file) {
  const ext = getExtension(file.name);
  const parser = registry[ext];
  if (!parser) {
    throw new Error(
      `Unsupported file type ".${ext}". Supported: ${SUPPORTED_EXTENSIONS.map((e) => `.${e}`).join(', ')}`
    );
  }
  return parser(file);
}
