import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const concat = (sourceFolder, extension, outputName) => {
    const folder = path.join(__dirname, sourceFolder);
    if (!fs.existsSync(folder)) {
        return;
    }
    const files = fs
        .readdirSync(folder)
        .filter((file) => path.extname(file) === extension);
    if (files.length === 0) {
        return;
    }
    const content = files
        .map((file) => fs.readFileSync(path.join(folder, file), 'utf8'))
        .join('\n');
    console.log(
        files.map((file) => path.join(sourceFolder, file)).join(' + ') +
            ' -> ' +
            outputName
    );
    const outputFile = path.join(__dirname, config.outputFolder, outputName);
    fs.writeFileSync(outputFile, content);
    if (!fs.existsSync(outputFile)) {
        console.log('Error writing file ' + outputFile);
    }
};
export default concat;
