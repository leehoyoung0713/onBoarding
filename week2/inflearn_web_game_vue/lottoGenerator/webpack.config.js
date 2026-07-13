const {VueLoaderPlugin} =require('vue-loader')
const webpack=require('webpack')
const path=require('path');

console.log('설정 로드됨');

module.exports= {
    mode: 'development',
    devtool:'eval',
    resolve:{
        extensions:['.js','.vue'],
    },
    devServer:{
        static: {
            directory:path.join(__dirname,'./')
        },
        port:8080,
        hot:true,
        watchFiles: {
            paths: ['src/**/*'],
            options: {
                ignored: /(^|[\/\\])\..*|.*~$/, // ~ 로 끝나는 백업파일 제외
            }
        }
    },
    chainWebpack: config => {
        config.merge({
            watchOptions: {
                ignored: [/node_modules/, /.*~$/]
            }
        })
    },
    entry:{
        app:path.join(__dirname,'main.js'),
    },
    module:{
        rules:[
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:'babel-loader',
            },
            {
                test:/\.vue$/,
                loader:'vue-loader',
            },
            {
                test:/\.css$/,
                use:['style-loader','css-loader'],
            }
        ],
    },
    plugins:[
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: true,
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
        }),
    ],
    output:{
        filename:'[name].js',
        path: path.join(__dirname,'dist')
    },
};