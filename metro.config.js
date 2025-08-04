// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

// allow wasm files to be loaded as assets:
config.resolver.assetExts.push('wasm');
// if you get “Unexpected token import” on .cjs modules, uncomment:
// config.resolver.sourceExts.push('cjs');

module.exports = config;
