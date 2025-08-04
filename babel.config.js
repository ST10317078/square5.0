module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
<<<<<<< HEAD
=======
    // No custom module‐resolver needed now
>>>>>>> 19676a782321ebe9a783a6a59363415e2bad9248
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
        safe: false,
<<<<<<< HEAD
        allowUndefined: true
      }]
    ]
=======
        allowUndefined: true,
      }],
    ],
>>>>>>> 19676a782321ebe9a783a6a59363415e2bad9248
  };
};
