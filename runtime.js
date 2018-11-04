const postMessageRuntime = require('noflo-runtime-postmessage');
const noflo = require('noflo');

const defaultPermissions = [
  'protocol:graph',
  'protocol:component',
  'protocol:network',
  'protocol:runtime',
  'component:getsource',
  'component:setsource',
];

module.exports = (graph, options = {}) => new Promise((resolve, reject) => {
  const runtimeOptions = {
    baseDir: options.baseDir,
    defaultPermissions,
    defaultGraph: options.noLoad ? null : graph,
  };
  switch (options.protocol) {
    case 'opener': {
      if (!options.debugButton) {
        reject(new Error('No debug button defined'));
        return;
      }
      options.debugButton.classList.replace('nodebug', 'debug');
      resolve(postMessageRuntime.opener(runtimeOptions, options.debugButton));
      return;
    }
    case 'iframe': {
      resolve(postMessageRuntime.iframe(runtimeOptions));
      return;
    }
    default: {
      reject(new Error(`Unknown FBP protocol ${options.protocol}`));
    }
  }
});
