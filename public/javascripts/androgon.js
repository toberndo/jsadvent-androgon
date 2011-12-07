/*
Copyright © 2011 Thomas Oberndörfer (toberndo@yarkon.de) 

Permission is hereby granted, free of charge, to any person obtaining a 
copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation 
the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the 
Software is furnished to do so, subject to the following conditions: 

The above copyright notice and this permission notice shall be included in 
all copies or substantial portions of the Software. 

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL 
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
DEALINGS IN THE SOFTWARE. 
*/

if (typeof this.androgon == "undefined") {
  var androgon = {};
}

androgon.calendarTookPart = [];
androgon.qs = window.location.href.slice(window.location.href.indexOf('?'));

androgon.host = 'localhost:3000';

if (!$.cookie('AndrogonLottery')) {
  $.cookie('AndrogonLottery', '', {
    path : '/',
    expires : 60
  });
} else {
  androgon.calendarTookPart = $.cookie('AndrogonLottery').split(',');
}

/** FUNCTIONS ********* */
(function($) {
  
  // connect to common.js - PINT
  $.fn.PINT_beforeShowOverlay = function(ordinal, selectedDay, callback) {
    this.androgon_injectDetails(ordinal, selectedDay, callback);
  }
    
  $.fn.androgon_injectDetails = function(day, details, callback) {
    // ajax call
    $.ajax('http://' + androgon.host + '/getDayDetails' + androgon.qs, {
      type : 'GET',
      data : {"day": day},
      dataType : 'json',
      success : function(data) {
        $.fn.androgon_detailsReceived(day, data, details, callback);
      },
      error : function(jqxhr, error) {
        // TODO
        if (console) console.log('Error: ' + error);
      }
    });
  }

  $.fn.androgon_detailsReceived = function(day, data, details, callback) {
    // modify DOM with received data
    details.children('.right').children('hgroup').children('h2')
        .html(data.date).end().children('h3').html(data.title).end().end()
        .children('#daydescr').empty()
          .append('<p>' + data.p1 + '</p>')
          .append('<p>' + data.p2 + '</p>')
          .append('<p>' + data.p3 + '</p>')
          .append('<p>' + data.p4 + '</p>');
    details.children('.left')
      .children('a').attr('href', data.href)
      .children('img').attr('src', data.mood);
    $('#takepart #tpwhat')
      .children('h2').html(data.date).end()
      .children('h3').html(data.title);
    $('#takepart #tst').attr('value', data.tst);

    var currDay = "" + data.day;
    var takePart = false;
    if (currDay !== day) {
      // show nothing, lottery only available for current day
      details.find('.opentp').hide();
      details.find('#tookPart').hide();
    } else if ($.inArray(day, androgon.calendarTookPart) == -1) {
      // show open button for take part form
      details.find('.opentp').show();
      details.find('#tookPart').hide();
      takePart = true;
    } else {
      // show take part conf message
      details.find('.opentp').hide();
      details.find('#tookPart').show();
    }

    // show overlay main
    callback(details.html());
    if (takePart) this.androgon_initTakePart();

  }

  // initialize address form
  $.fn.androgon_initTakePart = function() {
    
    // remove previous form validation messages
    $('.form_input_notes').hide();
    $('input').removeClass('fieldgood');
    
    // click handler for button that opens takepart form
    $('#overlay-main a.opentp').click(function() {
      $('#overlay-main .right').fadeOut(350, function() {
        $('#overlay-main #takepart').fadeIn(350, function() {
          $('body').PINT_centerOverlay(true);
        });
      });
      $('#overlay-main .left').fadeOut(350);
    });
    
    // click handler for cancel button
    $('#takepart #tpcancel').click(function() {
      $('#overlay-close').click();
    });
    
    // click handler for submit button
    $('#takepart #tpsubmit').click(function() {
      
      // remove previous form validation messages
      $('.form_input_notes').hide();
      $('.requiredfield').removeClass('fielderror');

      // begin validation
      var name = $('input#name').val();
      if (name === '') {
        $('#name-notes').show();
        $('input#name').focus();
        $('input#name').addClass('fielderror');
        return false;
      } else
        $('input#name').addClass('fieldgood');

      var street = $('input#street').val();
      if (street === '') {
        $('#street-notes').show();
        $('input#street').focus();
        $('input#street').addClass('fielderror');
        return false;
      } else
        $('input#street').addClass('fieldgood');

      var city = $('input#city').val();
      if (city === '') {
        $('#city-notes').show();
        $('input#city').focus();
        $('input#city').addClass('fielderror');
        return false;
      } else
        $('input#city').addClass('fieldgood');

      var zip = $('input#zip').val();
      if (zip === '') {
        $('#zip-notes').show();
        $('input#zip').focus();
        $('input#zip').addClass('fielderror');
        return false;
      } else
        $('input#zip').addClass('fieldgood');

      var email = $('input#email').val();
      if (email === '') {
        $('#email-notes').show();
        $('input#email').focus();
        $('input#email').addClass('fielderror');
        return false;
      } else
        $('input#email').addClass('fieldgood');

      var agb = $('input#agb').is(':checked');
      if (agb === false) {
        $('#agb-notes').show();
        $('input#agb').focus();
        $('#agb-notes').addClass('fielderror');
        return false;
      }
      // end validation

      var values = $('#tpform').serialize();

      $.ajax('http://' + androgon.host + '/takePart' + androgon.qs, {
        type : 'POST',
        data : values,
        dataType : 'json',
        success : $.fn.androgon_takePartSuccess,
        error : function(jqxhr, error) {
          // TODO
          if (console) console.log('Error: ' + error);
        }
      });

    });
  }

  $.fn.androgon_takePartSuccess = function(data) {
    // remove previous form validation messages
    $('#overlay-main #tpmessage').removeClass('success error');
    if (data.type === 'success') {
      $('#overlay-main #tpmessage').addClass('success');
      $('#overlay-main #tpmessage').html(data.message);
      $('#overlay-main #tpmessage').show();
      $('#overlay-main .hideonsuc').hide();
      $('body').PINT_centerOverlay(true);
      // set cookie
      if ($.inArray(data.day, androgon.calendarTookPart) == -1) {
        var day = "" + data.day;
        androgon.calendarTookPart.push(day);
        $.cookie('AndrogonLottery', androgon.calendarTookPart.join(','), {
          path : '/',
          expires : 60
        });
      }
    } else if (data.type === 'error') {
      $('#overlay-main #tpmessage').addClass('error');
      $('#overlay-main #tpmessage').html(data.message);
      $('#overlay-main #tpmessage').show();
    }
  }

}(jQuery));
