(function(){
  $('.menu > li a').on('click', function(){
    $(this).parent().find('> .submenu').toggle();
  });

  $('.minicolors').minicolors({
    control: 'wheel',
    theme: 'default'
  });
  
  
})();