const path = require(`path`);

module.exports = {
    entry: {
        common: [`babel-polyfill`, `./src/common.js`],
        login: [`babel-polyfill`, `./src/login.js`]
    },
    output: {
        filename: `[name]-bundle.js`,
        path: path.resolve(__dirname, `public/scripts`)
    },
    module: {
        rules: [{
            test: /\.js$/,
            type: 'javascript/auto',
            exclude: /node_modules/,
            use: {
                loader: `babel-loader`,
                options: {
                    presets: [`env`],
                    plugins: [`transform-object-rest-spread`]
                }
            }
        }]
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'public'),
        publicPath: '/scripts/',
        port: 3000
    },
    devtool: 'source-map'
}