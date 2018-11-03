const postMessage = require('noflo-runtime-postmessage');

const exported = {
  'noflo-runtime-postmessage': postMessage,
};

if (window) {
  window.require = function (moduleName) {
    if (exported[moduleName]) {
      return exported[moduleName];
    }
    throw new Error(`Module ${moduleName} not available`);
  };
}
