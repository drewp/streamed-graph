const path = require("path");

module.exports = {
  entry: ["./src/index.ts"],
  output: {
    library: "streamed_graph",
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
    publicPath: "/build/"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: require.resolve("ts-loader")
      },
      { test: /\.css$/i, use: ["file-loader"] }
    ]
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".js"],
    modules: ["node_modules"]
  },
  watchOptions: {
    ignored: /node_modules/,
    poll: 200
  },
  devServer: {
    port: 8082,
    publicPath: "/build/",
    contentBase: __dirname
  }
};
