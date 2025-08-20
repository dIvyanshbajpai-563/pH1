const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Support for CSV files
config.resolver.assetExts.push('csv');

module.exports = config;
