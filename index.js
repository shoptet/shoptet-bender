#!/usr/bin/env node

import browserSync from 'browser-sync';
import command from './cli.js';
import { config } from './config.js';
import concat from './concatFiles.js';
import fs from 'fs';

command.parse(process.argv);

const options = command.opts();

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
            (fs.existsSync(config.outputFolder + '/scripts.header.js')
                ? '<script src="/scripts.header.js"></script>'
                : '') +
            (fs.existsSync(config.outputFolder + '/styles.header.css')
                ? '<link rel="stylesheet" href="/styles.header.css">'
                : '');
        return match + headerMarkup;
    },
};

const footerIncludes = {
    match: /<\/body>(?![\s\S]*<\/body>[\s\S]*$)/i,
    fn: function (req, res, match) {
        const footerMarkup =
            (fs.existsSync(config.outputFolder + '/scripts.footer.js')
                ? '<script src="/scripts.footer.js"></script>'
                : '') +
            (fs.existsSync(config.outputFolder + '/styles.footer.css')
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
        match: [options.folder ?? config.sourceFolder + '/header/*'],
        fn: function (event, file) {
            concat(
                options.folder ?? config.sourceFolder + '/header',
                '.js',
                'scripts.header.js'
            );
            concat(
                options.folder ?? config.sourceFolder + '/header',
                '.css',
                'styles.header.css'
            );
        },
    },
    {
        match: [options.folder ?? config.sourceFolder + '/footer/*'],
        fn: function (event, file) {
            concat(
                options.folder ?? config.sourceFolder + '/footer',
                '.js',
                'scripts.footer.js'
            );
            concat(
                options.folder ?? config.sourceFolder + '/footer',
                '.css',
                'styles.footer.css'
            );
        },
    },
    {
        match: [options.folder ?? config.sourceFolder + '.orderFinale/*'],
        fn: function (event, file) {
            concat(
                options.folder ?? config.sourceFolder + '.orderFinale',
                '.js',
                'scripts.orderFinale.js'
            );
            concat(
                options.folder ?? config.sourceFolder + '.orderFinale',
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
    serveStatic: [options.folder ?? config.outputFolder],
    rewriteRules: rewriteRules.filter(
        (value) => Object.keys(value).length !== 0
    ),
    port: 3010,
    notify: options.notify,
});
