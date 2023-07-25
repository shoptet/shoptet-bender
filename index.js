#!/usr/bin/env node

import browserSync from 'browser-sync';
import command from './cli.js';
import { config } from './config.js'
import { exec } from 'child_process';

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

const footerIncludes = {
    match: /<\/body>(?![\s\S]*<\/body>[\s\S]*$)/i,
    fn: function (req, res, match) {
        return (
            '<script src="/scripts.footer.js"></script><link rel="stylesheet" href="/style.footer.css">' +
            match
        );
    },
}
const headerIncludes = {
    match: /<body[^>]*>/i,
    fn: function (req, res, match) {
        return (
            match +
            '<script src="/scripts.header.js"></script><link rel="stylesheet" href="/style.header.css">'
        );
    },
}

const rewriteRules = [
    {...headerIncludes},
    {...footerIncludes},
    {...(options.blankMode && blankModeStyle)},
    {...(options.blankMode && blankModeScript)}
];

console.log(options);
const bs = browserSync.create();
bs.init({
    proxy: { target: options.remote ?? config.defaultUrl },
    watch: options.watch,
    files: [options.folder ? './' + options.folder + '/*' : './' + config.outputFolder + '/*'],
    serveStatic: [options.folder ?? config.outputFolder],
    rewriteRules: rewriteRules.filter(
        (value) => Object.keys(value).length !== 0
    ),
    middleware: [
        function (req, res, next) {
            exec('yarn build', (err, stdout, stderr) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(stdout);
            });
            next();
        },
    ],
    port: 3010,
    notify: options.notify
});
