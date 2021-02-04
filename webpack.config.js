let webpack = require('webpack');
const withCSS = require('@zeit/next-css');
const configuration =  withCSS({
  webpack(config, options) {
    return config;
  },
});
module.exports =  configuration
