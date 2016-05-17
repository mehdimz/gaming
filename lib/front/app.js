// window.$ = window.jQuery = require('jquery');
// window.Tether = require('tether');
// require('./js/bootstrap.min.js');
// require('./js/owl.carousel.js');
// // require('./js/video.js');
// require('./js/my.js');

// // require('./auth/password-validity');
// require('./amir/thumbs');



require('./js/plugins/shapes-polyfill.min.js');
require('./js/plugins/jquery.hexagonprogress.min.js');
require('./js/plugins/bootstrap.min.js');
require('./js/plugins/skrollr.min.js');
require('./js/plugins/jarallax.js');
require('./js/plugins/smoothscroll.js');
require('./js/plugins/owl.carousel.min.js');
require('./js/plugins/jquery.countdown.min.js');

require('./js/plugins/youplay.min.js');
// init youplay
if(typeof youplay !== 'undefined') {
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