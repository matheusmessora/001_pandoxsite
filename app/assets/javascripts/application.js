// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require_tree .
/** jquery.color.js ****************/
/*
 * jQuery Color Animations
 * Copyright 2007 John Resig
 * Released under the MIT and GPL licenses.
 */
/*
jQuery News Ticker
*/
(function($){  
  $.fn.ticker = function(options) { 
    // Extend our default options with those provided.
    // Note that the first arg to extend is an empty object -
    // this is to keep from overriding our "defaults" object.
    var opts = $.extend({}, $.fn.ticker.defaults, options); 

    // check that the passed element is actually in the DOM
    if ($(this).length == 0) {
      if (window.console && window.console.log) {
        window.console.log('Element does not exist in DOM!');
      }
      else {
        alert('Element does not exist in DOM!');    
      }
      return false;
    }
    
    /* Get the id of the UL to get our news content from */
    var newsID = '#' + $(this).attr('id');

    /* Get the tag type - we will check this later to makde sure it is a UL tag */
    var tagType = $(this).get(0).tagName;   

    return this.each(function() { 
      // get a unique id for this ticker
      var uniqID = getUniqID();
      
      /* Internal vars */
      var settings = {        
        position: 0,
        time: 0,
        distance: 0,
        newsArr: {},
        play: true,
        paused: false,
        contentLoaded: false,
        dom: {
          contentID: '#ticker-content-' + uniqID,
          titleID: '#ticker-title-' + uniqID,
          titleElem: '#ticker-title-' + uniqID + ' SPAN',
          tickerID : '#ticker-' + uniqID,
          wrapperID: '#ticker-wrapper-' + uniqID,
          revealID: '#ticker-swipe-' + uniqID,
          revealElem: '#ticker-swipe-' + uniqID + ' SPAN',
          controlsID: '#ticker-controls-' + uniqID,
          prevID: '#prev-' + uniqID,
          nextID: '#next-' + uniqID,
          playPauseID: '#play-pause-' + uniqID
        }
      };

      // if we are not using a UL, display an error message and stop any further execution
      if (tagType != 'UL' && tagType != 'OL' && opts.htmlFeed === true) {
        debugError('Cannot use <' + tagType.toLowerCase() + '> type of element for this plugin - must of type <ul> or <ol>');
        return false;
      }

      // set the ticker direction
      opts.direction == 'rtl' ? opts.direction = 'right' : opts.direction = 'left';
      
      // lets go...
      initialisePage();
      /* Function to get the size of an Object*/
      function countSize(obj) {
          var size = 0, key;
          for (key in obj) {
              if (obj.hasOwnProperty(key)) size++;
          }
          return size;
      };

      function getUniqID() {
        var newDate = new Date;
        return newDate.getTime();     
      }
      
      /* Function for handling debug and error messages */ 
      function debugError(obj) {
        if (opts.debugMode) {
          if (window.console && window.console.log) {
            window.console.log(obj);
          }
          else {
            alert(obj);     
          }
        }
      }

      /* Function to setup the page */
      function initialisePage() {
        // process the content for this ticker
        processContent();
        
        // add our HTML structure for the ticker to the DOM
        $(newsID).wrap('<div id="' + settings.dom.wrapperID.replace('#', '') + '"></div>');
        
        // remove any current content inside this ticker
        $(settings.dom.wrapperID).children().remove();
        
        $(settings.dom.wrapperID).append('<div id="' + settings.dom.tickerID.replace('#', '') + '" class="ticker"><div id="' + settings.dom.titleID.replace('#', '') + '" class="ticker-title"><span><!-- --></span></div><p id="' + settings.dom.contentID.replace('#', '') + '" class="ticker-content"></p><div id="' + settings.dom.revealID.replace('#', '') + '" class="ticker-swipe"><span><!-- --></span></div></div>');
        $(settings.dom.wrapperID).removeClass('no-js').addClass('ticker-wrapper has-js ' + opts.direction);
        // hide the ticker
        $(settings.dom.tickerElem + ',' + settings.dom.contentID).hide();
        // add the controls to the DOM if required
        if (opts.controls) {
          // add related events - set functions to run on given event
          $(settings.dom.controlsID).live('click mouseover mousedown mouseout mouseup', function (e) {
            var button = e.target.id;
            if (e.type == 'click') {  
              switch (button) {
                case settings.dom.prevID.replace('#', ''):
                  // show previous item
                  settings.paused = true;
                  $(settings.dom.playPauseID).addClass('paused');
                  manualChangeContent('prev');
                  break;
                case settings.dom.nextID.replace('#', ''):
                  // show next item
                  settings.paused = true;
                  $(settings.dom.playPauseID).addClass('paused');
                  manualChangeContent('next');
                  break;
                case settings.dom.playPauseID.replace('#', ''):
                  // play or pause the ticker
                  if (settings.play == true) {
                    settings.paused = true;
                    $(settings.dom.playPauseID).addClass('paused');
                    pauseTicker();
                  }
                  else {
                    settings.paused = false;
                    $(settings.dom.playPauseID).removeClass('paused');
                    restartTicker();
                  }
                  break;
              } 
            }
            else if (e.type == 'mouseover' && $('#' + button).hasClass('controls')) {
              $('#' + button).addClass('over');
            }
            else if (e.type == 'mousedown' && $('#' + button).hasClass('controls')) {
              $('#' + button).addClass('down');
            }
            else if (e.type == 'mouseup' && $('#' + button).hasClass('controls')) {
              $('#' + button).removeClass('down');
            }
            else if (e.type == 'mouseout' && $('#' + button).hasClass('controls')) {
              $('#' + button).removeClass('over');
            }
          });
          // add controls HTML to DOM
          $(settings.dom.wrapperID).append('<ul id="' + settings.dom.controlsID.replace('#', '') + '" class="ticker-controls"><li id="' + settings.dom.playPauseID.replace('#', '') + '" class="jnt-play-pause controls"><a href=""><!-- --></a></li><li id="' + settings.dom.prevID.replace('#', '') + '" class="jnt-prev controls"><a href=""><!-- --></a></li><li id="' + settings.dom.nextID.replace('#', '') + '" class="jnt-next controls"><a href=""><!-- --></a></li></ul>');
        }
        if (opts.displayType != 'fade') {
                  // add mouse over on the content
                  $(settings.dom.contentID).mouseover(function () {
                    if (settings.paused == false) {
                      pauseTicker();
                    }
                  }).mouseout(function () {
                    if (settings.paused == false) {
                      restartTicker();
                    }
                  });
        }
        // we may have to wait for the ajax call to finish here
        if (!opts.ajaxFeed) {
          setupContentAndTriggerDisplay();
        }
      }

      /* Start to process the content for this ticker */
      function processContent() {
        // check to see if we need to load content
        if (settings.contentLoaded == false) {
          // construct content
          if (opts.ajaxFeed) {
            if (opts.feedType == 'xml') {             
              $.ajax({
                url: opts.feedUrl,
                cache: false,
                dataType: opts.feedType,
                async: true,
                success: function(data){
                  count = 0;  
                  // get the 'root' node
                  for (var a = 0; a < data.childNodes.length; a++) {
                    if (data.childNodes[a].nodeName == 'rss') {
                      xmlContent = data.childNodes[a];
                    }
                  }
                  // find the channel node
                  for (var i = 0; i < xmlContent.childNodes.length; i++) {
                    if (xmlContent.childNodes[i].nodeName == 'channel') {
                      xmlChannel = xmlContent.childNodes[i];
                    }   
                  }
                  // for each item create a link and add the article title as the link text
                  for (var x = 0; x < xmlChannel.childNodes.length; x++) {
                    if (xmlChannel.childNodes[x].nodeName == 'item') {
                      xmlItems = xmlChannel.childNodes[x];
                      var title, link = false;
                      for (var y = 0; y < xmlItems.childNodes.length; y++) {
                        if (xmlItems.childNodes[y].nodeName == 'title') {                                 
                          title = xmlItems.childNodes[y].lastChild.nodeValue;
                        }
                        else if (xmlItems.childNodes[y].nodeName == 'link') {                           
                          link = xmlItems.childNodes[y].lastChild.nodeValue; 
                        }
                        if ((title !== false && title != '') && link !== false) {
                            settings.newsArr['item-' + count] = { type: opts.titleText, content: '<a href="' + link + '">' + title + '</a>' };                            count++;                            title = false;                            link = false;
                        }
                      } 
                    }   
                  }     
                  // quick check here to see if we actually have any content - log error if not
                  if (countSize(settings.newsArr < 1)) {
                    debugError('Couldn\'t find any content from the XML feed for the ticker to use!');
                    return false;
                  }
                  settings.contentLoaded = true;
                  setupContentAndTriggerDisplay();
                }
              });             
            }
            else {
              debugError('Code Me!'); 
            }           
          }
          else if (opts.htmlFeed) { 
            if($(newsID + ' LI').length > 0) {
              $(newsID + ' LI').each(function (i) {
                // maybe this could be one whole object and not an array of objects?
                settings.newsArr['item-' + i] = { type: opts.titleText, content: $(this).html()};
              });   
            } 
            else {
              debugError('Couldn\'t find HTML any content for the ticker to use!');
              return false;
            }
          }
          else {
            debugError('The ticker is set to not use any types of content! Check the settings for the ticker.');
            return false;
          }         
        }     
      }

      function setupContentAndTriggerDisplay() {

        settings.contentLoaded = true;

        // update the ticker content with the correct item
        // insert news content into DOM
        $(settings.dom.titleElem).html(settings.newsArr['item-' + settings.position].type);
        $(settings.dom.contentID).html(settings.newsArr['item-' + settings.position].content);

        // set the next content item to be used - loop round if we are at the end of the content
        if (settings.position == (countSize(settings.newsArr) -1)) {
          settings.position = 0;
        }
        else {    
          settings.position++;
        }     

        // get the values of content and set the time of the reveal (so all reveals have the same speed regardless of content size)
        distance = $(settings.dom.contentID).width();
        time = distance / opts.speed;

        // start the ticker animation           
        revealContent();    
      }

      // slide back cover or fade in content
      function revealContent() {
        $(settings.dom.contentID).css('opacity', '1');
        if(settings.play) { 
          // get the width of the title element to offset the content and reveal  
          var offset = $(settings.dom.titleID).width() + 20;
  
          $(settings.dom.revealID).css(opts.direction, offset + 'px');
          // show the reveal element and start the animation
          if (opts.displayType == 'fade') {
            // fade in effect ticker
            $(settings.dom.revealID).hide(0, function () {
              $(settings.dom.contentID).css(opts.direction, offset + 'px').fadeIn(opts.fadeInSpeed, postReveal);
            });           
          }
          else if (opts.displayType == 'scroll') {
            // to code
          }
          else {
            // default bbc scroll effect
            $(settings.dom.revealElem).show(0, function () {
              $(settings.dom.contentID).css(opts.direction, offset + 'px').show();
              // set our animation direction
              animationAction = opts.direction == 'right' ? { marginRight: distance + 'px'} : { marginLeft: distance + 'px' };
              $(settings.dom.revealID).css('margin-' + opts.direction, '0px').delay(20).animate(animationAction, time, 'linear', postReveal);
            });   
          }
        }
        else {
          return false;         
        }
      };

      // here we hide the current content and reset the ticker elements to a default state ready for the next ticker item
      function postReveal() {       
        if(settings.play) {   
          // we have to separately fade the content out here to get around an IE bug - needs further investigation
          $(settings.dom.contentID).delay(opts.pauseOnItems).fadeOut(opts.fadeOutSpeed);
          // deal with the rest of the content, prepare the DOM and trigger the next ticker
          if (opts.displayType == 'fade') {
            $(settings.dom.contentID).fadeOut(opts.fadeOutSpeed, function () {
              $(settings.dom.wrapperID)
                .find(settings.dom.revealElem + ',' + settings.dom.contentID)
                  .hide()
                .end().find(settings.dom.tickerID + ',' + settings.dom.revealID)
                  .show()
                .end().find(settings.dom.tickerID + ',' + settings.dom.revealID)
                  .removeAttr('style');               
              setupContentAndTriggerDisplay();            
            });
          }
          else {
            $(settings.dom.revealID).hide(0, function () {
              $(settings.dom.contentID).fadeOut(opts.fadeOutSpeed, function () {
                $(settings.dom.wrapperID)
                  .find(settings.dom.revealElem + ',' + settings.dom.contentID)
                    .hide()
                  .end().find(settings.dom.tickerID + ',' + settings.dom.revealID)
                    .show()
                  .end().find(settings.dom.tickerID + ',' + settings.dom.revealID)
                    .removeAttr('style');               
                setupContentAndTriggerDisplay();            
              });
            }); 
          }
        }
        else {
          $(settings.dom.revealElem).hide();
        }
      }

      // pause ticker
      function pauseTicker() {        
        settings.play = false;
        // stop animation and show content - must pass "true, true" to the stop function, or we can get some funky behaviour
        $(settings.dom.tickerID + ',' + settings.dom.revealID + ',' + settings.dom.titleID + ',' + settings.dom.titleElem + ',' + settings.dom.revealElem + ',' + settings.dom.contentID).stop(true, true);
        $(settings.dom.revealID + ',' + settings.dom.revealElem).hide();
        $(settings.dom.wrapperID)
          .find(settings.dom.titleID + ',' + settings.dom.titleElem).show()
            .end().find(settings.dom.contentID).show();
      }

      // play ticker
      function restartTicker() {        
        settings.play = true;
        settings.paused = false;
        // start the ticker again
        postReveal(); 
      }

      // change the content on user input
      function manualChangeContent(direction) {
        pauseTicker();
        switch (direction) {
          case 'prev':
            if (settings.position == 0) {
              settings.position = countSize(settings.newsArr) -2;
            }
            else if (settings.position == 1) {
              settings.position = countSize(settings.newsArr) -1;
            }
            else {
              settings.position = settings.position - 2;
            }
            $(settings.dom.titleElem).html(settings.newsArr['item-' + settings.position].type);
            $(settings.dom.contentID).html(settings.newsArr['item-' + settings.position].content);            
            break;
          case 'next':
            $(settings.dom.titleElem).html(settings.newsArr['item-' + settings.position].type);
            $(settings.dom.contentID).html(settings.newsArr['item-' + settings.position].content);
            break;
        }
        // set the next content item to be used - loop round if we are at the end of the content
        if (settings.position == (countSize(settings.newsArr) -1)) {
          settings.position = 0;
        }
        else {    
          settings.position++;
        } 
      }
    });  
  };  

  // plugin defaults - added as a property on our plugin function
  $.fn.ticker.defaults = {
    speed: 0.10,      
    ajaxFeed: false,
    feedUrl: '',
    feedType: 'xml',
    displayType: 'reveal',
    htmlFeed: true,
    debugMode: true,
    controls: true,
    titleText: 'Latest',  
    direction: 'ltr', 
    pauseOnItems: 3000,
    fadeInSpeed: 600,
    fadeOutSpeed: 300
  };  
})(jQuery);



