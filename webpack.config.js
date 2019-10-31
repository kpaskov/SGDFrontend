const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        main: './client/jsx/application.jsx'
    },
    output: {
        path: path.resolve(__dirname, 'src/sgd/frontend/yeastgenome/static/'),
        filename: 'js/main/[name].js', //replace this whereever there's application.js in jinja files
    },
    rules: [
        {
            test: /\.jsx$/,
            include:[
                path.resolve(__dirname, './client/jsx'),
                path.resolve(__dirname, 'node_modules/sgd_visualization')
            ],
            use:
            {
                loader: 'babel-loader',
                options: {
                    plugins: ['@babel/plugin-transform-react-jsx']
                }
            }
        },
        {
            test: /\.js$/,
            exclude: /bower_components/,
            use: {
                loader: 'babel-loader',
                options: {
                    plugins: ['@babel/plugin-transform-react-jsx']
                }
            }
        },

    ],
    target: 'web',
    externals: [
        {
            'jquery': 'jQuery',
            'window': 'window'
        }
    ],
    resolve:{
       aliasFields: ['browser'], // check package.json
    },
    devtool: 'eval-source-map',
    stats: 'normal',
        devServer: {
            stats: {
                children: false,
                maxModules: 0
            },
            port: 3001
        }


};
