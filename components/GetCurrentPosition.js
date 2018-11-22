const noflo = require('noflo');

// @runtime noflo-browser

exports.getComponent = () => {
  const c = new noflo.Component();
  c.description = 'Get user\'s current location';
  c.icon = 'location-arrow';
  c.inPorts.add('in', {
    datatype: 'bang',
  });
  c.outPorts.add('out', {
    datatype: 'object',
  });
  c.outPorts.add('error', {
    datatype: 'object',
  });
  c.process((input, output) => {
    if (!input.hasData('in')) {
      return;
    }
    input.getData('in');
    if (!navigator.geolocation) {
      output.done(new Error('Location API not available'));
      return;
    }
    navigator.geolocation.getCurrentPosition((pos) => {

      output.sendDone({
        out: {
          latitude: 50.9578353,
          longitude: 6.8272381,
          accuracy: pos.coords.accuracy,
        },
      });
    }, (err) => {
      output.done(new Error(err.message || 'Failed to acquire position'));
    });
  });
  return c;
};
