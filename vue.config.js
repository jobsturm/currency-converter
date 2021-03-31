module.exports = {
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        args[0].title = 'Currency Converter - Job Sturm';
        return args;
      });
  },
  devServer: {
    overlay: {
      warnings: false,
      errors: true,
    },
  },
  publicPath: '',
};
