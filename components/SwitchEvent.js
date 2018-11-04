const noflo = require('noflo');

const supportedEvents = ['select', 'navigate'];

exports.getComponent = () => {
  const c = new noflo.Component();
  c.description = ' ';
  c.icon = 'sign-out';

  c.inPorts.add('in', {
    description: 'Event',
    datatype: 'object',
  });

  supportedEvents.map((event) => {
    c.outPorts.add(event, {
      datatype: 'all',
    });
    return null;
  });

  c.outPorts.add(
    'error',
    { datatype: 'object' },
  );

  return c.process((input, output) => {
    if (!input.hasData('in')) {
      return;
    }

    const event = input.getData('in');

    // send to port with same name of the event type
    if (supportedEvents.indexOf(event.type) !== -1) {
      const send = {};
      send[event.type] = event.payload;
      output.sendDone(send);
    } else {
      output.done(new Error(`Unsupported event type: ${event.type}`));
    }
  });
};
