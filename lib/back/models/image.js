'use strict';
var lwip = require('lwip');
var fs = require('fs');
var shortid = require('shortid');

var Schema = {};

Schema.saveImage = function(file, cb) {
  lwip.open(file.path, 'JPEG', function(err, img) {
    if (err) return cb(err);
    var id = shortid.generate();
    var path = __dirname + '/../../storage/images/free/' + id + '.jpg';
    img
      .writeFile(path, 'jpg', { quality: 60 },
        function(err) {
          if (err) return cb(err);
          cb(null, path.split('/storage').pop());
        });
  });
};

Schema.unlink = function(imageName, cb) {
  fs.unlink(__dirname + '/../../storage/images/free/' + imageName , cb);
};



module.exports = Schema;
