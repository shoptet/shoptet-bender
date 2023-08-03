#!/usr/bin/env node

import browserSync from 'browser-sync';
import command from './cli.js';
import { config } from './config.js';
import concat from './concatFiles.js';
import fs from 'fs';
import path from 'path';

command.parse(process.argv);

const options = command.opts();

const rootDir = process.cwd();

const sourceFolder = path.join(rootDir, config.sourceFolder ?? 'src');
const outputFolder = path.join(rootDir, (options.folder ?? config.outputFolder));

const blankModeStyle = {
    match: /<link\s+href="https:\/\/cdn\.myshoptet\.com\/prj\/[^"]+"[^>]*>/gi,
    fn: function () { return ('');},
}

const blankModeScript = {
    match: /<script\s+src="https:\/\/cdn\.myshoptet\.com\/prj\/[^"]+"[^>]*>/gi,
    fn: function () { return ('');},
};

const headerIncludes = {
    match: /<body[^>]*>/i,
    fn: function (req, res, match) {
        const headerMarkup =
            (fs.existsSync(outputFolder + '/scripts.header.js')
                ? '<script src="/scripts.header.js"></script>'
                : '') +
            (fs.existsSync(outputFolder + '/styles.header.css')
                ? '<link rel="stylesheet" href="/styles.header.css">'
                : '');
        return match + headerMarkup;
    },
};

const footerIncludes = {
    match: /<\/body>(?![\s\S]*<\/body>[\s\S]*$)/i,
    fn: function (req, res, match) {
        const footerMarkup =
            (fs.existsSync(outputFolder + '/scripts.footer.js')
                ? '<script src="/scripts.footer.js"></script>'
                : '') +
            (fs.existsSync(outputFolder + '/styles.footer.css')
                ? '<link rel="stylesheet" href="/styles.footer.css">'
                : '');
        return footerMarkup + match;
    },
};

const rewriteRules = [
    { ...headerIncludes },
    { ...footerIncludes },
    { ...(options.blankMode && blankModeStyle) },
    { ...(options.blankMode && blankModeScript) },
];

const filesWatch = [
    {
        match: [sourceFolder + '/header/*'],
        fn: function (event, file) {
            concat(
                sourceFolder + '/header',
                '.js',
                'scripts.header.js'
            );
            concat(
                sourceFolder + '/header',
                '.css',
                'styles.header.css'
            );
        },
    },
    {
        match: [sourceFolder + '/footer/*'],
        fn: function (event, file) {
            concat(
                sourceFolder + '/footer',
                '.js',
                'scripts.footer.js'
            );
            concat(
                sourceFolder + '/footer',
                '.css',
                'styles.footer.css'
            );
        },
    },
    {
        match: [sourceFolder + '.orderFinale/*'],
        fn: function (event, file) {
            concat(
                sourceFolder + '.orderFinale',
                '.js',
                'scripts.orderFinale.js'
            );
            concat(
                sourceFolder + '.orderFinale',
                '.css',
                'styles.orderFinale.css'
            );
        },
    },
];

const bs = browserSync.create();
bs.init({
    proxy: { target: options.remote ?? config.defaultUrl },
    watch: options.watch,
    files: filesWatch,
    serveStatic: [outputFolder],
    rewriteRules: rewriteRules.filter(
        (value) => Object.keys(value).length !== 0
    ),
    port: 3010,
    notify: options.notify,
});
