'use strict';
var sanitizeHtml = require('sanitize-html');

module.exports = {
  sanitizeProperties: {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['span', 'img', 'video', 'source']),
    allowedAttributes: {
      '*': ['href', 'align', 'alt', 'center', 'bgcolor', 'style', 'src', 'type', 'label', 'class', 'poster', 'preload', 'id', 'controls']
    }
  }
};