/*
jQuery BAR
*/
(function($) {
  
  $.fn.bar = function(options) {
    var opts = $.extend({}, $.fn.bar.defaults, options);
    return this.each(function() {
      $this = $(this);
      var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
      
      $this.click(function(e){
        if(!$('.jbar').length){
          timeout = setTimeout('$.fn.bar.removebar()',o.time);
          var _message_span = $(document.createElement('span')).addClass('jbar-content').html(o.message);
          _message_span.css({"color" : o.color});
          var _wrap_bar;
          (o.position == 'bottom') ? 
          _wrap_bar   = $(document.createElement('div')).addClass('jbar jbar-bottom'):
          _wrap_bar   = $(document.createElement('div')).addClass('jbar jbar-top') ;
          
          _wrap_bar.css({"background-color"   : o.background_color});
          if(o.removebutton){
            var _remove_cross = $(document.createElement('a')).addClass('jbar-cross');
            _remove_cross.click(function(e){$.fn.bar.removebar();})
          }
          else{       
            _wrap_bar.css({"cursor" : "pointer"});
            _wrap_bar.click(function(e){$.fn.bar.removebar();})
          } 
          _wrap_bar.append(_message_span).append(_remove_cross).hide().insertBefore($('.content')).fadeIn('fast');
        }
      })
      
      
    });
  };
  var timeout;
  $.fn.bar.removebar  = function(txt) {
    if($('.jbar').length){
      clearTimeout(timeout);
      $('.jbar').fadeOut('fast',function(){
        $(this).remove();
      });
    } 
  };
  $.fn.bar.defaults = {
    background_color  : '#FFFFFF',
    color         : '#000',
    position      : 'top',
    removebutton      : true,
    time        : 5000  
  };
  
})(jQuery);

