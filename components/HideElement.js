const noflo = require('noflo');

exports.getComponent = () => {
  const c = new noflo.Component();
  c.inPorts.add('in', {
    datatype: 'bang',
  });
  c.inPorts.add('id', {
    datatype: 'string',
    control: true,
    required: true,
  });
  c.outPorts.add('out', {
    datatype: 'bang',
  });
  c.outPorts.add('error', {
    datatype: 'object',
  });
  c.process((input, output) => {
    if (!input.hasData('in', 'id')) {
      return;
    }
    const id = input.getData('id');
    input.getData('in');
    const element = document.getElementById(id);
    if (!element) {
      output.done(new Error(`Element #${id} not found`));
    }
    element.style.display = 'none';
    output.sendDone({
      out: true,
    });
  });
  return c;
};
