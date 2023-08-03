import fs from 'fs';
import path from 'path';
import { config } from './config.js';


const concat = (sourceFolder, extension, outputName) => {
    if (!fs.existsSync(sourceFolder)) {
        return;
    }
    const files = fs
        .readdirSync(sourceFolder)
        .filter((file) => path.extname(file) === extension);
    if (files.length === 0) {
        return;
    }
    const content = files
        .map((file) => fs.readFileSync(path.join(sourceFolder, file), 'utf8'))
        .join('\n');
    console.log(
        files.map((file) => path.join(sourceFolder, file)).join(' + ') +
            ' -> ' +
            outputName
    );
    const outputFile = path.join(process.cwd(), config.outputFolder, outputName);
    fs.writeFileSync(outputFile, content);
    if (!fs.existsSync(outputFile)) {
        console.log('Error writing file ' + outputFile);
    }
};
export default concat;
