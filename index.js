#!/usr/bin/env node

import browserSync from 'browser-sync';
import command from './cli.js';

command.parse(process.argv);

const options = command.opts();
const defaultUrl = "https://classic.shoptet.cz/";
const defaultFolder = "./src";

browserSync({
    proxy: { target: options.remote ?? defaultUrl },
    watch: options.watch,
    files: options.folder ? './'+options.folder+'/*' : defaultFolder+'/*',
    serveStatic: [options.folder ?? defaultFolder],
    rewriteRules: [
        {
            match: /<\/body>(?![\s\S]*<\/body>[\s\S]*$)/i,
            fn: function (req, res, match) {
                return (
                    '<script src="script.js"></script><link rel="stylesheet" href="style.css">' +
                    match
                );
            },
        },
    ],
});
