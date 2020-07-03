
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
    'googleVerify': {
      entry: './src/error-instance.ts',
      template: 'public/google1813c8928f8cf22f.html',
      title: 'Error page',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },

  }
}
