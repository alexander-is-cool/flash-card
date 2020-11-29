const path = require('path');

module.exports = {
  srcDir: path.resolve(__dirname),
  buildDir: path.resolve(__dirname, '.nuxt'),
  css: ['~/assets/css/styles.css'],
  plugins: ['~/plugins/composition.ts'],
  buildModules: ['@nuxt/typescript-build'],
  build: {
    extend: (config) => {
      const svgRule = config.module.rules.find((rule) =>
        rule.test.test('.svg'),
      );

      svgRule.test = /\.(png|jpe?g|gif|webp)$/;

      config.module.rules.push({
        test: /\.svg$/,
        use: ['babel-loader', 'vue-svg-loader'],
      });
    },
  },
  telemetry: false,
};
