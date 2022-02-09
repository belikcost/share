const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (_env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: isProduction ? './src/index.ts' : { main: './src/index.ts', test: './examples/index.js' },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/,
                    options: {
                        compilerOptions: { declaration: isProduction }
                    }
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist'),
            clean: true
        },
        plugins: isProduction ? [] : [
            new HtmlWebpackPlugin(
                { template: path.resolve(__dirname, 'public/index.html'), inject: 'body' }
            ),
        ],
    };
};