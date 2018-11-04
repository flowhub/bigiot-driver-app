const noflo = require('noflo');

exports.getComponent = () => {
  const c = new noflo.Component();
  c.inPorts.add('in', {
    datatype: 'object',
  });
  c.inPorts.add('selector', {
    datatype: 'string',
    control: true,
    required: true,
  });
  c.process((input, output) => {
    if (!input.hasData('in', 'selector')) {
      return;
    }
    const [err, selector] = input.getData('in', 'selector');
    const element = document.querySelector(selector);
    if (!element) {
      output.done(new Error(`Element #${selector} not found`));
    }
    element.innerHTML = `ERROR: ${err.message || 'An error has occured'}`;
    if (element.parentElement) {
      element.parentElement.classList.add('error');
    }
    output.done();
  });
  return c;
};
