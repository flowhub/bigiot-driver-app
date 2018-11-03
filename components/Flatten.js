const noflo = require('noflo');

function flatten(array) {
  const flat = array.reduce((items, item) => items.concat(item), []);
  return flat;
}

exports.getComponent = () => {
  const c = noflo.asComponent(flatten, {
    description: 'Flatten an array-of-arrays',
  });
  return c;
};
