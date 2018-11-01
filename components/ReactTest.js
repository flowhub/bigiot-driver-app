const noflo = require('noflo');
const ReactDOM = require('react-dom');
const React = require('react');

function render(mount) {
  const component = React.createElement('h1', null, 'Hello World');
  return ReactDOM.render(component, mount);
}

exports.getComponent = () => {
  const c = noflo.asComponent(render, {
    description: 'Test',
  });
  return c
}
