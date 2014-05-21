(function(){
  var qrcode;
  var $loader = $('#loader');

  $('.submenu > li a').on('click', function(){
    var link = $(this);
    changeFrameLocation(link);
  });

  function changeFrameLocation(selector) {
    var $iframe = $('#preview_iframe');
    var $selected = $(selector)
    var partial = $selected.text().trim().replace('.html', '');
    var src = formatSection($selected.data('section'), partial);
    $loader.show();
    $iframe.attr('src', src);
  }

  function formatSection(section, partial) {
    var format = 'http://localhost:3008?layout=default';
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
      case 'categories':
        format += '&views:categories=categories/';
        break;
      case 'home':
        format += '&views:home=home/';
        break;
    }

    if(partial === 'slide_menu') {
      format = 'http://localhost:3008?layout=slide_menu&views:header=header/';
    }
    
    var url = format + partial + "&refresh="+ randomCacheBuster(100, 300);
    qrcode.clear();
    qrcode.makeCode(url);
    return url;
  }

  qrcode = new QRCode("qrcode", {
    text: "http://localhost:3008?layout=default",
    width: 128,
    height: 128,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
  });

  document.getElementById('preview_iframe').onload = function() {
    $loader.hide();
  }

}());

