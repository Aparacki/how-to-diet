const tsImportPluginFactory = require('ts-import-plugin')

module.exports = function(config) {
  config.module.rules.push({
    test: /\.css$/,
    loader: "style-loader!css-loader?modules"
  });
  config.module.rules.push({
    test: /\.less$/,
    use: [
      "style-loader",
      {
        loader: "css-loader",
        options: {
          sourceMap: 1
        }
      },
      {
        loader: "less-loader",
        options: {
          javascriptEnabled: true
        }
      }
    ]
  });

  config.module.rules[1].use[0].options.getCustomTransformers = function() { return ({
    before: [tsImportPluginFactory({
      "libraryName": "antd", "libraryDirectory": "es", "style": true
    })]
  })}

  return config;
};
