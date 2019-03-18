module.exports = {
    css: {
        loaderOptions : {
            sass: {
                data: `
                @import "@/scss/styling.scss";
                `
            }
        }
    },
    configureWebpack: {
        module: {
            rules: [
                {
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /node_modules/               
                }
            ]
        }
    }
}