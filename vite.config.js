import path from "path";
import { defineConfig } from "vite";
import vitePluginVue from "@vitejs/plugin-vue2";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";
import legacy from "@vitejs/plugin-legacy";
import Unocss from "unocss/vite";
import { splitVendorChunkPlugin } from "vite";
import requireContext from "rollup-plugin-require-context"; // 处理兼容webpack工具require-context;
import Pages from 'vite-plugin-pages'
// https://vitejs.dev/config/
export default defineConfig({
  base: "/digital-twin/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "element-ui": ["element-ui"],
        },
        sourcemap: false
      },
    },
    minify: false
  },
  optimizeDeps: {
  },
  resolve: {
    // 忽略后缀名的配置选项, 添加 .vue 选项时要记得原本默认忽略的选项也要手动写入
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
    alias: [
      {
        find: "~/",
        replacement: `${path.resolve(__dirname, "src")}/`,
      },
    ],
  },
  plugins: [
    requireContext(),
    vitePluginVue(),
    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: ["vue", "vue/macros", "@vueuse/core", "pinia"],
      dts: true,
      dirs: ["src/composables"],
      vueTemplate: true,
    }),
    // Components({
    //   resolvers: [ElementUiResolver()]
    // }),
    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss(),
    legacy({
      targets: ["defaults", "not ie < 9"],
    }),
    splitVendorChunkPlugin(),
    Pages({})
  ],
  server: {
    port: 7456,
    proxy: {
      "/java": {
        target: "http://atcc-workshop.autopaddle.com",
        // target: "http://atcc-workshoptest.ciih.net",
        // target: "http://192.168.1.7:8088",
        changeOrigin: true,
      },
    },
  },
});
