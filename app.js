const postMessage = require('noflo-runtime-postmessage');
const noflo = require('noflo');

const exported = {
  'noflo-runtime-postmessage': postMessage,
  'noflo': noflo,
};

if (window) {
  window.require = function (moduleName) {
    if (exported[moduleName]) {
      return exported[moduleName];
    }
    throw new Error(`Module ${moduleName} not available`);
  };
}
