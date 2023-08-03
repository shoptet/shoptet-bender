import { readFileSync } from 'fs';
import path from 'path';

export const packageInfo = JSON.parse(
    readFileSync(path.resolve(process.cwd(), './package.json'))
);

export const config = JSON.parse(
    readFileSync(path.resolve(process.cwd(), './config.json'))
);