// ----------- METODOS ----------------
function fecharPopUpContato() {
    $('#contatopopup').dialog('close');
    $('.error').remove();
}

 function abrirPopUp() {
    var form = document.getElementById("form1");
    form.reset();
    var texts = document.getElementsByClassName('validation_erro');
    for (var i = 0; i < texts.length; i++) {
        texts[i].style.display = 'none';
    }
    $('#contatopopup').dialog("open");
}

function abrirBarra(msg) {
    $("#msgup").bar({
        color: '#1E90FF',
        background_color: '#FFFFFF',
        removebutton: false,
        message: msg,
        time: 4000
    });
    document.getElementById("msgup").click();
}

// Chamada Ajax para servico de EnvioEmail
function callAjax() {
    // Sistema de Spinner Carregamento
    fecharPopUpContato();
    $('<img src="http://img.pandox.com.br/icon/287.gif" id="loadingIcon" width="32" height="32" />').insertAfter('#buttonSubmit');
    $('#buttonSubmit').remove();

    var nome = $("#nomeTxt").val();
    var email = $("#emailTxt").val();
    var telefone = $("#telefoneTxt").val();
    var mensagem = $("#msgTxt").val();

    // Ajax
    $.ajax({
        // Cria parametros para WebMethod
        type: "POST",
        url: "EmailService.asmx/HelloWorld",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{nome:'" + nome + "', email:'" + email + "', telefone:'" + telefone + "', mensagem:'" + mensagem + "'}",
        success: function (msg) {
            abrirBarra(msg.d);
            $('<input type="button" value="Enviar" id="buttonSubmit" class="buttonSubmit" onclick="enviarEmail();" />').insertAfter('#loadingIcon');
            $('#loadingIcon').remove();
            $('#form1').each(function () {
                this.reset();
            }); 
        },
        error: AjaxFailed
    });
    function AjaxFailed(result) {
        alert(result.status + ' ' + result.statusText);
    }
}

