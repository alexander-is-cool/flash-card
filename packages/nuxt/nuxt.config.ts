import type { NuxtConfig } from '@nuxt/types';
import * as path from 'path';

const config: NuxtConfig = {
  server: { port: 8000 },
  srcDir: path.resolve(__dirname),
  buildDir: path.resolve(__dirname, '.nuxt'),
  css: ['~/assets/css/styles.css'],
  plugins: ['~/plugins/composition.ts'],
  buildModules: ['@nuxt/typescript-build'],
  build: {
    extend(config: any) {
      const svgRule = config.module.rules.find((rule: any) =>
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

export default config;
