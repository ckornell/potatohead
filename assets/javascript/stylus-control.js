(function(){
  var socket = io.connect('http://localhost:2000');
 
  $('.submit-change').on('click', function(e){
    e.preventDefault();
    e.stopPropagation();
    var section  = $(this).data('section');
    var formData = $(this).parents('form').serializeObject();
    socket.emit('stylus rewrite', {directive: section, form: formData});
  });

  socket.on('refreshFrame', function() {
    function reloadIframe() {
      var $iframe = $('#preview_iframe');
      var src     = $iframe.attr('src'); 
      var rdm     = randomCacheBuster(2000, 1000);
      console.log(src);
      if(/\?layout/g.test(src)) {
        $iframe.attr('src', src + "&refresh=" + rdm);
      } else {
        $iframe.attr('src', src + "?refresh=" + rdm);
      }
      
    }

    reloadIframe();
    console.warn('reloading');
  });
})();