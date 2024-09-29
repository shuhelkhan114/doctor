module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: '.',
          alias: {
            '@components': './src/components',
            '@core': './src/core',
            '@context': './src/context',
            '@modules': './src/modules',
            '@hooks': './src/hooks',
            '@assets': './src/assets',
            '@typings': './src/typings',
            '@navigation': './src/navigation',
            '@screens': './src/screens',
            '@store': './src/store',
          },
        },
      ],
    ],
  };
};
