import { Command } from 'commander';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const command = new Command();

const packageInfo = JSON.parse(
    readFileSync(path.resolve(__dirname, './package.json'))
);

command
    .name(packageInfo.name)
    .description(packageInfo.description)
    .version(packageInfo.version);

command
    .option('-r, --remote <url>', 'URL of the remote Eshop with https:// prefix')
    .option('-w, --watch', 'Watch for changes and reload the page', true)
    .option('-b, --blankMode', 'Simulate the blank template.', false);

export default command;
