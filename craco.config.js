module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        webpackConfig.resolve.fallback = {
          "util": require.resolve("util/"),
          "crypto": require.resolve("crypto-browserify"),
          "stream": require.resolve("stream-browserify"),
          "assert": require.resolve("assert/"),
          "url": require.resolve("url/"),
          "net": false,  // You can set these to false if you don't need these modules
          "tls": false   // Same for tls
        };
        return webpackConfig;
      }
    }
  };
  