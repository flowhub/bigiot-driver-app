const noflo = require('noflo');

const ReactDOM = require('react-dom');
const React = require('react');

const List = require('@material-ui/core/List').default;
const ListItem = require('@material-ui/core/ListItem').default;
const ListItemText = require('@material-ui/core/ListItemText').default;
const ListItemSecondaryAction = require('@material-ui/core/ListItemSecondaryAction').default;
const IconButton = require('@material-ui/core/IconButton').default;
const NavigationIcon = require('@material-ui/icons/Navigation').default;


function siteListItem(site, emitEvent) {
  const e = React.createElement;
  const key = `${site.latitude}-${site.longitude}`;

  function selectSite() {
    emitEvent({ type: 'select', payload: site });
  }
  function navigateTo() {
    emitEvent({ type: 'navigate', payload: site });
  }

  const item = e(ListItem, { key, onClick: selectSite }, [
    e(ListItemText, { key: 'text', primary: `${site.distance} meters`, secondary: `${site.vacant} free parking spaces` }),
    e(ListItemSecondaryAction, { key: 'secondary' }, [
      e(IconButton, { key: 'nav-button', onClick: navigateTo, 'aria-label': 'Navigate to' }, [
        e(NavigationIcon, { key: 'nav-icon' }),
      ]),
    ]),
  ]);
  return item;
}

function render(mount, sites, emitEvent) {
  const e = React.createElement;

  const details =
    e(List, { }, sites.map(s => siteListItem(s, emitEvent)));

  return ReactDOM.render(details, mount);
}


exports.getComponent = () => {
  const c = new noflo.Component();
  c.description = 'Render list of details about parking sites';

  c.inPorts.add('mount', {
    datatype: 'object',
  });
  c.inPorts.add('sites', {
    datatype: 'array',
  });

  c.outPorts.add('event', {
    datatype: 'object',
  });
  c.outPorts.add('error', {
    datatype: 'object',
  });

  c.process((input, output) => {
    if (!input.hasData('mount', 'sites')) {
      return;
    }

    const [mount, sites] = input.getData('mount', 'sites');
    const emitEvent = (event) => {
      output.send({ event });
    };
    render(mount, sites, emitEvent);

    output.done(true);
  });
  return c;
};


