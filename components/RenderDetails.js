const noflo = require('noflo');

const ReactDOM = require('react-dom');
const React = require('react');

const List = require('@material-ui/core/List').default;
const ListItem = require('@material-ui/core/ListItem').default;
const ListItemText = require('@material-ui/core/ListItemText').default;

function siteListItem(site) {
  const e = React.createElement;
  const key = `${site.latitude}-${site.longitude}`;

  const item = e(ListItem, { key }, [
    e(ListItemText, { key: 'text', primary: `${site.distance} meters`, secondary: `${site.vacant} free parking spaces` }),
  ]);

  return item;
}

function render(mount, sites) {
  const e = React.createElement;

  const details =
    e(List, { }, sites.map(siteListItem));

  return ReactDOM.render(details, mount);
}

exports.getComponent = () => {
  const c = noflo.asComponent(render, {
    description: 'Render list of details about parking sites',
  });
  return c;
};
