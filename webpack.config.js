const path = require("path");
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

module.exports =  {
  entry: {
    application:"./client/jsx/application.jsx",
    style:"./client/jsx/style.jsx",
    normalize:"./client/jsx/normalize.jsx"
},
  mode:'development',
  output: {
    filename: "./[name].js",
    path:path.join(__dirname, "src/sgd/frontend/yeastgenome/static/js")
  },
  plugins:[
      new CopyPlugin([
      {from:path.resolve(__dirname,'node_modules/font-awesome/fonts'),to:path.resolve(__dirname,'src/sgd/frontend/yeastgenome/static/fonts')},
      {from:path.resolve(__dirname,'node_modules/datatables.net-zf/images'),to:path.resolve(__dirname,'src/sgd/frontend/yeastgenome/static/img')}
      ]),
      new MiniCssExtractPlugin({
        filename:"../css/[name].css"
      })
      // ,
      //   new webpack.ProvidePlugin({
      //       $: path.resolve(path.join(__dirname, 'node_modules/jquery/dist/jquery.js')),
      //       jQuery: path.resolve(path.join(__dirname, 'node_modules/jquery/dist/jquery.js'))
      //      })
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
      },
      {
        test:/\.(scss|css)$/,
        use:[
          {
            loader:MiniCssExtractPlugin.loader
          },
          {loader:"css-loader",
          options:{
            url:false
          }},
          "sass-loader"
        ]
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