const postMessage = require('noflo-runtime-postmessage');
const runtime = require('./runtime');
const pkg = require('./package.json');
const graph = require('./graphs/main.fbp');

function main() {
  return runtime(graph, {
    runtimeOptions: {
      baseDir: pkg.name,
    },
    debugButton: document.getElementById('flowhub_debug_url'),
  });
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
  main()
    .catch((err) => {
      const message = document.querySelector('#app_splash h2');
      message.innerHTML = `ERROR: ${err.message}`;
      message.parentElement.classList.add('error');
    });
});
