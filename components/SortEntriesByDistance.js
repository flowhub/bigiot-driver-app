const noflo = require('noflo');
const where = require('where');

exports.getComponent = () => {
  const c = new noflo.Component();
  c.description = 'Sort a list of geolocated results by distance to current location';
  c.icon = 'expand-arrows-alt';
  c.inPorts.add('in', {
    datatype: 'array',
    required: true,
  });
  c.inPorts.add('location', {
    datatype: 'object',
    required: true,
    control: true,
  });
  c.outPorts.add('out', {
    datatype: 'array',
  });
  c.outPorts.add('error', {
    datatype: 'object',
  });
  c.process((input, output) => {
    if (!input.hasData('in', 'location')) {
      return;
    }
    const [data, location] = input.getData('in', 'location');
    const current = new where.Point(location.latitude, location.longitude);
    const withDistance = data.map((entry) => {
      const point = new where.Point(entry.latitude, entry.longitude);
      return {
        ...entry,
        distance: current.distanceTo(point),
        bearing: current.bearingTo(point),
      };
    });
    withDistance.sort((a, b) => {
      if (a.distance < b.distance) {
        return -1;
      }
      if (b.distance < a.distance) {
        return 1;
      }
      return 0;
    });
    console.log(withDistance);
    output.sendDone(withDistance);
  });
  return c;
};
