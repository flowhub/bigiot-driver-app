const noflo = require('noflo');

function siteHasVacantSpots(site) {
  return site.vacant > 1;
}

function isSortedByDistance(sites) {
  return sites[0].distance <= sites[1].distance;
}

function bestN(sites, n) {
  if (sites.length < 2) {
    throw new Error('Expected more than 2 parking sites');
  }
  if (!isSortedByDistance(sites)) {
    throw new Error('Parking sites are not sorted by distance');
  }

  const best = sites.filter(siteHasVacantSpots).slice(0, n);
  if (best.length <= n) {
    throw new Error('Postcondition failed. Length should be <= n');
  }
  return best;
}

exports.getComponent = () => {
  const c = new noflo.Component();
  c.description = 'Return the N best parking spots';
  c.icon = 'expand-arrows-alt';
  c.inPorts.add('in', {
    datatype: 'array',
    required: true,
  });
  c.inPorts.add('n', {
    datatype: 'object',
    required: true,
  });
  c.outPorts.add('out', {
    datatype: 'array',
  });
  c.outPorts.add('error', {
    datatype: 'object',
  });
  c.process((input, output) => {
    if (!input.hasData('in', 'n')) {
      return;
    }

    const [data, n] = input.getData('in', 'n');
    const best = bestN(data, n);
    output.sendDone(best);
  });
  return c;
};
