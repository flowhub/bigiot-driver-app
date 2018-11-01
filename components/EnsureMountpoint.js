const noflo = require('noflo');

function ensureMountpoint(id) {
  let mount = document.getElementById(id);
  if (mount) {
    return mount;
  }
  const container = window.document.body;
  mount = document.createElement('div');
  mount.id = id;
  container.appendChild(mount);
  return mount;
}

exports.getComponent = () =>
  noflo.asComponent(ensureMountpoint, {
    description: 'Find DOM element, or create it if not existing',
  });