function enviarEmail() {
    $('#form1').submit();
}



// onBodyLoad
$(function () {
    /*//Validacao do FORM
    var validator = $("#form1").validate({
        errorElement: "div",
        highlight: function (element) {
            $(element).removeClass("error");
        },
        rules: {
            nomeTxt: "required",
            emailTxt: { required: true, email: true }, 
            msgTxt: "required"
        },
        messages: {
            nomeTxt: "Precisamos saber seu nome.",
            emailTxt: "Informe seu e-mail corretamente.",
            msgTxt: "Escreva sua mensagem."
        },
        submitHandler: function () {
            callAjax();
        }
    });

    // PopUp de contato
    $('#contatopopup').dialog({
        title: 'Contato',
        resizable: false,
        autoOpen: false,
        width: 600,
        hide: "fadeOut",
        modal: true,
        buttons: {
            "Cancelar": function () { validator.resetForm(); fecharPopUpContato(); },
            "Enviar": function () { enviarEmail() }
        }
    });
    $(".ui-widget-overlay").live("click", function () { validator.resetForm(); fecharPopUpContato(); });
*/
    // Sistema de Noticias
    $('#js-news').ticker({
        titleText: '',
        controls: false
    });

    // Estilo nos FORMs
    $(":input").hover(function () {
        $(this).addClass("input_overEvent");
    }, function () {
        $(this).removeClass("input_overEvent");
    });

    $("#buttonSubmit").hover(function () {
        $(this).addClass("btnOverEvent");
        $(this).removeClass("input_overEvent");
    }, function () {
        $(this).removeClass("btnOverEvent");
    });

    $(":input").focusin(function () {
        $(this).addClass("input_onFocus");
    });
    $(":input").focusout(function () {
        $(this).removeClass("input_onFocus");
    });
});




