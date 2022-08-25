import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const packageInfo = JSON.parse(
    readFileSync(path.resolve(__dirname, './package.json'))
);

export const config = JSON.parse(
    readFileSync(path.resolve(__dirname, './config.json'))
);