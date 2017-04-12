/**
* Adapted from angular2-webpack-starter
*/

const helpers = require('./helpers');
const path = require('path');

/**
* Webpack Plugins
*/
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'test';

module.exports = {
  
  /**
  * Source map for Karma from the help of karma-sourcemap-loader &  karma-webpack
  *
  * Do not change, leave as is or it wont work.
  * See: https://github.com/webpack/karma-webpack#source-maps
  */
  devtool: 'inline-source-map',
  
  
  resolve: {
    extensions: ['.ts', '.js'],
    /**
     * Make sure root is src
     */
    modules: [ path.resolve(__dirname, 'src'), 'node_modules' ]
  },
  
  module: {
    
    rules: [
    /**
    * Tslint loader support for *.ts files
    *
    * See: https://github.com/wbuchwalter/tslint-loader
    */
    {
      enforce: 'pre',
      test: /\.ts$/,
      loader: 'tslint-loader',
      exclude: [helpers.root('node_modules')]
    },
    
    {
      enforce: 'pre',
      test: /\.js$/,
      loader: 'source-map-loader',
      exclude: [
      // these packages have problems with their sourcemaps
      helpers.root('node_modules/rxjs'),
      helpers.root('node_modules/@angular')
      ]
    },
    
    {
      test: /\.ts$/,
      loader: 'awesome-typescript-loader',
      query: {
        // use inline sourcemaps for "karma-remap-coverage" reporter
        sourceMap: false,
        inlineSourceMap: true,
        compilerOptions: {

          // Remove TypeScript helpers to be injected
          // below by DefinePlugin
          removeComments: true

        }
      },
      exclude: [/\.e2e\.ts$/]
    }
    ]
  },
  
  plugins: [
  new DefinePlugin({
    'ENV': JSON.stringify(ENV),
    'process.env': {
      'ENV': JSON.stringify(ENV)
    }
  }),
  
  /**
  * Plugin: ContextReplacementPlugin
  * Description: Provides context to Angular's use of System.import
  *
  * See: https://webpack.github.io/docs/list-of-plugins.html#contextreplacementplugin
  * See: https://github.com/angular/angular/issues/11580
  */
  new ContextReplacementPlugin(
    // The (\\|\/) piece accounts for path separators in *nix and Windows
    /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
    helpers.root('src') // location of your src
  ),
  /**
  * Plugin LoaderOptionsPlugin (experimental)
  *
  * See: https://gist.github.com/sokra/27b24881210b56bbaff7
  */
  new LoaderOptionsPlugin({
    debug: true,
    options: {
      /**
      * Static analysis linter for TypeScript advanced options configuration
      * Description: An extensible linter for the TypeScript language.
      *
      * See: https://github.com/wbuchwalter/tslint-loader
      */
      tslint: {
        emitErrors: false,
        failOnHint: false,
        resourcePath: 'src'
      },
    }
  })
  ],
  
  node: {
    global: true,
    process: false,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};
