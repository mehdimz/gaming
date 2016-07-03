'use strict';
var $ = require('jquery');

function setThumbs(data) {
  if (data.message) {
    alert(data.message);
  } else {
    $('#thumb-up .count').html(data.up);
    $('#thumb-down .count').html(data.down);
  }
}

$('#thumb-up').click(function(e) {
  e.preventDefault();
  $.post('/'+$(this).data('item-model')+'/' + $(this).data('item-id') + '/thumbs', { mode: 2 }).success(function(data) {
    setThumbs(data);
  });
});

$('#thumb-down').click(function() {
  $.post('/'+$(this).data('item-model')+'/' + $(this).data('item-id') + '/thumbs', { mode: 1 }).success(function(data) {
    setThumbs(data);
  });
});
