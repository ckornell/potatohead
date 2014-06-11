(function(){
  var host    = window.location.href;
  var socket  = io.connect(host);
 
  $('.submit-change').on('click', function(e){
    e.preventDefault();
    e.stopPropagation();
    var section  = $(this).data('section');
    var formData = $(this).parents('form').serializeObject();
    socket.emit('stylus rewrite', {directive: section, form: formData});
  });

  socket.on('refreshFrame', function() {

    $('#loader').show();

    var $iframe = $('#preview_iframe');
    var src     = $iframe.attr('src'); 
    var rdm     = randomCacheBuster(2000, 1000);
    
    if(/\?layout/g.test(src)) {
      $iframe.attr('src', src + "&refresh=" + rdm);
    } else {
      $iframe.attr('src', src + "?refresh=" + rdm);
    }
    
  });

  socket.on('reloading', function() {
    $('#loader').show();
  });

  socket.on('refresh', function() {
    window.location.reload(true);
  });

}());