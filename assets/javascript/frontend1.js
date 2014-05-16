(function(){
  $('.submenu > li a').on('click', function(){
    var link = $(this);
    changeFrameLocation(link);
  });

  function changeFrameLocation(selector) {
    var $iframe = $('#preview_iframe');
    var $selected = $(selector)
    var partial = $selected.text().trim().replace('.html', '');
    var src = formatSection($selected.data('section'), partial);
    $iframe.attr('src', src);
  }

  function formatSection(section, partial) {
    var format = 'http://localhost:3008?layout=default';
    console.log(section, partial);
    switch(section) {
      case 'header': 
        format += '&views:header=header/';
        break;
      case 'footer':
        format += '&views:footer=footer/';
        break;
      case 'layouts':
        format = 'http://localhost:3008?layout=';
        break;
    }
    return format + partial + "&refresh="+ randomCacheBuster(100, 300);
  }
})();

