/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 8080;
const PROTOCOL = process.env.PROTOCOL || "http";

module.exports = merge(common('development'), {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    static: {
      directory: "./dist"
    },   
    client: {
      overlay: true
    },
    host: HOST,
    port: PORT,
    compress: true,
    historyApiFallback: true,
    hot: true,
    open: true,
    https: PROTOCOL === "https",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
  } 
});
