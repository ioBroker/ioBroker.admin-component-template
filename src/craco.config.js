const CracoEsbuildPlugin = require('craco-esbuild');
const { ProvidePlugin } = require('webpack');
const cracoModuleFederation = require('craco-module-federation');

console.log('craco');

module.exports = {
    plugins: [{ plugin: CracoEsbuildPlugin }, { plugin: cracoModuleFederation }],
    webpack: {
        output: {
            publicPath: 'auto',
        },
        plugins: [
            new ProvidePlugin({
                React: 'react',
            }),
        ],
        configure: webpackConfig => {
            webpackConfig.output.publicPath = 'auto';
            return webpackConfig;
        },
    },
};
