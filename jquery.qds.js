jQuery.fn.quick_date_select = function() {
  return this.each(function(){
    $(this).addClass('date_field')
    jQuery.QuickDateSelect.activate(this);
  });
};

/**
 * @constructor
 * @name jQuery.QuickDateSelect
 * @param date_field the <span> element to create the date select for.
 */
jQuery.QuickDateSelect = {
  activate: function(date_field) {

    createChooser();

    $(date_field).bind('click', function(e) {
      showChooser(e.pageX, e.pageY)
    });

    $("#chooser").bind('mouseleave', function (e) {
        hideChooser()
    });
    
    $("#years li").bind('mouseenter', function (e) {
        $(this).addClass('sel').siblings().removeClass('sel')
        setYear($(this).text())
    });
  
    $("#months li").bind('mouseenter', function (e) {
        $(this).addClass('sel').siblings().removeClass('sel')
        setMonth($(this).text())
    });

    function addMonthIndexes() {
        $("#months li")
    }

    
    function createChooser() {
      $(date_field).after(buildChooser())
      $('#years, #days, #months').hide()
    }
    
    // make the chooser visible
    function showChooser(x, y) {
      var left = x - ($('#years').width() / 2)
      if (left < 0) left = 0
      
      var top = y - ($('#years').height() / 2)
      if (top < 0) top = 0
      // var top = alignToCursor($('#years'), 12, y, 2008-2003+1)
      
      $("#chooser").css('top', top).css('left', left)
      
      $("#years").show()
    }
    
    // function alignToCursor(e, itemsInE, cursorY, index) {
    //   return cursorY - (e.height()/itemsInE)*(index+0.5)
    // };
    
    function hideChooser() {
      $('#chooser .sel').removeClass('sel')
      $('#years, #months, #days').hide()
    }
  
    function setYear(year) {
      $('#months').show()
      setMonth(0)
    };
  
    function setMonth(month) {
      if (month === 0) {
        $('#months .sel').removeClass('sel')
        $('#days').hide()
      } else {
        $('#days').show()
        updateCal()
      }
    }
  
    function setDay() {
    }
  
    function updateCal() {
      var year = $('#years .sel').text()
      var month = $('#months .sel').text()
      if (year > 0 && month > 0) {
        $('#days .title').text(getTitle(year, month))
        buildCal(year, month)
        var mh = $('#months').height()
        var dh = $('#days').height()
        var space = (mh-dh)/11
        var top = (space*(month-1))
        if (top < 0) top = 0
        $('#days').css('top', top)
  
        $('#days a')
          .bind('mouseenter', function (e) {
            var day = $(this).text()
            $('#days a.sel').removeClass('sel') // can't use siblings trick here
            $(this).addClass('sel')
            setDay(day)
          })
          .bind('click', function(e) {
            var day = $(this).text()
            updateDateField(year, month, day)
            hideChooser()
          });
      }
    }
    
    function updateDateField(year, month, day) {
      $(date_field).text(getTitle(year, month, day))
    }

    function monthName(month) {
        var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
        return MONTHS[month-1]
    }
  
    function getTitle(year, month, day) {
      if (day > 0)
        return monthName(month) + " " + day + ", " + year
      else
        return monthName(month) + " " + year
    }
  
    function daysInMonth(year, month) {
      return 32 - new Date(year, month-1, 32).getDate()
    }
  
    // 0 = Sun, 1 = Mon ... 6 = Sat
    function startOfMonth(year, month) {
      return new Date(year, month-1).getDay()
    }
  
    
    // build the outer markup for the chooser
    function buildChooser() {
      var html = '<div id="chooser">'
      html += buildYears()
      html += buildMonths()
      html += buildDays()
      html += '</div>'
      return html
    }

    // build the year selector
    function buildYears() {
      var html = '<ul id="years" class="selector">'
      var startYear = 2003;
      var endYear = startYear + 11
      for (var i=startYear; i <= endYear; i++) {
    	  html += '<li>'
    	  html += i
    	  html += '</li>'
  	  }
      html += '</ul>'
      return html
    }
    
    // build the month selector
    function buildMonths() {
      var html = '<ul id="months" class="selector">'
      for (var i=1; i <= 12; i++) {
    	  html += '<li>'
    	  //html += monthName(i)
          html += i
    	  html += '</li>'
  	  }
      html += '</ul>'
      return html
    }
    
    // build the day selector
    function buildDays() {
      var html = '<div id="days" class="selector"><div class="header title">[title]</div><div class="header weekdays">'
      var WEEKDAYS = ['S','M','T','W','T','F','S']
      for (var i=0; i < WEEKDAYS.length; i++) {
        html += '<span>'
        html += WEEKDAYS[i]
        html += '</span>'
      }
      html +=	'</div><div class="body">[cal]</div></div>' // div.body will be filled with buildCal() contents
      return html
    }

    // build the inner markup for the calender
    function buildCal(y, m) {
      var s = '<div class="wk">'
      var days = daysInMonth(y, m)
      var pad = startOfMonth(y,m)
      for (var i=0; i < pad; i++) {
        s += '<span></span> '
      }
      for (var i=1; i <= days; i++) {
        s += '<span><a>' + i + '</a></span> '
        if ((pad + i) % 7 == 0) {
          s += '</div><div class="wk">'
        }
  
      }
      for (; ((pad + i) % 7 != 1); i++) {
        s += '<span></span>'
      }
      s += '</div>'
      $('#days .body').html(s)
    }

  }
}
