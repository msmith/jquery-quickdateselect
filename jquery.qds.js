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

    var button = createButton();
    var chooser = createChooser();
    
    $(button).bind('click', function(e) {
      showChooser(e.pageX, e.pageY);
    });

    $(chooser).bind('mouseleave', function (e) {
        hideChooser();
    });
    
    $(chooser).find(".years li").bind('mouseenter', function (e) {
        $(this).addClass('sel').siblings().removeClass('sel');
        setYear($(this).text());
    });
  
    $(chooser).find(".months li").bind('mouseenter', function (e) {
        $(this).addClass('sel').siblings().removeClass('sel');
        setMonth($(this).text());
    });
    
    function createButton() {
      $(date_field).after("<img class='calendar_button' src='calendar-day.png'></img>");
      return $(date_field).next();
    }

    function createChooser() {
      $(date_field).after(buildChooser());
      var chooser = $(date_field).next();
      return chooser
    }
    
    // make the chooser visible
    function showChooser(x, y) {
      var years = $(chooser).find('.years')

      var left = x - (years.width() / 2);
      if (left < 0) left = 0;
      
      var top = y - (years.height() / 2);
      if (top < 0) top = 0;
      
      $(chooser).css('top', top).css('left', left);
      
      $(chooser).find(".years").show();
    }
    
    function hideChooser() {
      $(chooser).find('.sel').removeClass('sel');
      $(chooser).find('.years, .months, .days').hide();
    }
  
    function setYear(year) {
      $(chooser).find('.months').show();
      setMonth(-1);
    };
  
    function setMonth(month) {
      if (month === -1) {
        $(chooser).find('.months .sel').removeClass('sel');
        $(chooser).find('.days').hide();
      } else {
        $(chooser).find('.days').show();
        updateCal();
      }
    }
  
    function updateCal() {
      var year = $(chooser).find('.years .sel').text();
      var month = $(chooser).find('.months .sel').attr('month');

      if (month != -1) {
        var cal = $(chooser).find('.days');
        
        // update contents
        $(cal).find('.title').text(getTitle(year, month));
        $(cal).find('.body').html(buildCal(year, month));

        // adjust position
        var mh = $(chooser).find('.months').height();
        var dh = $(chooser).find('.days').height();
        var space = (mh-dh)/11;
        var top = space * month;
        $(cal).css('top', top);
  
        $(cal).find('a')
          .bind('mouseenter', function (e) {
            var day = $(this).text();
            $(cal).find('a.sel').removeClass('sel'); // can't use siblings trick here
            $(this).addClass('sel');
          })
          .bind('click', function(e) {
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
      var html = '<div class="chooser">'
      html += buildYears();
      html += buildMonths();
      html += buildDays();
      html += '</div>';
      return html;
    }
    
    // build the year selector
    function buildYears() {
      var html = '<ul class="years selector" style="display:none">';
      var thisYear = parseDateField().getFullYear();
      var startYear = thisYear - 6;
      var endYear = thisYear + 5;
      for (var i=startYear; i <= endYear; i++) {
          html += '<li>';
          html += i;
          html += '</li>';
      }
      html += '</ul>';
      return html;
    }
    
    // build the month selector
    function buildMonths() {
      var html = '<ul class="months selector" style="display:none">';
      for (var i=0; i < 12; i++) {
          html += '<li month="' + i + '">';
          html += MONTHS[i];
          html += '</li>';
      }
      html += '</ul>';
      return html;
    }
    
    // build the day selector
    function buildDays() {
      var html = '<div class="days selector" style="display:none">'
      html += '<div class="header title">[title]</div><div class="header weekdays">';
      for (var i=0; i < WEEKDAYS.length; i++) {
        html += '<span>';
        html += WEEKDAYS[i];
        html += '</span>';
      }
      // div.body will be filled with buildCal() contents
      html +=	'</div><div class="body">[calendar]</div></div>';
      return html
    }

    // build the inner markup for the calendar
    function buildCal(y, m) {
      var html = '<div class="wk">'
      var days = daysInMonth(y, m)
      var pad = startOfMonth(y,m)
      for (var i=0; i < pad; i++) {
        html += '<span></span> '
      }
      for (var i=1; i <= days; i++) {
        html += '<span><a>' + i + '</a></span> '
        if ((pad + i) % 7 == 0) {
          html += '</div><div class="wk">'
        }
      }
      for (; ((pad + i) % 7 != 1); i++) {
        html += '<span></span>'
      }
      html += '</div>'
      return html
    }
    
    function dateToString(date) {
      return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear();
    }

    function stringToDate(str) {
      var pattern = /(\d+)\/(\d+)\/(\d+)/;
      var arr = str.match(pattern);
      return (arr == null) ? new Date() : new Date(arr[3]-1, arr[1], arr[2]);
    }

  }
}
