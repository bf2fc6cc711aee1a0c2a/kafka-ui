const { dependencies, federatedModuleName } = require("./package.json");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const singletonDeps = [
  'lodash',
  'axios',
  'redux',
  'react',
  'react-dom',
  'react-router-dom',
  'react-redux',
  'react-promise-middleware',
  '@patternfly/react-core',
  '@patternfly/react-charts',
  '@patternfly/react-table',
  '@patternfly/react-icons',
  '@patternfly/react-tokens',
  '@redhat-cloud-services/frontend-components',
  '@redhat-cloud-services/frontend-components-utilities',
  '@redhat-cloud-services/frontend-components-notifications',
  '@bf2/ui-shared',
];
const fileRegEx =
  /\.(png|woff|woff2|eot|ttf|svg|gif|jpe?g|png)(\?[a-z0-9=.]+)?$/;
const srcDir = path.resolve(__dirname, './src');
const ChunkMapper = require('@redhat-cloud-services/frontend-components-config/chunk-mapper');

module.exports = (_env, argv) => {
  const isProduction = argv.mode === "production";
  // Moved multiple entries to index.tsx in order to help speed up webpack
  const entry = path.join(srcDir, "bootstrap", "index.tsx");

  return {
    stats: {
      excludeAssets: fileRegEx,
      colors: true,
      modules: false,
    },
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? "source-map" : "eval-source-map",
    entry,
    output: {
      filename: isProduction ? "[contenthash:8].bundle.js" : "[name].bundle.js",
      publicPath: "auto",
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          include: path.join(__dirname, "src"),
          use: [
            {
              loader: "ts-loader",
            },
          ],
        },
        {
          test: /\.css|s[ac]ss$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
          sideEffects: true,
        },
        {
          test: fileRegEx,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(srcDir, "bootstrap", "index.html"),
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? "[id].[contenthash:8].css" : "[name].css",
        chunkFilename: isProduction ? "[id].[contenthash:8].css" : "[id].css",
        ignoreOrder: true, // Enable to remove warnings about conflicting order
      }),
      new webpack.container.ModuleFederationPlugin({
        name: federatedModuleName,
        filename: `${federatedModuleName}${
          isProduction ? ".[chunkhash:8]" : ""
        }.js`,
        exposes: {
          './Panels/KafkaMainView':
            './src/modules/Topics/pages/MainView/MainViewFederated',
          './Panels/TopicDetails':
            './src/modules/Topics/pages/TopicDetail/TopicDetailFederated',
          './Panels/CreateTopic':
            './src/modules/Topics/pages/CreateTopic/CreateTopicFederated',
          './Panels/UpdateTopic':
            './src/modules/Topics/pages/UpdateTopic/UpdateTopicFederated',
        },
        shared: {
          ...dependencies,
          ...singletonDeps.reduce((acc, dep) => {
            acc[dep] = { singleton: true, requiredVersion: dependencies[dep] };
            return acc;
          }, {}),
        },
      }),
      new ChunkMapper({
        modules: [federatedModuleName],
      }),
    ],
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: path.resolve(__dirname, "./tsconfig.json"),
        }),
      ],
    },
    devServer: {
      historyApiFallback: true,
      port: 8080,
      disableHostCheck: true,
      progress: true,
      hot: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers":
          "X-Requested-With, content-type, Authorization",
      },
    },
  };
};
