function DisableWarnings(options) {}

DisableWarnings.prototype.apply = function (compiler) {
  compiler.hooks.emit.tap("warnings", function (compilation) {
    compilation.warnings = [];
  });
};

module.exports = DisableWarnings;
