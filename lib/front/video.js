var videojs = window.videojs = require('video.js');
require('videojs-resolution-switcher');

$('.really-cool-video').each(function(index) {
  // videojs('really-cool-video').videoJsResolutionSwitcher();
  var id = $(this).attr('id');
  videojs(id).videoJsResolutionSwitcher();
});
