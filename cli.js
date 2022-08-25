import { Command } from 'commander';
import { packageInfo } from './config.js';

const command = new Command();

command
    .name(packageInfo.name)
    .description(packageInfo.description)
    .version(packageInfo.version);

command
    .option('-r, --remote <url>', 'URL of the remote Eshop with https:// prefix')
    .option('-w, --watch', 'Watch for changes and reload the page', true)
    .option('-b, --blankMode', 'Simulate the blank template.', false);

export default command;
