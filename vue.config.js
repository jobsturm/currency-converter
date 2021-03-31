module.exports = {
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        args[0].title = 'Adyen Techincal Test - Job Sturm';
        return args;
      });
  },
  devServer: {
    overlay: {
      warnings: false,
      errors: true,
    },
  },
  publicPath: '/',
};
