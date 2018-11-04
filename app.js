const postMessage = require('noflo-runtime-postmessage');
const qs = require('querystring');
const noflo = require('noflo');
const runtime = require('./runtime');
const pkg = require('./package.json');
const graph = require('./graphs/main.fbp');

const ide = 'https://app.flowhub.io';

function getParameterByName(name) {
  const params = (new URL(document.location)).searchParams;
  return params.get(name);
}

function getIdeUrl() {
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

function main() {
  const debugButton = document.getElementById('flowhub_debug_url');
  debugButton.href = getIdeUrl();
  return loadGraph(graph)
    .then(graphInstance => runtime(graphInstance, {
      baseDir: pkg.name,
      protocol: getParameterByName('fbp_protocol') || 'opener',
      noLoad: (getParameterByName('fbp_noload') === 'true'),
      debugButton,
    }));
}

// We need to export require('noflo-runtime-postmessage')
// for noflo-runtime-headless to work
const exported = {
  'noflo-runtime-postmessage': postMessage,
};
window.require = (moduleName) => {
  if (exported[moduleName]) {
    return exported[moduleName];
  }
  throw new Error(`Module ${moduleName} not available`);
};

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    main();
  }, 10);
});
