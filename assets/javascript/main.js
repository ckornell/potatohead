(function(){
  $('.menu > li a').on('click', function(){
    var $this = $(this);
    $this.parent().find('> .submenu').toggle();
    $this.toggleClass('open');
  });

  $('.minicolors').minicolors({
    control: 'wheel',
    theme: 'default',
    defaultValue: '#fff'
  });

  $('.section-btn-header').on('click', function(e){
    e.preventDefault();
    var $this = $(this);
    $this.next('.variables').toggle();
    $this.toggleClass('open');
  });

}());