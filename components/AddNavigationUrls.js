const noflo = require('noflo');

// Format a directions URL for Google Maps
// https://developers.google.com/maps/documentation/urls/guide#directions-action
function navUrl(location) {
  const url = new URL('maps/dir/?api=1', 'https://www.google.com');
  url.searchParams.set('travelmode', 'driving');
  url.searchParams.set('destination', `${location.latitude},${location.longitude}`);
  url.searchParams.set('origin', `${50.9578353},${6.8272381}`);
  return url.toString();
}

function addNavigationUrls(sites) {
  const withNav = sites.map(s => ({ ...s, navigationUrl: navUrl(s) }));
  return withNav;
}

exports.getComponent = () => {
  const c = noflo.asComponent(addNavigationUrls, {
    description: 'Add navigation URLs using Google Maps',
  });
  return c;
};
