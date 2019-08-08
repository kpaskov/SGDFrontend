const path = require("path");
const CopyPlugin = require('copy-webpack-plugin')

module.exports =  {
  entry: "./client/jsx/application.jsx",
  mode:'development',
  output: {
    filename: "./application.js",
    path:path.join(__dirname, "src/sgd/frontend/yeastgenome/static/js")
  },
  plugins:[
    new CopyPlugin([
      {from:path.resolve(__dirname,'node_modules/font-awesome/fonts'),to:path.resolve(__dirname,'src/sgd/frontend/yeastgenome/static/fonts')},
      {from:path.resolve(__dirname,'node_modules/datatables.net-zf/images'),to:path.resolve(__dirname,'src/sgd/frontend/yeastgenome/static/img')}
  ])
  ],
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            presets: ["@babel/preset-env","@babel/preset-react"]
          }
        }
      }
    ]
  },
  resolve:{
    extensions: ['*','.jsx','.js','.json']
  },
  stats: {
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true
  }
}