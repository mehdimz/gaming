

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
