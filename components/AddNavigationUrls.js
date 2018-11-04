const noflo = require('noflo');

// Format a directions URL for Google Maps
// https://developers.google.com/maps/documentation/urls/guide#directions-action
function navUrl(location) {
  const destination = `${location.latitude},${location.longitude}`;
  const mode = 'driving';
  const base = 'https://www.google.com/maps/dir/?api=1';
  const url = `${base}&destination=${destination}&travelmode=${mode}`;
  return url;
}

function addNavigationUrls(sites) {
  const withNav = sites.map((s) => {
    const o = s; // XXX: no copy
    o.navigationUrl = navUrl(s);
    return o;
  });
  return withNav;
}

exports.getComponent = () => {
  const c = noflo.asComponent(addNavigationUrls, {
    description: 'Add navigation URLs using Google Maps',
  });
  return c;
};
