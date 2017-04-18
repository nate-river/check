const webpack = require('webpack');
const path=require("path");
module.exports={
    entry:{
        type:path.resolve("./dev/type.jsx"),
        addQuest:path.resolve("./dev/addQuest.jsx"),
    },
    output:{path:path.resolve("./public/js/adminJs"),filename:"[name].js"},
    module:{
        loaders: [{
            test: /\.js[x]?$/,
            exclude: /node_modules/,
            loader: 'babel-loader?presets[]=es2015&presets[]=react'
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};
