#!/usr/bin/env node

import browserSync from 'browser-sync';
import command from './cli.js';
import { config } from './config.js'

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

const bs = browserSync.create();
bs.init({
    proxy: { target: options.remote ?? config.defaultUrl },
    watch: options.watch,
    files: [options.folder ? './' + options.folder + '/*' : config.defaultFolder + '/*'],
    serveStatic: [options.folder ?? config.defaultFolder],
    rewriteRules: rewriteRules.filter(
        (value) => Object.keys(value).length !== 0
    ),
    port: 3010,
    notify: options.notify
});
