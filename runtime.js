const noflo = require('noflo');
const postMessageRuntime = require('noflo-runtime-postmessage');
const qs = require('querystring');

const defaultPermissions = [
  'protocol:graph',
  'protocol:component',
  'protocol:network',
  'protocol:runtime',
  'component:getsource',
  'component:setsource',
];

function getParameterByName(name) {
  const params = (new URL(document.location)).searchParams;
  return params.get(name);
}

function getIdeUrl(ide = 'https://app.flowhub.io') {
  const query = qs.stringify({
    protocol: 'opener',
    address: window.location.href,
  });
  return `${ide}#runtime/endpoint?${query}`;
}

function loadGraph(json) {
  return new Promise((resolve, reject) => {
    noflo.graph.loadJSON(json, (err, graphInstance) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(graphInstance);
    });
  });
}

function startRuntime(graph, options = {}) {
  return new Promise((resolve, reject) => {
    const noLoad = options.noLoad || (getParameterByName('fbp_noload') === 'true');
    const protocol = options.protocol || getParameterByName('fbp_protocol') || 'opener';

    const runtimeOptions = {
      ...options.runtimeOptions,
      defaultGraph: noLoad ? null : graph,
    };
    if (!runtimeOptions.defaultPermissions) {
      runtimeOptions.defaultPermissions = defaultPermissions;
    }

    switch (protocol) {
      case 'opener': {
        if (!options.debugButton) {
          reject(new Error('No debug button defined'));
          return;
        }
        const button = options.debugButton;
        button.classList.replace('nodebug', 'debug');
        button.href = getIdeUrl(options.ide);
        resolve(postMessageRuntime.opener(runtimeOptions, button));
        return;
      }
      case 'iframe': {
        resolve(postMessageRuntime.iframe(runtimeOptions));
        return;
      }
      default: {
        reject(new Error(`Unknown FBP protocol ${protocol}`));
      }
    }
  });
}

module.exports = (graph, options) => loadGraph(graph)
  .then(graphInstance => startRuntime(graphInstance, options));
