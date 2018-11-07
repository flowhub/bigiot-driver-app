const noflo = require('noflo');

function normalizeSite(site) {
  const normalized = Object.assign({}, site);
  // Some offerings have .free instead of .vacant
  if (typeof site.vacant === 'undefined' && typeof site.free === 'number') {
    normalized.vacant = site.free;
  }
  return normalized;
}

function normalizeSites(sites) {
  return sites.map(normalizeSite);
}

exports.getComponent = () => {
  const c = noflo.asComponent(normalizeSites, {
    description: 'Normalize different payloads for site',
  });
  return c;
};
