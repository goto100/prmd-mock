const camelCase = require('lodash').camelCase;

exports.hrefToPath = function (href) {
  return href.replace(/\{\(.+?\)\}/g, function(part) {
    const [instancePart, subPart] = decodeURIComponent(part).slice(2, -2).split('#');
    let parts = [instancePart.replace(/^\/schemata\//, '')];
    parts = parts.concat(subPart.split(/\/?definitions\/?/g).filter(item => {
      return item !== '';
    }));
    return ':' + camelCase(parts.join('-'));
  });
};