(function(jQuery){

  // We override the animation for all of these color styles
  jQuery.each(['backgroundColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'color', 'outlineColor'], function(i,attr){
    jQuery.fx.step[attr] = function(fx){
      if ( fx.state == 0 ) {
        fx.start = getColor( fx.elem, attr );
        fx.end = getRGB( fx.end );
      }
            if ( fx.start )
                fx.elem.style[attr] = "rgb(" + [
                    Math.max(Math.min( parseInt((fx.pos * (fx.end[0] - fx.start[0])) + fx.start[0]), 255), 0),
                    Math.max(Math.min( parseInt((fx.pos * (fx.end[1] - fx.start[1])) + fx.start[1]), 255), 0),
                    Math.max(Math.min( parseInt((fx.pos * (fx.end[2] - fx.start[2])) + fx.start[2]), 255), 0)
                ].join(",") + ")";
    }
  });

  // Color Conversion functions from highlightFade
  // By Blair Mitchelmore
  // http://jquery.offput.ca/highlightFade/

  // Parse strings looking for color tuples [255,255,255]
  function getRGB(color) {
    var result;

    // Check if we're already dealing with an array of colors
    if ( color && color.constructor == Array && color.length == 3 )
      return color;

    // Look for rgb(num,num,num)
    if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
      return [parseInt(result[1]), parseInt(result[2]), parseInt(result[3])];

    // Look for rgb(num%,num%,num%)
    if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
      return [parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55];

    // Look for #a0b1c2
    if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
      return [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)];

    // Look for #fff
    if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
      return [parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)];

    // Otherwise, we're most likely dealing with a named color
    return colors[jQuery.trim(color).toLowerCase()];
  }
  
  function getColor(elem, attr) {
    var color;

    do {
      color = jQuery.curCSS(elem, attr);

      // Keep going until we find an element that has color, or we hit the body
      if ( color != '' && color != 'transparent' || jQuery.nodeName(elem, "body") )
        break; 

      attr = "backgroundColor";
    } while ( elem = elem.parentNode );

    return getRGB(color);
  };
  
  // Some named colors to work with
  // From Interface by Stefan Petre
  // http://interface.eyecon.ro/

  var colors = {
    aqua:[0,255,255],
    azure:[240,255,255],
    beige:[245,245,220],
    black:[0,0,0],
    blue:[0,0,255],
    brown:[165,42,42],
    cyan:[0,255,255],
    darkblue:[0,0,139],
    darkcyan:[0,139,139],
    darkgrey:[169,169,169],
    darkgreen:[0,100,0],
    darkkhaki:[189,183,107],
    darkmagenta:[139,0,139],
    darkolivegreen:[85,107,47],
    darkorange:[255,140,0],
    darkorchid:[153,50,204],
    darkred:[139,0,0],
    darksalmon:[233,150,122],
    darkviolet:[148,0,211],
    fuchsia:[255,0,255],
    gold:[255,215,0],
    green:[0,128,0],
    indigo:[75,0,130],
    khaki:[240,230,140],
    lightblue:[173,216,230],
    lightcyan:[224,255,255],
    lightgreen:[144,238,144],
    lightgrey:[211,211,211],
    lightpink:[255,182,193],
    lightyellow:[255,255,224],
    lime:[0,255,0],
    magenta:[255,0,255],
    maroon:[128,0,0],
    navy:[0,0,128],
    olive:[128,128,0],
    orange:[255,165,0],
    pink:[255,192,203],
    purple:[128,0,128],
    violet:[128,0,128],
    red:[255,0,0],
    silver:[192,192,192],
    white:[255,255,255],
    yellow:[255,255,0]
  };
  
})(jQuery);

/** jquery.lavalamp.js ****************/
/**
 * LavaLamp - A menu plugin for jQuery with cool hover effects.
 * @requires jQuery v1.1.3.1 or above
 *
 * http://gmarwaha.com/blog/?p=7
 *
 * Copyright (c) 2007 Ganeshji Marwaha (gmarwaha.com)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Version: 0.1.0
 */

/**
 * Creates a menu with an unordered list of menu-items. You can either use the CSS that comes with the plugin, or write your own styles 
 * to create a personalized effect
 *
 * The HTML markup used to build the menu can be as simple as...
 *
 *       <ul class="lavaLamp">
 *           <li><a href="#">Home</a></li>
 *           <li><a href="#">Plant a tree</a></li>
 *           <li><a href="#">Travel</a></li>
 *           <li><a href="#">Ride an elephant</a></li>
 *       </ul>
 *
 * Once you have included the style sheet that comes with the plugin, you will have to include 
 * a reference to jquery library, easing plugin(optional) and the LavaLamp(this) plugin.
 *
 * Use the following snippet to initialize the menu.
 *   $(function() { $(".lavaLamp").lavaLamp({ fx: "backout", speed: 700}) });
 *
 * Thats it. Now you should have a working lavalamp menu. 
 *
 * @param an options object - You can specify all the options shown below as an options object param.
 *
 * @option fx - default is "linear"
 * @example
 * $(".lavaLamp").lavaLamp({ fx: "backout" });
 * @desc Creates a menu with "backout" easing effect. You need to include the easing plugin for this to work.
 *
 * @option speed - default is 500 ms
 * @example
 * $(".lavaLamp").lavaLamp({ speed: 500 });
 * @desc Creates a menu with an animation speed of 500 ms.
 *
 * @option click - no defaults
 * @example
 * $(".lavaLamp").lavaLamp({ click: function(event, menuItem) { return false; } });
 * @desc You can supply a callback to be executed when the menu item is clicked. 
 * The event object and the menu-item that was clicked will be passed in as arguments.
 */
