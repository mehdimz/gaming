'use strict';
var sanitizeHtml = require('sanitize-html');

module.exports = {
  sanitizeProperties: {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['span', 'img']),
    allowedAttributes: {
      '*': ['href', 'align', 'alt', 'center', 'bgcolor', 'style', 'src']
    }
  }
};
