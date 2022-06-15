const makeShared = pkgs => {
    const result = {};
    pkgs.forEach(
        packageName => {
            result[packageName] = {
                requiredVersion: '*',
            };
        },
    );
    return result;
};

module.exports = {
    name: 'AdminComponentTemplateSet',
    filename: 'customComponents.js',
    exposes: {
        './Components': './src/Components.jsx',
    },
    shared: makeShared(['@mui/material', '@mui/styles', '@iobroker/adapter-react-v5', 'react', 'react-dom', 'prop-types'])
};
