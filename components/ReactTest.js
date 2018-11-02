const { Map, Marker, TileLayer } = require('react-leaflet');
const noflo = require('noflo');
const ReactDOM = require('react-dom');
const React = require('react');
const Leaflet = require('leaflet');

function parkingSiteMarker(site) {
  const e = React.createElement;

  const icon = new Leaflet.DivIcon({
    className: 'parking-site-icon',
    html: `<span>${site.vacant}</span>`,
  });

  const marker = e(Marker, {
    position: [site.longitude, site.latitude],
    key: `parking-site-${site.longitude}-${site.latitude}`,
    icon,
  }, []);

  return marker;
}

function render(mount, data) {
  const e = React.createElement;

  console.log('data', data);

  const position = [50.9375, 6.9603];

  var parkingSites = [];
  for (var d of data) {
    parkingSites = parkingSites.concat(d);
  }

  const markers = parkingSites.map(parkingSiteMarker);

  const map =
    e(Map, { center: position, zoom: 13 }, [
      e(TileLayer, {
        key: 'layer',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors',
      }),
    ].concat(markers));

  // const component = React.createElement('h1', null, 'Hello World');
  return ReactDOM.render(map, mount);
}

exports.getComponent = () => {
  const c = noflo.asComponent(render, {
    description: 'Test',
  });
  return c;
};

