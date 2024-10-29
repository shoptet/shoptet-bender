/* Shoptet Gulpstack, by Klubus Creative */

// Variables
import { config } from './config.js';
import path from 'path';
import gulp from "gulp";
import pkg from 'gulp-inject-string';
import less from "gulp-less";
import autoPrefixer from "gulp-autoprefixer";
import concat from "gulp-concat";
import cleanCss from "gulp-clean-css";
import uglify from "gulp-uglify";
import javascriptObfuscator from "gulp-javascript-obfuscator";
import rename from "gulp-rename";

const { wrap } = pkg;

const rootDir = process.cwd();

const sourceFolder = path.join(rootDir, config.sourceFolder ?? 'src');
const outputFolder = path.join(rootDir, config.outputFolder);

const addonPrefix = config.addonPrefix;
const addonInfo = config.addonInfo;

const env = config.env;
const isProduction = (env == "production") ? true : false;
const minExtension = isProduction ? '.min' : '';

// Tasks
gulp.task("styles-header", function () {
    let stream = gulp.src([sourceFolder + "/header/css/styles.less"], {allowEmpty: true})
        .pipe(less())
        .on('error', function (error) {
            console.error('Error in styles-header task:', error.message);
            this.emit('end'); 
        })
        .pipe(autoPrefixer())
        .pipe(wrap("/* " + addonInfo + " */\n\n", ""));
    if (isProduction) {
        stream = stream.pipe(cleanCss())
    }
    return stream        
        .pipe(rename("styles.header"+minExtension+".css"))
        .pipe(gulp.dest(outputFolder))
        .on('end', () => {
            console.log('Task style-header has been completed');
        });
});


gulp.task("styles-footer", function () {
    let stream = gulp.src([sourceFolder + "/footer/css/styles.less"], {allowEmpty: true})
        .pipe(less())
        .on('error', function (error) {
            console.error('Error in styles-footer task:', error.message);
            this.emit('end'); 
        })
        .pipe(autoPrefixer())
        .pipe(wrap("/* " + addonInfo + " */\n\n", ""));
    if (isProduction) {
        stream = stream.pipe(cleanCss())
    }
    return stream        
        .pipe(rename("styles.footer"+minExtension+".css"))
        .pipe(gulp.dest(outputFolder))
        .on('end', () => {
            console.log('Task style-footer has been completed');
        });
});

gulp.task("scripts-header", function () {
    let stream = gulp.src([sourceFolder + "/header/js/**/*.js"], { allowEmpty: true })
        .pipe(concat("scripts.header" + minExtension + ".js"))
        .pipe(wrap("var " + addonPrefix + " = {};(function (" + addonPrefix + ") {\n\n", "\n\n})(" + addonPrefix + ");"))
        .pipe(wrap("/* " + addonInfo + " */ \n\n", ""));
    if (isProduction) {
        stream = stream.pipe(uglify())
            .on('error', function (error) {
                console.error('Error in scripts-header task:', error.message);
                this.emit('end');  
            })
            .pipe(javascriptObfuscator());
    }
    return stream
        .pipe(gulp.dest(outputFolder))
        .on('end', () => {
            console.log('Task scripts-header has been completed');
        });
});

gulp.task("scripts-footer", function () {
    let stream = gulp.src([sourceFolder + "/footer/js/**/*.js"], { allowEmpty: true })
        .pipe(concat("scripts.footer" + minExtension + ".js"))
        .pipe(wrap("var " + addonPrefix + " = {};(function (" + addonPrefix + ") {\n\n", "\n\n})(" + addonPrefix + ");"))
        .pipe(wrap("/* " + addonInfo + " */ \n\n", ""));
    if (isProduction) {
        stream = stream.pipe(uglify())
            .on('error', function (error) {
                console.error('Error in scripts-footer task:', error.message);
                this.emit('end');  
            })
            .pipe(javascriptObfuscator());
    }
    return stream
        .pipe(gulp.dest(outputFolder))
        .on('end', () => {
            console.log('Task scripts-footer has been completed');
        });
});

export const build = gulp.series("styles-header", "styles-footer", "scripts-header", "scripts-footer");
export function watch () {
    console.log("Starting watcher...");
    gulp.watch(sourceFolder + "/header/css/**/*.less", gulp.series("styles-header"));
    gulp.watch(sourceFolder + "/footer/css/**/*.less", gulp.series("styles-footer"));
    gulp.watch(sourceFolder + "/header/js/**/*.js", gulp.series("scripts-header"));
    gulp.watch(sourceFolder + "/footer/js/**/*.js", gulp.series("scripts-footer"));
}
export default build;