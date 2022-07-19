import { Command } from 'commander';
import { readFileSync } from 'fs';

const command = new Command();
// load package.json without using require()
const packageInfo = JSON.parse(
    readFileSync('./package.json', 'utf8')
);

command
    .name(packageInfo.name)
    .description(packageInfo.description)
    .version(packageInfo.version);

command
    .option('-r, --remote <URL>', 'URL of the remote Eshop with https:// prefix')
    .option('-w, --watch', 'Watch for changes and reload the page', true)
    .option('-d, --folder <FOLDER>', 'Folder to serve')
    .option('-f, --files <FILES...>', 'Served files (default: all files in the folder)')
    .option('-b, --bundle', 'Bundle the files into one file', true);

export default command;
