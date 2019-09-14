var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    path.join(__dirname, 'src', 'index.tsx')
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    // modules: ['web_modules', 'node_modules', 'src']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: path.join(__dirname, 'src'),
        exclude: /\node_modules$/,
        loaders: [
          "babel-loader",
          "awesome-typescript-loader"
        ]
      },
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, 'src'),
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        include: path.join(__dirname, 'src'),
        use: [
          {
            loader: "html-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    })
  ]
};
