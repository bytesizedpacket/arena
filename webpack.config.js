const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "development",
  entry: path.join(__dirname, "src", "index.ts"),
  watch: true,
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, "src", "assets"),
        to: "assets"
      }
    ]),
    new HTMLWebpackPlugin({
      template: "src/index.html",
      filename: "index.html",
      favicon: "src/assets/favicon.ico"
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: { mangle: true, output: { comments: false } },
        extractComments: false
      })
    ]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "bundle.js",
    chunkFilename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.join("./dist/"),
    historyApiFallback: true,
    inline: true,
    host: "0.0.0.0",
    port: 8080,
    compress: true,
    disableHostCheck: true
  }
};
