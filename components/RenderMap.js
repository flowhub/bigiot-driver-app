const { Map, Marker, TileLayer } = require('react-leaflet');
const noflo = require('noflo');
const ReactDOM = require('react-dom');
const React = require('react');
const Leaflet = require('leaflet');

// TODO: only put the iconset in once, and then just use references
const iconSet = `
  <svg width="0" height="0" class="icon-set">
     <defs>
    <circle
       id="parking-site-icon"
       cx="256.62244"
       cy="257.51282"
       r="244.0538" />
    </defs>
  </svg>
`

function svgIcon(name) {
  const [width, height] = [ 512, 512 ]; // needs to match what is used in original SVG geometry
  const useIcon = `<svg viewBox="0 0 ${width} ${height}"><use xlink:href="#${name}"></use></svg>`;
  return iconSet + useIcon;
}

function parkingStatus(site) {
    let status = 'unknown';
    if (site.vacant === 0) {
        status = 'unavailable';
    } else if (site.vacant <= 3) {
        status = 'low';
    } else if (site.vacant > 3) {
        status = 'available';
    }
    return status;
}

function parkingSiteMarker(site) {
  const e = React.createElement;

  const icon = new Leaflet.DivIcon({
    className: `parking-site-icon parking-${parkingStatus(site)}`,
    html: svgIcon('parking-site-icon'),
    iconSize: [ 'use-css', 'use-css' ],
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
    e(Map, { center: centerLatLon, zoom: 16 }, [
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

