const noflo = require('noflo');
const postMessageRuntime = require('noflo-runtime-postmessage');
const pkg = require('./package.json');

const defaultPermissions = [
  'protocol:graph',
  'protocol:component',
  'protocol:network',
  'protocol:runtime',
  'component:getsource',
  'component:setsource',
];

module.exports = (graphName, options = {}) => new Promise((resolve, reject) => {
  const loader = new noflo.ComponentLoader(pkg.name);
  loader.load(`${pkg.name}/${graphName}`, (err, instance) => {
    if (err) {
      reject(err);
      return;
    }
    instance.on('ready', () => {
      const { graph } = instance.network;
      let rt;
      const runtimeOptions = {
        baseDir: pkg.name,
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
          rt = postMessageRuntime.opener(runtimeOptions, options.debugButton);
          break;
        }
        case 'iframe': {
          rt = postMessageRuntime.iframe(runtimeOptions);
          break;
        }
        default: {
          reject(new Error(`Unknown FBP protocol ${options.protocol}`));
          return;
        }
      }
      rt.network.once('addnetwork', (network) => {
        resolve(network);
      });
    });
  });
});
