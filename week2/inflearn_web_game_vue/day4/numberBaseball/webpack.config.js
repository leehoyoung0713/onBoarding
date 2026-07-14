const {VueLoaderPlugin} =require('vue-loader')
const path=require('path');

console.log('설정 로드됨');

module.exports= {
    mode: 'development',
    devtool:'eval',
    resolve:{
        extensions:['.js','.vue'],
    },
    entry:{
        app:path.join(__dirname,'main.js'),
    },
    module:{
        rules:[{
            test: /\.js$/,
            exclude: /node_modules/,
            use:'babel-loader',
        },
            {
                test:/\.vue$/,
                loader:'vue-loader',
            }],
    },
    plugins:[
        new VueLoaderPlugin(),
    ],
    output:{
        filename:'[name].js',
        path: path.join(__dirname,'dist')
    },
};