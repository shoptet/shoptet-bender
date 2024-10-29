#!/usr/bin/env node
/** @format */

import command from "./cli.js";
import { config } from "./config.js";
import fs from "fs";
import path from "path";
import BrowserSync from "browser-sync";
import BrowserSyncPlugin from "browser-sync-webpack-plugin";
import webpack from "webpack";
import getWebpackConfig from "./webpack.config.js";
import { build, watch } from "./gulpfile.js";

command.parse(process.argv);

const options = command.opts();

const rootDir = process.cwd();

const sourceFolder = path.join(rootDir, config.sourceFolder ?? "src");
const outputFolder = path.join(rootDir, config.outputFolder);

const includesRegex = /<!-- (?:service\s\d+\(\d+\)|api\s\d+\(\d+\)|project)\shtml\s+code\s+(?:header|footer) -->/gi;
const includesCodeRegex = new RegExp(includesRegex.source + "[\\s\\S]*?(?=" + includesRegex.source + "|$)", "g");

const blankModeStyle = {
    match: /<link\s+href="https:\/\/cdn\.myshoptet\.com\/prj\/[^"]+"[^>]*>/gi,
    fn: function () {
        return "";
    },
};

const blankModeScript = {
    match: /<script\s+src="https:\/\/cdn\.myshoptet\.com\/prj\/[^"]+"[^>]*>/gi,
    fn: function () {
        return "";
    },
};

const headerIncludes = {
    match: /(?<=<head[\s\S]*?<!--\sUser include\s-->)[\s\S]*?(?=<!--\s\/User include\s-->)/i,
    fn: function (req, res, match) {
        // Remove includes from the header
        const includes = options.removeHeaderIncludes || config.removeHeaderIncludes || [];
        const matchedServices = match.match(includesCodeRegex);
        if (matchedServices) {
            match = matchedServices
                .filter((service) => {
                    return !includes.some((removedService) => service.includes(removedService));
                })
                .join("");
        }

        // Add custom includes to the footer
        const headerMarkup =
            (fs.existsSync(outputFolder + "/scripts.header.js") ? '<script src="/scripts.header.js"></script>' : "") + (fs.existsSync(outputFolder + "/styles.header.css") ? '<link rel="stylesheet" href="/styles.header.css">' : "");
        return match + headerMarkup;
    },
};

const footerIncludes = {
    match: /(?<=<body[\s\S]*?<!--\sUser include\s-->\s*<div class="container">)[\s\S]*?(?=<\/div>\s*<!--\s\/User include\s-->)/i,
    fn: function (req, res, match) {
        // Remove includes from the footer
        const includes = options.removeFooterIncludes || config.removeFooterIncludes || [];
        const matchedServices = match.match(includesCodeRegex);
        if (matchedServices) {
            match = matchedServices
                .filter((service) => {
                    return !includes.some((removedService) => service.includes(removedService));
                })
                .join("");
        }

        // Add custom includes to the footer
        const footerMarkup =
            (fs.existsSync(outputFolder + "/scripts.footer.js") ? '<script src="/scripts.footer.js"></script>' : "") + (fs.existsSync(outputFolder + "/styles.footer.css") ? '<link rel="stylesheet" href="/styles.footer.css">' : "");
        return footerMarkup + match;
    },
};

const rewriteRules = [{ ...headerIncludes }, { ...footerIncludes }, { ...(options.blankMode && blankModeStyle) }, { ...(options.blankMode && blankModeScript) }];

function runWebpack() {
    const bsPlugin = [
        new BrowserSyncPlugin({
            proxy: { target: options.remote ?? config.defaultUrl },
            serveStatic: [outputFolder],
            rewriteRules: rewriteRules.filter((value) => Object.keys(value).length !== 0),
            port: 3010,
            notify: options.notify || config.notify || true,
            open: options.open || config.open || false,
        }),
    ];

    const baseWebpackConfig = getWebpackConfig(options.env ?? config.env);
    const webpackConfig = {
        watch: options.watch,
        ...baseWebpackConfig,
        plugins: [...bsPlugin, ...baseWebpackConfig.plugins],
    };
    webpack(webpackConfig, (err, stats) => {
        if (err || stats.hasErrors()) {
            console.log("Webpack errors", err);
        }
        console.log(stats.toString({ colors: true }));
    });
}

async function runGulpTask() {
    try {
        await build();
    } catch (err) {
        console.error("Gulp task error:", err);
    }
}

function runGulp() {
    watch();
    runGulpTask();
    const bs = BrowserSync({
        proxy: { target: options.remote ?? config.defaultUrl },
        watch: options.watch,
        files: [outputFolder],
        serveStatic: [outputFolder],
        rewriteRules: rewriteRules.filter((value) => Object.keys(value).length !== 0),
        port: 3010,
        notify: options.notify || config.notify || true,
        open: options.open || config.open || false,
    });
}

if (config.builder === "webpack" || options.builder === "webpack") {
    runWebpack();
} else if (config.builder === "gulp" || options.builder === "gulp") {
    runGulp();
} else {
    console.error("Please specify a valid builder: webpack or gulp");
}
