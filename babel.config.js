const path = require('path');
const NODE_ENV = process.env.NODE_ENV;

module.exports = {
    presets: [
        '@vue/app'
    ],

    // entry: {
    //     index: NODE_ENV === 'development' ? './src/main.ts' : '../src/index.ts',
    // },

    // output: {
    //     publicPath: path.resolve(__dirname, 'dist'),
    //     filename: 'wpj_test_npm.js',
    //     library: 'wpj_test_npm',
    //     libraryTarget: 'umd',
    //     umdNameDefine: true,
    // },
};
