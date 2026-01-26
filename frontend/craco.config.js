// craco.config.js
const path = require("path");
require("dotenv").config();

// ENV checks
const isDevServer = process.env.NODE_ENV !== "production";
const isProdBuild = process.env.NODE_ENV === "production";

// Feature flags
const config = {
  enableHealthCheck: process.env.ENABLE_HEALTH_CHECK === "true",
  enableVisualEdits: isDevServer,
};

// Visual edits (DEV ONLY)
let setupDevServer;
let babelMetadataPlugin;

if (config.enableVisualEdits) {
  setupDevServer = require("./plugins/visual-edits/dev-server-setup");
  babelMetadataPlugin = require("./plugins/visual-edits/babel-metadata-plugin");
}

// Health check
let WebpackHealthPlugin;
let setupHealthEndpoints;
let healthPluginInstance;

if (config.enableHealthCheck) {
  WebpackHealthPlugin = require("./plugins/health-check/webpack-health-plugin");
  setupHealthEndpoints = require("./plugins/health-check/health-endpoints");
  healthPluginInstance = new WebpackHealthPlugin();
}

const cracoConfig = {
  eslint: {
    configure: {
      extends: ["plugin:react-hooks/recommended"],
      rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
      },
    },
  },

  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },

    configure: (webpackConfig) => {
      // Ignore heavy folders
      webpackConfig.watchOptions = {
        ...webpackConfig.watchOptions,
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/build/**",
          "**/dist/**",
          "**/coverage/**",
          "**/public/**",
        ],
      };

      // Health plugin
      if (config.enableHealthCheck && healthPluginInstance) {
        webpackConfig.plugins.push(healthPluginInstance);
      }

      // 🔥 NUCLEAR FIX: REMOVE react-refresh/babel FROM ALL BABEL LOADERS IN PROD
      if (isProdBuild && webpackConfig.module?.rules) {
        const stripReactRefresh = (rule) => {
          if (!rule) return;

          if (rule.options?.plugins) {
            rule.options.plugins = rule.options.plugins.filter((p) => {
              const name = Array.isArray(p) ? String(p[0]) : String(p);
              return !name.includes("react-refresh");
            });
          }

          if (Array.isArray(rule.use)) {
            rule.use.forEach((u) => {
              if (u?.options?.plugins) {
                u.options.plugins = u.options.plugins.filter((p) => {
                  const name = Array.isArray(p) ? String(p[0]) : String(p);
                  return !name.includes("react-refresh");
                });
              }
            });
          }

          if (Array.isArray(rule.oneOf)) {
            rule.oneOf.forEach(stripReactRefresh);
          }
        };

        webpackConfig.module.rules.forEach(stripReactRefresh);
      }

      return webpackConfig;
    },
  },
};

// Babel config (safe merge)
cracoConfig.babel = {
  plugins: [
    ...(cracoConfig.babel?.plugins || []),

    // Visual edits → DEV ONLY
    config.enableVisualEdits && babelMetadataPlugin,
  ].filter(Boolean),
};

// Dev server
cracoConfig.devServer = (devServerConfig) => {
  if (config.enableVisualEdits && setupDevServer) {
    devServerConfig = setupDevServer(devServerConfig);
  }

  if (
    config.enableHealthCheck &&
    setupHealthEndpoints &&
    healthPluginInstance
  ) {
    const originalSetup = devServerConfig.setupMiddlewares;

    devServerConfig.setupMiddlewares = (middlewares, devServer) => {
      if (originalSetup) {
        middlewares = originalSetup(middlewares, devServer);
      }
      setupHealthEndpoints(devServer, healthPluginInstance);
      return middlewares;
    };
  }

  return devServerConfig;
};

module.exports = cracoConfig;
