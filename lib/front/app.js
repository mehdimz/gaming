window.$ = window.jQuery = require('jquery');
require('./amir/thumbs');


require('./js/plugins/bootstrap.min.js');
require('./js/plugins/shapes-polyfill.min.js');
require('./js/plugins/jquery.hexagonprogress.min.js');
require('./js/plugins/jarallax.js');
require('./js/plugins/smoothscroll.js');
require('./js/plugins/owl.carousel.min.js');
require('./js/plugins/jquery.countdown.min.js');
require('./js/plugins/youplay.min.js');
require('./js/plugins/jquery.magnific-popup.min');
require('./amir/social');

// init youplay
$(document).ready(function() {

  if (typeof youplay !== 'undefined') {
    youplay.init({
      smoothscroll: true,
    });
  }
});
 
$('.countdown').each(function() {
  $(this).countdown($(this).attr('data-end'), function(event) {
    $(this).text(
      event.strftime('%D روز %H:%M:%S')
    );
  });
});
