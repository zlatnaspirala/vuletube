
module.exports = {

  pages: {
    'index': {
      entry: './src/main.ts',
      template: 'public/index.html',
      title: 'Welcome to my vue generator project. First feature is youtube alternative player with 3d context and NUI/Voice controls interface.',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    'bad': {
      entry: './src/error-instance.ts',
      template: 'public/bad.html',
      title: 'Error page',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }

  },
  devServer: {
    port: 3000
  },
  css: {
    sourceMap: true
  },
  pwa: {
    name: 'VULETUBE',
    themeColor: '#000000',
    msTileColor: '#ffffff',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
  },

}
