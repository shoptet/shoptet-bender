/** @format */

import path from 'path';
import { glob } from 'glob';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import WebpackObfuscatorPlugin from 'webpack-obfuscator';
import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts';

const outputDir = path.resolve(process.cwd(), 'dist');

const extensionsFilenames = {
  js: 'scripts',
  scss: 'styles',
  less: 'styles',
  css: 'styles',
  html: 'markup',
};

const getEntries = (extension, isProduction) => {
  const entries = {};
  const folders = ['footer', 'header', 'index'];
  folders.forEach(folder => {
    const files = glob.sync(`./src/${folder}/**/*.${extension}`);
    if (files.length > 0) {
      const foundExtension = files[0].split('.').pop();
      const filename = extensionsFilenames[foundExtension];
      const minExtension = isProduction ? '.min' : '';
      entries[`${filename}.${folder}${minExtension}`] = files.map(str => './' + str);
    }
  });
  return entries;
};

const getGlobalAssetsEntry = () => {
  const entries = {};
  const files = glob.sync('./assets/**/*');
  if (files.length > 0) {
    entries['assets'] = files.map(str => './' + str);
  }
  return entries;
};

export default env => {
  const isProduction = env.production === true;
  return {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'eval',
    entry: {
      ...getEntries('js', isProduction),
      ...getEntries('{scss,less}', isProduction),
      ...getEntries('css', isProduction),
      // TODO: add html entries
      // TODO: add copy assets entries
      // TODO: add TS entries
      ...getGlobalAssetsEntry(),
    },
    output: {
      path: outputDir,
      clean: true,
    },
    plugins: [new MiniCssExtractPlugin(), new RemoveEmptyScriptsPlugin()],
    ...(isProduction && {
      optimization: {
        minimize: true,
        minimizer: [
          new WebpackObfuscatorPlugin({
            rotateStringArray: true,
          }),
          new CssMinimizerPlugin(),
        ],
      },
    }),
    module: {
      rules: [
        {
          test: /\.js$/,
          use: ['babel-loader'],
        },
        {
          test: /\.less$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
        },
        {
          test: /\.scss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            { loader: 'sass-loader', options: { sassOptions: { outputStyle: 'expanded' } } },
          ],
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg|woff2?|ttf|eot)$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name][ext]',
          },
        },
      ],
    },
  };
};