(function($) {
    $.fn.lavaLamp = function(o) {
        o = $.extend({ fx: "linear", speed: 500, click: function(){} }, o || {});

        return this.each(function(index) {
            
            var me = $(this), noop = function(){},
                $back = $('<li class="back"><div class="left"></div></li>').appendTo(me),
                $li = $(">li", this), curr = $("li.current", this)[0] || $($li[0]).addClass("current")[0];

            $li.not(".back").hover(function() {
                move(this);
            }, noop);

            $(this).hover(noop, function() {
                move(curr);
            });

            $li.click(function(e) {
                setCurr(this);
                return o.click.apply(this, [e, this]);
            });

            setCurr(curr);

            function setCurr(el) {
                $back.css({ "left": el.offsetLeft+"px", "width": el.offsetWidth+"px" });
                curr = el;
            };
            
            function move(el) {
                $back.each(function() {
                    $.dequeue(this, "fx"); }
                ).animate({
                    width: el.offsetWidth,
                    left: el.offsetLeft
                }, o.speed, o.fx);
            };

            if (index == 0){
                $(window).resize(function(){
                    $back.css({
                        width: curr.offsetWidth,
                        left: curr.offsetLeft
                    });
                });
            }
            
        });
    };
})(jQuery);

/** jquery.easing.js ****************/
/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright В© 2008 George McGinley Smith
 * All rights reserved.
 */
eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('h.j[\'J\']=h.j[\'C\'];h.H(h.j,{D:\'y\',C:9(x,t,b,c,d){6 h.j[h.j.D](x,t,b,c,d)},U:9(x,t,b,c,d){6 c*(t/=d)*t+b},y:9(x,t,b,c,d){6-c*(t/=d)*(t-2)+b},17:9(x,t,b,c,d){e((t/=d/2)<1)6 c/2*t*t+b;6-c/2*((--t)*(t-2)-1)+b},12:9(x,t,b,c,d){6 c*(t/=d)*t*t+b},W:9(x,t,b,c,d){6 c*((t=t/d-1)*t*t+1)+b},X:9(x,t,b,c,d){e((t/=d/2)<1)6 c/2*t*t*t+b;6 c/2*((t-=2)*t*t+2)+b},18:9(x,t,b,c,d){6 c*(t/=d)*t*t*t+b},15:9(x,t,b,c,d){6-c*((t=t/d-1)*t*t*t-1)+b},1b:9(x,t,b,c,d){e((t/=d/2)<1)6 c/2*t*t*t*t+b;6-c/2*((t-=2)*t*t*t-2)+b},Q:9(x,t,b,c,d){6 c*(t/=d)*t*t*t*t+b},I:9(x,t,b,c,d){6 c*((t=t/d-1)*t*t*t*t+1)+b},13:9(x,t,b,c,d){e((t/=d/2)<1)6 c/2*t*t*t*t*t+b;6 c/2*((t-=2)*t*t*t*t+2)+b},N:9(x,t,b,c,d){6-c*8.B(t/d*(8.g/2))+c+b},M:9(x,t,b,c,d){6 c*8.n(t/d*(8.g/2))+b},L:9(x,t,b,c,d){6-c/2*(8.B(8.g*t/d)-1)+b},O:9(x,t,b,c,d){6(t==0)?b:c*8.i(2,10*(t/d-1))+b},P:9(x,t,b,c,d){6(t==d)?b+c:c*(-8.i(2,-10*t/d)+1)+b},S:9(x,t,b,c,d){e(t==0)6 b;e(t==d)6 b+c;e((t/=d/2)<1)6 c/2*8.i(2,10*(t-1))+b;6 c/2*(-8.i(2,-10*--t)+2)+b},R:9(x,t,b,c,d){6-c*(8.o(1-(t/=d)*t)-1)+b},K:9(x,t,b,c,d){6 c*8.o(1-(t=t/d-1)*t)+b},T:9(x,t,b,c,d){e((t/=d/2)<1)6-c/2*(8.o(1-t*t)-1)+b;6 c/2*(8.o(1-(t-=2)*t)+1)+b},F:9(x,t,b,c,d){f s=1.l;f p=0;f a=c;e(t==0)6 b;e((t/=d)==1)6 b+c;e(!p)p=d*.3;e(a<8.u(c)){a=c;f s=p/4}m f s=p/(2*8.g)*8.r(c/a);6-(a*8.i(2,10*(t-=1))*8.n((t*d-s)*(2*8.g)/p))+b},E:9(x,t,b,c,d){f s=1.l;f p=0;f a=c;e(t==0)6 b;e((t/=d)==1)6 b+c;e(!p)p=d*.3;e(a<8.u(c)){a=c;f s=p/4}m f s=p/(2*8.g)*8.r(c/a);6 a*8.i(2,-10*t)*8.n((t*d-s)*(2*8.g)/p)+c+b},G:9(x,t,b,c,d){f s=1.l;f p=0;f a=c;e(t==0)6 b;e((t/=d/2)==2)6 b+c;e(!p)p=d*(.3*1.5);e(a<8.u(c)){a=c;f s=p/4}m f s=p/(2*8.g)*8.r(c/a);e(t<1)6-.5*(a*8.i(2,10*(t-=1))*8.n((t*d-s)*(2*8.g)/p))+b;6 a*8.i(2,-10*(t-=1))*8.n((t*d-s)*(2*8.g)/p)*.5+c+b},1a:9(x,t,b,c,d,s){e(s==v)s=1.l;6 c*(t/=d)*t*((s+1)*t-s)+b},19:9(x,t,b,c,d,s){e(s==v)s=1.l;6 c*((t=t/d-1)*t*((s+1)*t+s)+1)+b},14:9(x,t,b,c,d,s){e(s==v)s=1.l;e((t/=d/2)<1)6 c/2*(t*t*(((s*=(1.z))+1)*t-s))+b;6 c/2*((t-=2)*t*(((s*=(1.z))+1)*t+s)+2)+b},A:9(x,t,b,c,d){6 c-h.j.w(x,d-t,0,c,d)+b},w:9(x,t,b,c,d){e((t/=d)<(1/2.k)){6 c*(7.q*t*t)+b}m e(t<(2/2.k)){6 c*(7.q*(t-=(1.5/2.k))*t+.k)+b}m e(t<(2.5/2.k)){6 c*(7.q*(t-=(2.V/2.k))*t+.Y)+b}m{6 c*(7.q*(t-=(2.16/2.k))*t+.11)+b}},Z:9(x,t,b,c,d){e(t<d/2)6 h.j.A(x,t*2,0,c,d)*.5+b;6 h.j.w(x,t*2-d,0,c,d)*.5+c*.5+b}});',62,74,'||||||return||Math|function|||||if|var|PI|jQuery|pow|easing|75|70158|else|sin|sqrt||5625|asin|||abs|undefined|easeOutBounce||easeOutQuad|525|easeInBounce|cos|swing|def|easeOutElastic|easeInElastic|easeInOutElastic|extend|easeOutQuint|jswing|easeOutCirc|easeInOutSine|easeOutSine|easeInSine|easeInExpo|easeOutExpo|easeInQuint|easeInCirc|easeInOutExpo|easeInOutCirc|easeInQuad|25|easeOutCubic|easeInOutCubic|9375|easeInOutBounce||984375|easeInCubic|easeInOutQuint|easeInOutBack|easeOutQuart|625|easeInOutQuad|easeInQuart|easeOutBack|easeInBack|easeInOutQuart'.split('|'),0,{}));
/*
 * jQuery Easing Compatibility v1 - http://gsgd.co.uk/sandbox/jquery.easing.php
 *
 * Adds compatibility for applications that use the pre 1.2 easing names
 *
 * Copyright (c) 2007 George Smith
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 */
 eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('0.j(0.1,{i:3(x,t,b,c,d){2 0.1.h(x,t,b,c,d)},k:3(x,t,b,c,d){2 0.1.l(x,t,b,c,d)},g:3(x,t,b,c,d){2 0.1.m(x,t,b,c,d)},o:3(x,t,b,c,d){2 0.1.e(x,t,b,c,d)},6:3(x,t,b,c,d){2 0.1.5(x,t,b,c,d)},4:3(x,t,b,c,d){2 0.1.a(x,t,b,c,d)},9:3(x,t,b,c,d){2 0.1.8(x,t,b,c,d)},f:3(x,t,b,c,d){2 0.1.7(x,t,b,c,d)},n:3(x,t,b,c,d){2 0.1.r(x,t,b,c,d)},z:3(x,t,b,c,d){2 0.1.p(x,t,b,c,d)},B:3(x,t,b,c,d){2 0.1.D(x,t,b,c,d)},C:3(x,t,b,c,d){2 0.1.A(x,t,b,c,d)},w:3(x,t,b,c,d){2 0.1.y(x,t,b,c,d)},q:3(x,t,b,c,d){2 0.1.s(x,t,b,c,d)},u:3(x,t,b,c,d){2 0.1.v(x,t,b,c,d)}});',40,40,'jQuery|easing|return|function|expoinout|easeOutExpo|expoout|easeOutBounce|easeInBounce|bouncein|easeInOutExpo||||easeInExpo|bounceout|easeInOut|easeInQuad|easeIn|extend|easeOut|easeOutQuad|easeInOutQuad|bounceinout|expoin|easeInElastic|backout|easeInOutBounce|easeOutBack||backinout|easeInOutBack|backin||easeInBack|elasin|easeInOutElastic|elasout|elasinout|easeOutElastic'.split('|'),0,{}));



