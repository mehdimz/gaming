window.$ = window.jQuery = require('jquery');
// window.Tether = require('tether');
// require('./js/bootstrap.min.js');
// require('./js/owl.carousel.js');
// require('./js/video.js');
// require('./js/my.js');
// require('./auth/password-validity');
require('./amir/thumbs');



require('./js/plugins/bootstrap.min.js');
require('./js/plugins/shapes-polyfill.min.js');
require('./js/plugins/jquery.hexagonprogress.min.js');
require('./js/plugins/bootstrap.min.js');
require('./js/plugins/skrollr.min.js');
require('./js/plugins/jarallax.js');
require('./js/plugins/smoothscroll.js');
require('./js/plugins/owl.carousel.min.js');
require('./js/plugins/jquery.countdown.min.js');
require('./js/plugins/youplay.min.js');
require('./js/plugins/jquery.magnific-popup.min');
var videojs = window.videojs = require('video.js');
var videoJsResolutionSwitcher = require('videojs-resolution-switcher');

videojs('really-cool-video').videoJsResolutionSwitcher();


// init youplay
if (typeof youplay !== 'undefined') {
  youplay.init({
    smoothscroll: false
  });
}

$('.countdown').each(function() {
  $(this).countdown($(this).attr('data-end'), function(event) {
    $(this).text(
      event.strftime('%D روز %H:%M:%S')
    );
  });
});

(function(i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r;
  i[r] = i[r] || function() {
    (i[r].q = i[r].q || []).push(arguments)
  }, i[r].l = 1 * new Date();
  a = s.createElement(o),
    m = s.getElementsByTagName(o)[0];
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-79514264-1', 'auto');
ga('send', 'pageview');



//socials
$('.twitter-share-button, .facebook-share-button, .telegram-share-button').click(function(event) {
  var width  = 575,
      height = 400,
      left   = ($(window).width()  - width)  / 2,
      top    = ($(window).height() - height) / 2,
      url    = this.href,
      opts   = 'status=1' +
               ',width='  + width  +
               ',height=' + height +
               ',top='    + top    +
               ',left='   + left;

  if($(this).data('telegram')){
    url += encodeURIComponent(location.href);
  }
  
  window.open(url, 'twitter', opts);

  return false;
});
