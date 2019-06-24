module.exports = {
    mode: 'development',
    context: __dirname,
    entry: {
        Customer: "./Components/Customer.jsx",
        Product: "./Components/Product.jsx",
        Store: "./Components/Store.jsx",
        Sale: "./Components/Sale.jsx"
    },
    output: {
        path: __dirname + "/dist",
        //filename: "bundle.js"
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
    },
    resolve: {
        extensions: [
            '.webpack.js',
            '.web.js',
            '.tsx',
            '.ts',
            '.js',
            '.json',
        ]
    },
    watch: true,
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react']
                }
            }
        }]
    }
}