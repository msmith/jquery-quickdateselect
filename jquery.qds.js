/* jQuery QuickDateSelect
 *
 * http://github.com/msmith/jquery-quickdateselect
 *
 * Copyright (C) 2009 Mike Smith
 * Distributed under the MIT License
 */
jQuery.fn.QuickDateSelect = function() {
  return this.each(function(){
    jQuery.QuickDateSelect.activate(this);
  });
};

/**
 * @constructor
 * @name jQuery.QuickDateSelect
 * @param date_field the <input> field
 */
jQuery.QuickDateSelect = {
  activate: function(date_field) {
    
    var WEEKDAYS = ['S','M','T','W','T','F','S'];
    var MONTHS   = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    var button  = createButton();
    var chooser = createChooser();
    var years   = $(chooser).find('.years');
    var months  = $(chooser).find('.months');
    var days    = $(chooser).find('.days');
    
    $(button).bind('click', function(e) {
      showChooser(e.pageX, e.pageY);
    });

    $(chooser).bind('mouseleave', function (e) {
      hideChooser();
    });
    
    $(years).children("li").bind('mouseenter', function (e) {
      $(this).addClass('sel').siblings().removeClass('sel');
      setYear($(this).text());
    });

    $(months).children("li").bind('mouseenter', function (e) {
      $(this).addClass('sel').siblings().removeClass('sel');
      var year = $(years).find('.sel').text();
      var month = $(this).attr('month');
      setMonth(year, month);
    });

    function createButton() {
      $(date_field).after("<img class='calendar_button' src='calendar-day.png'></img>");
      return $(date_field).next();
    }

    function createChooser() {
      $(date_field).after(buildChooser());
      var chooser = $(date_field).next();
      return chooser;
    }
    
    // make the chooser visible
    function showChooser(x, y) {
      var left = x - (years.width() / 2);
      if (left < 0) left = 0;
      
      var top = y - (years.height() / 2);
      if (top < 0) top = 0;
      
      $(chooser).css('top', top).css('left', left);
      
      $(years).show();
    }
    
    function hideChooser() {
      $(chooser).find('.sel').removeClass('sel');
      $(chooser).find('.selector').hide();
    }
  
    function setYear(year) {
      $(months).show();
      setMonth(year, -1);
    };
  
    function setMonth(year, month) {
      if (month === -1) {
        $(months).find('.sel').removeClass('sel');
        $(days).hide();
      } else {
        $(days).show();
        updateCal(year, month);
      }
    }
    
    // update calendar body
    function updateCal(year, month) {
      if (month != -1) {
        // update contents
        $(days).find('.title').text(getTitle(year, month));
        $(days).find('.body').html(buildCal(year, month));

        // adjust position
        var mh = $(months).height();
        var dh = $(days).height();
        var space = (mh-dh)/11;
        var top = space * month;
        $(days).css('top', top);
  
        $(days).find('a').bind('click', function(e) {
            var day = $(this).text();
            updateDateField(year, month, day);
            hideChooser();
          });
      }
    }
    
    function updateDateField(year, month, day) {
      $(date_field).attr("value", dateToString(new Date(year, month, day)));
    }

    function parseDateField() {
      return stringToDate($(date_field).attr("value"));
    }
  
    // calendar title
    function getTitle(year, month, day) {
      return MONTHS[month] + " " + year;
    }
  
    function daysInMonth(year, month) {
      return 32 - new Date(year, month, 32).getDate();
    }
  
    // 0 = Sun, 1 = Mon ... 6 = Sat
    function startOfMonth(year, month) {
      return new Date(year, month).getDay();
    }
    
    // build the outer markup for the chooser
    function buildChooser() {
      var html = ['<div class="chooser">'];
      html.push(buildYears());
      html.push(buildMonths());
      html.push(buildDays());
      html.push('</div>');
      return html.join('');
    }
    
    // build the year selector
    function buildYears() {
      var html = ['<ul class="years selector" style="display:none">'];
      var thisYear = parseDateField().getFullYear();
      var startYear = thisYear - 5;
      var endYear = thisYear + 6;
      for (var i=startYear; i <= endYear; i++) {
          html.push('<li>');
          html.push(i);
          html.push('</li>');
      }
      html.push('</ul>');
      return html.join('');
    }
    
    // build the month selector
    function buildMonths() {
      var html = ['<ul class="months selector" style="display:none">'];
      for (var i=0; i < 12; i++) {
          html.push('<li month="' + i + '">');
          html.push(MONTHS[i]);
          html.push('</li>');
      }
      html.push('</ul>');
      return html.join('');
    }
    
    // build the day selector
    function buildDays() {
      var html = ['<div class="days selector" style="display:none">'];
      html.push('<div class="header title">[title]</div><div class="header weekdays">');
      for (var i=0; i < WEEKDAYS.length; i++) {
        html.push('<span>');
        html.push(WEEKDAYS[i]);
        html.push('</span>');
      }
      // div.body will be filled with buildCal() contents
      html.push('</div><div class="body">[calendar]</div></div>');
      return html.join('');
    }

    // build the inner markup for the calendar
    function buildCal(y, m) {
      var html = ['<div class="wk">'];
      var days = daysInMonth(y, m);
      var pad = startOfMonth(y,m);
      for (var i=0; i < pad; i++) {
        html.push('<span></span> ');
      }
      for (var i=1; i <= days; i++) {
        html.push('<a href="#">')
        html.push(i)
        html.push('</a>');
        if ((pad + i) % 7 == 0) {
          html.push('</div><div class="wk">');
        }
      }
      html.push('</div>');
      return html.join('');
    }
    
    function dateToString(date) {
      return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear();
    }

    function stringToDate(str) {
      var pattern = /(\d+)\/(\d+)\/(\d+)/;
      var arr = str.match(pattern);
      return (arr == null) ? new Date() : new Date(arr[3], arr[1]-1, arr[2]);
    }
  }
};