const { Map, Marker, TileLayer } = require('react-leaflet');
const noflo = require('noflo');
const ReactDOM = require('react-dom');
const React = require('react');
const Leaflet = require('leaflet');

function parkingSiteMarker(site) {
  const e = React.createElement;

  const icon = new Leaflet.DivIcon({
    className: 'parking-site-icon',
    html: `${site.vacant}`,
  });

  const marker = e(Marker, {
    position: [site.latitude, site.longitude],
    key: `parking-site-${site.latitude}-${site.longitude}`,
    icon,
  }, []);

  return marker;
}


// # TODO: render a marker for current location
function render(mount, sites, center) {
  const e = React.createElement;

  const centerLatLon = [center.latitude, center.longitude];
  const markers = sites.map(parkingSiteMarker);

  const map =
    e(Map, { center: centerLatLon, zoom: 13 }, [
      e(TileLayer, {
        key: 'layer',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors',
      }),
    ].concat(markers));

  return ReactDOM.render(map, mount);
}

exports.getComponent = () => {
  const c = noflo.asComponent(render, {
    description: 'Test',
  });
  return c;
};

