module.exports = {
  transpileDependencies: ['vuetify'],
  css: {
    loaderOptions: {
      scss: {
        prependData: `
                @import "@/scss/styling.scss";
                `,
      },
    },
  },
  devServer: {
    proxy: {
      '/images': {
        target: process.env.VUE_APP_DEV_BACKEND_URL,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/images': '/images',
        },
        // logLevel: 'debug',
      },
      '/banker': {
        target: process.env.VUE_APP_DEV_BACKEND_URL,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/banker': '/banker/api',
        },
        // logLevel: 'debug',
      },
      '/communicator': {
        target: process.env.VUE_APP_DEV_BACKEND_URL,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/communicator': '/communicator/api',
        },
        // logLevel: 'debug',
      },
      '/geo': {
        target: process.env.VUE_APP_DEV_BACKEND_URL,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/geo': '/geosvc/api',
        },
        // logLevel: 'debug',
      },
      '/planner': {
        target: process.env.VUE_APP_DEV_BACKEND_URL,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/planner': '/planner/api',
        },
        // logLevel: 'debug',
      },
      '/profilesvc': {
        target: process.env.VUE_APP_DEV_BACKEND_URL,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/profilesvc': '/profilesvc/api',
        },
        // logLevel: 'debug',
      },
      '/rideshare': {
        target: process.env.VUE_APP_DEV_BACKEND_URL,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/rideshare': '/rideshare/api',
        },
        // logLevel: 'debug',
      },
    },
  },
}
