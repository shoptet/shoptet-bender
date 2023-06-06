#!/usr/bin/env node

import browserSync from 'browser-sync';
import command from './cli.js';
import { config } from './config.js'

command.parse(process.argv);

const options = command.opts();

const blankModeStyle = {
    match: /<link rel="stylesheet" media="all" href="https:\/\/cdn\.myshoptet\.com.*>/i,
    fn: function () { return ('');},
}

const blankModeScript = {
    match: /<script src="https:\/\/cdn.myshoptet.com.*>/i,
    fn: function () { return ('');},
};

const runDelBenderScript = {
  match: new RegExp("<script id='"+config.deleteJsFile+"'.*>", "i"),
  fn: function () {
    return ('');
  },
};
const blankModeCss = {
  match: new RegExp("<link id='"+config.deleteCssFile+"'.*>", "i"),
  fn: function () { return (''); },
};

const scriptStyle = {
    match: /<\/body>(?![\s\S]*<\/body>[\s\S]*$)/i,
    fn: function (req, res, match) {
        return (
            '<script src="'+config.jsFileName+'"></script><link rel="stylesheet" href="'+config.cssFileName+'">' +
            match
        );
    },
}

const rewriteRules = [
    {...scriptStyle},
{ ...runDelBenderScript },
{ ...blankModeCss },
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
