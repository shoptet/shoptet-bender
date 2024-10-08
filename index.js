#!/usr/bin/env node
/** @format */

import command from './cli.js';
import { config } from './config.js';
import fs from 'fs';
import path from 'path';
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
import webpack from 'webpack';
import getWebpackConfig from './webpack.config.js';

command.parse(process.argv);

const options = command.opts();

const rootDir = process.cwd();

const sourceFolder = path.join(rootDir, config.sourceFolder ?? 'src');
const outputFolder = path.join(rootDir, options.folder ?? config.outputFolder);

const includesRegex = /<!-- (?:service\s\d+\(\d+\)|api\s\d+\(\d+\)|project)\shtml\s+code\s+(?:header|footer) -->/gi;
const includesCodeRegex = new RegExp(includesRegex.source + '[\\s\\S]*?(?=' + includesRegex.source + '|$)', 'g');

const blankModeStyle = {
  match: /<link\s+href="https:\/\/cdn\.myshoptet\.com\/prj\/[^"]+"[^>]*>/gi,
  fn: function () {
    return '';
  },
};

const blankModeScript = {
  match: /<script\s+src="https:\/\/cdn\.myshoptet\.com\/prj\/[^"]+"[^>]*>/gi,
  fn: function () {
    return '';
  },
};

const headerIncludes = {
  match: /<body[^>]*>/i,
  fn: function (req, res, match) {
    const headerMarkup =
      (fs.existsSync(outputFolder + '/scripts.header.js') ? '<script src="/scripts.header.js"></script>' : '') +
      (fs.existsSync(outputFolder + '/styles.header.css') ? '<link rel="stylesheet" href="/styles.header.css">' : '');
    return match + headerMarkup;
  },
};

const removeHeaderIncludes = {
  match: /(?<=<head[\s\S]*?<!--\sUser include\s-->)[\s\S]*?(?=<!--\s\/User include\s-->)/i,
  fn: function (req, res, match) {
    const matchedServices = match.match(includesCodeRegex);
    if (!matchedServices) {
      return match;
    }
    return matchedServices.filter(service => {
      return !config.removeHeaderIncludes?.some(removedService => service.includes(removedService));
    }).join('');
  },
};

const removeFooterIncludes = {
  match: /(?<=<body[\s\S]*?<!--\sUser include\s-->\s*<div class="container">)[\s\S]*?(?=<\/div>\s*<!--\s\/User include\s-->)/i,
  fn: function (req, res, match) {
    const matchedServices = match.match(includesCodeRegex);
    if (!matchedServices) {
      return match;
    }
    return matchedServices.filter(service => {
      return !config.removeFooterIncludes?.some(removedService => service.includes(removedService));
    }).join('');
  },
};

const footerIncludes = {
  match: /<body[^>]*>[\s\S]*?<\/body>/i,
  fn: function (req, res, match) {
    const footerMarkup =
      (fs.existsSync(outputFolder + '/scripts.footer.js') ? '<script src="/scripts.footer.js"></script>' : '') +
      (fs.existsSync(outputFolder + '/styles.footer.css') ? '<link rel="stylesheet" href="/styles.footer.css">' : '');
    return footerMarkup + match;
  },
};

const rewriteRules = [
  { ...removeHeaderIncludes },
  { ...removeFooterIncludes },
  { ...headerIncludes },
  { ...footerIncludes },
  { ...(options.blankMode && blankModeStyle) },
  { ...(options.blankMode && blankModeScript) },
];

const bsPlugin = [
  new BrowserSyncPlugin({
    proxy: { target: options.remote ?? config.defaultUrl },
    serveStatic: [outputFolder],
    rewriteRules: rewriteRules.filter(value => Object.keys(value).length !== 0),
    port: 3010,
    notify: options.notify,
    open: false,
  }),
];

const baseWebpackConfig = getWebpackConfig('development');

const webpackConfig = {
  watch: options.watch,
  ...baseWebpackConfig,
  plugins: [...bsPlugin, ...baseWebpackConfig.plugins],
};

webpack(webpackConfig, (err, stats) => {
  if (err || stats.hasErrors()) {
    console.log('Webpack errors', err);
  }
  console.log(stats.toString({ colors: true }));
});
