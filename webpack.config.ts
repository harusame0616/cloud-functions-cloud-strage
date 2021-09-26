import Webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import * as path from 'path';

export const config: Webpack.Configuration = {
    target: 'node',
    externals: [nodeExternals()],
    entry: path.resolve(__dirname, 'src', 'index.ts'),
    output: {
        path: __dirname,
        filename: 'index.js',
        library: {
            type: 'commonjs2'
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: '/node_modules'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
    }
}

type BuildMode = 'production' | 'development' | 'none' | undefined;
const isBuildMode = (mode: any): mode is BuildMode =>
    ['production', 'development', 'none', undefined].includes(mode);

if (isBuildMode(process.env.NODE_ENV)) {
    config.mode = process.env.NODE_ENV || 'development';
} else {
    throw new Error('The specified build mode is incorrect.');
}

export default config;
