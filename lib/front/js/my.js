$(document).ready(function() {

  var reply = $('');


  $(".search-box input").focusin(function() {
    $("i.fa-search").css('color', 'black');
  });
  $(".search-box input").focusout(function() {
    $("i.fa-search").css('color', 'white');
  });

  $(".tab-buttons li").on('click', function(e) {
    e.preventDefault();
    index = $(this).index();
    $(this).closest('header').next().children().hide().eq(index).show();
  });

  $(".tab-buttons li:nth-child(2)").on('click', function(e) {
    e.preventDefault();
    $('.comment-section').show();
    $('.border-bottom').css('left', '0');
    $('.border-bottom').css('right', 'inherit');
  });

  $(".tab-buttons li:first-child").on('click', function(e) {
    e.preventDefault();
    $('.comment-section').hide();
    $('.border-bottom').css('right', '0');
    $('.border-bottom').css('left', 'inherit');
  });

  $(".type-section textarea").on('focus', function(e) {
    $('.cancel-submit').show();
  });

  $(".type-section textarea").on('focusout', function(e) {
    $('.cancel-submit').hide();
  });

  $(".reply").on('click', function() {
    $('.reply-message-box').show(function() {
      $('.reply-message-box textarea').focus();
    });
  });

  $(".reply-message-box textarea").on('focusout', function() {
    $('.reply-message-box').hide(500);
  });

  $('.owl-carousel').owlCarousel({
    loop: true,
    rtl: true,
    margin: 15,
    nav: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 3
      },
      992: {
        items: 5
      },
      1367: {
        items: 7
      }
    }
  });




});
