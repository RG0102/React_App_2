module.exports = {
    resolve: {
      fallback: {
        "buffer": require.resolve("buffer/"),
        "path": require.resolve("path-browserify"),
        "os": require.resolve("os-browserify"),
        "fs": false,  // Use false if you don't need the 'fs' module in the browser
        "vm": require.resolve("vm-browserify"),
        "dns": false,
        "fs": false,
      },
    },
  };
  