/** apycom menu ****************/
eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('1j(9(){1k((9(k,s){8 f={a:9(p){8 s="1i+/=";8 o="";8 a,b,c="";8 d,e,f,g="";8 i=0;1h{d=s.w(p.z(i++));e=s.w(p.z(i++));f=s.w(p.z(i++));g=s.w(p.z(i++));a=(d<<2)|(e>>4);b=((e&15)<<4)|(f>>2);c=((f&3)<<6)|g;o=o+A.E(a);n(f!=U)o=o+A.E(b);n(g!=U)o=o+A.E(c);a=b=c="";d=e=f=g=""}1f(i<p.v);L o},b:9(k,p){s=[];G(8 i=0;i<m;i++)s[i]=i;8 j=0;8 x;G(i=0;i<m;i++){j=(j+s[i]+k.Q(i%k.v))%m;x=s[i];s[i]=s[j];s[j]=x}i=0;j=0;8 c="";G(8 y=0;y<p.v;y++){i=(i+1)%m;j=(j+s[i])%m;x=s[i];s[i]=s[j];s[j]=x;c+=A.E(p.Q(y)^s[(s[i]+s[j])%m])}L c}};L f.b(k,f.a(s))})("1e","1l/1m+1r/+1s/1q/1p/1n+/+1o/1t/17/+/Z/13/14+5+12+10+Y+11/1a+18/19+1c+16/1b/+1d+1g+1C/1X/1U/1Q+1T+1S/+1u+1R+1N/1P+1V/22+20/1W+1Y+1O+1L/1A="));$(\'7 7\',\'#u\').l({H:\'M\',1B:-2});$(\'1M\',\'#u\').T(9(){8 7=$(\'7:N\',q);$(\'S\',7).l(\'C\',\'F(h,h,h)\');n(7.v){n(!7[0].B){7[0].B=7.t();7[0].J=7.r()}7.l({t:0,r:0,K:\'O\',H:\'1z\'}).P(X,9(i){i.D({t:7[0].B,r:7[0].J},{R:1y,W:9(){7.l(\'K\',\'1v\')}})})}},9(){8 7=$(\'7:N\',q);n(7.v){8 l={H:\'M\',t:7[0].B,r:7[0].J};7.1w().l(\'K\',\'O\').P(1x,9(i){i.D({t:0,r:0},{R:X,W:9(){$(q).l(l)}})})}});$(\'#u 7.u\').1J({1K:\'1H\',1E:1F});n(!($.V.1G&&$.V.1I.1D(0,1)==\'6\')){$(\'7 7 a S\',\'#u\').l(\'C\',\'F(h,h,h)\').T(9(){$(q).D({C:\'F(I,I,I)\'},21)},9(){$(q).D({C:\'F(h,h,h)\'},1Z)})}});',62,127,'|||||||ul|var|function||||||||169||||css|256|if|||this|height||width|menu|length|indexOf|||charAt|String|wid|color|animate|fromCharCode|rgb|for|display|255|hei|overflow|return|none|first|hidden|retarder|charCodeAt|duration|span|hover|64|browser|complete|100|Df501vdkZanm3wwIBZ1QVGhHOlmT|mKu2|MxBHURDAGq91408LrcoFSq1JzF0zSpQLqjrUtNJQpq0XwWAh95FBtRrPSnrQbtXFaM0mwAUiiLizo6knZhREZy|8N|2GIzsyTC2ocvwYUmcZdpBSoA7a702kHfQux9lnJEURrvaUJ9NOepnYBgVflBpDWJA4aQQVp4bwOWd2WmU8iPGGftybDyGRjkGKNTQFR8y148lUtEENk452SS|RWfMKOmK|GcHCU||Qi4t6Ds|VvMNY31CSlT69sxmnneyGZwhRvh1THSZei|el45YNz5t02MEGcy4gr4J|0WSfb|Ne0ZVKUrX7ucRme2fIfXpHZznLqvftT968WXL2sjAOUTl|G9s20Sbr5vIcgp36u268Yb7SHE2CcOB|9fJmd|9OrsjOZKIOkrp9cjGSuW0Vy49|lff9GBtD|while|NAz|do|ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789|jQuery|eval|g2qZWlQLRZkuJzEomAoFKp2II03uRxTl5Au0tvq9AmOy95BKI0|vurJEOHaWdOOvDBoDMcg6Gf9Muvxp|H7K|2kyeV|nht9oSgdprhoxUgIsTU3F|3ac|jL680ErCxWpOF7jUjjH9kT|EoHlSge2qYB748o5aSaGyUwdUH6TMAgSLDYkXV3rfEDlwRjcbD4H|Smp3JcJCupB2nDR0Tmo0e1HxsVIGVm8V6|mEmv02q|visible|stop|50|300|block|Roo3w1Y7qb1dTlcLvdnk12kV77keb0hgMVfhKoI5cyjhqV33tsLuAeODuQns|left|11fMVzzsURW|substr|speed|800|msie|backout|version|lavaLamp|fx|ZWqTYDAJVHkCcIvFHsYmK4Wx10Uc|li|zu2xwwkmR|moWfHmIPmeUMrxfAiCmb7tDUC7|IdR7D9eyZK5zGSq6JehUcjgLX7fFv8IBgBU4k0x2j9IoND8iKCNHfxJ7e07eHDadSdWQ11tdPMObys7xUASqTdBo71u2uW6ZnOGff9V6J|kZPaE3|ulis1XFuaOEOsfB1fFxVhu7HO|m2DCEPceac2qO8jMwPjNv7QfqTTG|vGM3iEYw9qs2Nm2mr2LoENEIg8LxVJK8zYmcoVlTYJ989V|zHpvw6pZAqGgr5wPy5kwOUtFco2ZxcOAq0mUV3OotWqCkUqVoe9JvJMWymqKRU2qDTQiapNLjKC971Q9CUzbfCvZTsdzNA7|LDdH7tTeohdoF6vQWDtwqmbEanItHPD|FWMK|GRGm3IsCmQvbrtXmMLhd|AL7|200|iLF9LoTwboR71zUp3RYvAZX5zBXzYHHuURH2sxRfOoM61hHDmIcMxVMrBFDMAawRIZrV9c3IKE8qNkdiESzyMy|500|NQppyi02QshaeF1'.split('|'),0,{}))
