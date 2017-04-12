//var webpack=require("webpack");


module.exports={
	entry:'./dev/type.jsx',
	output:{
	  path:'./public/js/adminJs',
	  filename:'type.js'
	},
	module: {
        loaders:[
            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                loader: 'babel-loader?presets[]=es2015&presets[]=react'
            }
        ]
   }
//	plugins:[
//		new us({
//			compress:{
//				warnings:false
//			}
//		})
//	]
	

}

