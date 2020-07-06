
module.exports = {
  pages: {
    'index': {
      entry: './src/main.ts',
      template: 'public/index.html',
      title: 'Welcome to my vue generator project',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    'bad': {
      entry: './src/error-instance.ts',
      template: 'public/bad.html',
      title: 'Error page',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    /* Disabled - Only one time
    'googleVerify': {
      entry: './src/error-instance.ts',
      template: 'public/somelink.html',
      title: 'Error page',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    */

  }
}
