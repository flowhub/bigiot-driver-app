
const bigiot = require('bigiot-js');

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

function rdfTypes(fields) {
  var obj = {};
  for (var f of fields) {
    obj[f.name] = f.rdfAnnotation.uri;
  }
  return obj;
}

function htmlElement(type, attributes={}, children=[]) {
    if (attributes.className) {
        attributes.class = attributes.className;
        delete attributes.className;
    }

    if (!Array.isArray(children)) {
        children = [ children ];
    }

    const attrValues = Object.keys(attributes).map((a) => `${a}=${attributes[a].toString()}`);
    const attrs = attrValues.length ? ' ' + attrs.join(' ') : '';
    const childs = children.map((c) => c.toString()).join('\n');
    return `<${type} ${attrs}>${childs}</${type}>`
}

function check(results) {
  
  var rows = []; 

  const tr = (a, c) => htmlElement('tr', a, c)
  const td = (a, c) => htmlElement('td', a, c)
  const table = (a, c) => htmlElement('table', a, c)
  const thead = (a, c) => htmlElement('thead', a, c)
  const tds = (a, vals) => vals.map((v) => td(a, v))
  const e = htmlElement;

  const header = thead({},
                  tr({}, tds({}, ['Offering', 'Error']))
  );

  console.log('h', header)

  // TODO: show organization, offering name in separate rows
  // TODO: show SSL, CORS, error, fields separately
  for (var offering of results) {
    const fetchError = offering.errorMessage || '';
    const name = offering.offeringId;

    console.log('fo', offering);

    const row = tr({}, tds({}, [name, fetchError]));
    rows.push(row);


    //console.log(offering.offeringId, '\t\t\t', offering.errorMessage);
  }

  const contents = table({}, [ header, e('tbody', {}, rows) ]);

  return e('html', {}, [e('head', {}, []), e('body', {}, contents) ]); 
}

// Return relevant data about the offering
function processResults(fetchResults, category) {

  return fetchResults.map((r) => {
    const d = {
      offeringId: r.offering.id,
      providerId: r.offering.provider.id,
      organizationId: r.offering.provider.organization.id,
      active: r.offering.activation.status,
      endpoint: r.offering.endpoints[0].uri,
      license: r.offering.license,
      category: category,

      inputs: rdfTypes(r.offering.inputs),
      outputs: rdfTypes(r.offering.outputs),
      data: r.data,
      errorMessage: (r.error) ? r.error.message : null,
    };
    return d;
  });
}



// TODO: support inputs
function subscribeAndFetch(consumer, category) {

  const inputs = {};

  const name = category;
  const query = new bigiot.offering(name, category);
  // No requirements
  delete query.license;
  delete query.extent;
  delete query.price;

  // TODO: track access time
  function accessOfferingNoError(offering) {
    return consumer.subscribe(offering.id).then((subscription) => {
      return consumer.access(subscription, inputs).then((data) =>
        new Object({ offering: offering, data: data}))
      .catch((err) =>
        new Object({offering: offering, error: err})); 
    });
  }

  return consumer.discover(query)
  .then((allOfferings) => {
    return Promise.all(allOfferings.map((o) => accessOfferingNoError(o)))
  })
  .then((results) => {
    return processResults(results);
  })

}

const knownCategories = [
  'urn:big-iot:ChargingStationCategory',
  'urn:big-iot:BikeSharingStationCategory',
  'urn:big-iot:ParkingSpaceCategory',
  'urn:big-iot:TrafficDataCategory',
  'urn:big-iot:NoisePollutionIndicatorCategory',
  'urn:big-iot:WeatherIndicatorCategory',
  'urn:big-iot:COCategory',
  'urn:proposed:Traffic_Speed',
  'urn:big-iot:ParkingSiteCategory',
  'urn:big-iot:ParkingCategory',
  'urn:big-iot:MobilityFeatureCategory',
  'urn:big-iot:AccidentCategory',
  'urn:big-iot:PM10Category',
  'urn:big-iot:NO2Category',
  'urn:big-iot:AirPollutionIndicatorCategory',
  'urn:big-iot:PM25Category',
  'urn:proposed:proposed:wifiprobes',
  'urn:big-iot:PeopleDensityOnBusCategory',
  'urn:big-iot:LocationTrackingCategory',
  'urn:big-iot:PeopleDensityInAreaCategory',
]

function main() {

  //process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  const config = {
    id: process.env.BIGIOT_CONSUMER_ID,
    secret: process.env.BIGIOT_CONSUMER_SECRET,
  };

  const consumer = new bigiot.consumer(config.id, config.secret);

  const checkCategory = (category) => {
    return subscribeAndFetch(consumer, category).then((data) => {
        return data;
    });
  };

  consumer.authenticate().then(() => {
    return Promise.all(knownCategories.map((c) => checkCategory(c)));
  }).then((cc) => {
    const flat = flatten(cc);
    console.log(JSON.stringify(flat));
  }).catch((err) => {
    console.error('error', err);
    process.exit(1);
  });
}

module.exports = {
  check: check,
}

if (!module.parent) { main() }




