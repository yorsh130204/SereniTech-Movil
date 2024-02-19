const { getDefaultConfig } = require('expo/metro-config');

module.exports = getDefaultConfig(__dirname);

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push('cjs');

module.exports = defaultConfig;