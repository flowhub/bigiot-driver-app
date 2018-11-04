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
    <g
       id="car-icon"
       transform="translate(63.100403,46.990602)">
      <g
         id="g956"
         transform="translate(19.139834,-107.66157)">
        <g
           id="g987"
           transform="matrix(1.3685326,0,0,1.3685326,-65.797803,-120.19095)">
          <path
             inkscape:connector-curvature="0"
             id="path2301"
             style="fill:#000000"
             d="m 214.06,176.82 h 41.43 c 22.55,0 34.52,12.32 40.04,26.73 l 29.33,75.67 c 11.62,1.48 32.22,15.14 32.22,40.98 v 96.24 h -28.53 v 30.77 c 0,37.87 -53.59,37.43 -53.59,0 v -30.77 h -96.39 -0.06 0.06 -0.05 -96.393 v 30.77 c 0,37.43 -53.599,37.87 -53.599,0 V 416.44 H 0 V 320.2 c 0,-25.84 20.577,-39.5 32.197,-40.98 l 29.335,-75.67 c 5.522,-14.41 17.487,-26.73 40.038,-26.73 h 41.91 z" />
          <g
             id="g975">
            <path
               d="M 178.51,278.44 H 178.46 62.57 l 22.085,-59.56 c 2.761,-8.36 6.904,-14.4 16.565,-14.49 h 77.24 0.05 0.06 77.27 c 9.66,0.09 13.8,6.13 16.57,14.49 l 22.08,59.56 H 178.57 Z"
               style="fill:#ffffff"
               id="path2315"
               inkscape:connector-curvature="0" />
            <g
               id="g2317">
              <g
                 id="g2319">
                <path
                   d="m 56.18,358.44 c -13.672,0 -24.758,-11.42 -24.758,-25.51 0,-14.1 11.086,-25.52 24.758,-25.52 13.673,0 24.757,11.42 24.757,25.52 0,14.09 -11.084,25.51 -24.757,25.51 z"
                   style="fill:#ffffff"
                   id="path2321"
                   inkscape:connector-curvature="0" />
                <path
                   d="M 56.18,332.93"
                   style="fill:#ffffff"
                   id="path2323"
                   inkscape:connector-curvature="0" />
              </g>
              <g
                 id="g2325">
                <path
                   d="m 300.88,358.44 c 13.67,0 24.76,-11.42 24.76,-25.51 0,-14.1 -11.09,-25.52 -24.76,-25.52 -13.67,0 -24.76,11.42 -24.76,25.52 0,14.09 11.09,25.51 24.76,25.51 z"
                   style="fill:#ffffff"
                   id="path2327"
                   inkscape:connector-curvature="0" />
                <path
                   d="M 300.88,332.93"
                   style="fill:#ffffff"
                   id="path2329"
                   inkscape:connector-curvature="0" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
    </defs>
  </svg>
`;

function svgIcon(name) {
  const [width, height] = [512, 512]; // needs to match what is used in original SVG geometry
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
    iconSize: ['use-css', 'use-css'],
  });

  const marker = e(Marker, {
    position: [site.latitude, site.longitude],
    key: `parking-site-${site.latitude}-${site.longitude}`,
    icon,
  }, []);

  return marker;
}

function currentLocationMarker(location) {
  const e = React.createElement;

  const icon = new Leaflet.DivIcon({
    className: 'current-location-icon',
    html: svgIcon('car-icon'),
    iconSize: ['use-css', 'use-css'],
  });

  const marker = e(Marker, {
    position: [location.latitude, location.longitude],
    key: 'current-location',
    icon,
  }, []);

  return marker;
}


// # TODO: render a marker for current location
function render({ mount, sites = [], center }) {
  const e = React.createElement;

  const centerLatLon = [center.latitude, center.longitude];
  const markers = sites.map(parkingSiteMarker).concat([currentLocationMarker(center)]);

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
  const c = new noflo.Component();
  c.inPorts.add('mount', {
    datatype: 'object',
    required: true,
  });
  c.inPorts.add('center', {
    datatype: 'object',
    required: true,
  });
  c.inPorts.add('sites', {
    datatype: 'array',
  });
  c.outPorts.add('out', {
    datatype: 'object',
  });
  c.outPorts.add('error', {
    datatype: 'object',
  });
  c.setUp = (callback) => {
    c.state = {};
    callback();
  };
  c.tearDown = (callback) => {
    delete c.state;
    callback();
  };
  c.process((input, output) => {
    if (!input.hasData('mount') && !c.state.mount) {
      // We can't render without a mountpoint
      return;
    }
    if (!input.hasData('center') && !c.state.center) {
      // We can't render without a map center
      return;
    }
    Object.keys(c.inPorts.ports).forEach((port) => {
      if (!input.hasData(port)) {
        return;
      }
      c.state[port] = input.getData(port);
    });
    output.sendDone({
      out: render(c.state),
    });
  });
  return c;
};

