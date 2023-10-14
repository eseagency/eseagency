/*-----------------------------------------------*/
/* Smaller utility scripts                       */
/*-----------------------------------------------*/



/* Convert HTML */

$("[cb-html-element=target]").each(function() {
    $(this).html($(this).text())
})




/* Remove Parent of empty Collection */

$("[cb-empty-element=indicator]:visible").parents("[cb-empty-element=target]").remove()




/* Footer Year */

$("[cb-year-element]").text(new Date().getFullYear());




/* Remoteclicks */

$("[cb-remoteclick-trigger]").click(function() {
  var t = $(this).attr("cb-remoteclick-trigger")
  $("[cb-remoteclick-target="+t+"]").click()
})




/* Replace curly braced text with x */

$("[cb-textreplace-content]").each(function() {
  var attr = $(this).attr("cb-textreplace-content")
  var content = $(this).text()

  $("body *:not(:has(*))").each(function() {
    $(this).html($(this).html().replace("{{"+attr+"}}", content))
  })
})




/* Change Navigation style when page is scrolled */

function cbStickyNavToggle() {
  if ($(window).scrollTop() > 0) {
    $("body").addClass("utl__sticky-nav")
  } 
  else {
    $("body").removeClass("utl__sticky-nav")
  }
}

cbStickyNavToggle()
$(window).scroll(function() {cbStickyNavToggle()})
$(document).ready(function() {cbStickyNavToggle()})




/* Localizing Dates (needs moment-with-locales.js to work) */

function cbLocalizeDates() {
  $('[cb-moment-element]').each(function(){
    if ($(this).attr("cb-moment-state") === "locked") {return}

    var format = $(this).attr("cb-moment-element")
	  var lang = $("html").attr("lang")

	  moment.locale(lang)
      
    var dt = moment($(this).html(),'YYYY-MM-DD').format(format);

    $(this).html(dt);
    $(this).attr("cb-moment-state", "locked")
  });  
}

cbLocalizeDates()




/* replaces every reference to testing domain with a non specific one: ../slug-of-your-page */

function cbRemoveTestlink() {
  $("a[href*='.webflow.io']").each(function() {
    var link = $(this).attr("href")
    console.log(link.replace(/https:\/\/(?:[\w\-\_]+\.)webflow\.io/, ""))
    $(this).attr("href", link.replace(/https:\/\/(?:[\w\-\_]+\.)webflow\.io/, ""))
  })
}




/* Prevent Form submission */

function cbPreventFormSubmit() {
  $('[cb-form-submit=false]').submit(function() {
    return false;
  });
}

cbPreventFormSubmit()




/* Check if an Element is currenty visible */
/* use true or false for the second parameter to toggle if it needs to be fully visible or not */

function cbVisibility(a, b) {
  function isElementInView(e, f) {
    var a = $(window).scrollTop();
    var c = a + $(window).height();
    var b = $(e).offset().top;
    var d = b + $(e).height();
    return f === !0 ? a < b && c > d : b <= c && d >= a;
  }

  if (b) {
    return isElementInView($(a), !0) ? !0 : !1;
  }
  else {
    return isElementInView($(a), 0) ? !0 : !1;
  }
}




/*-----------------------------------------------*/
/* Darkmode Switch                               */
/*-----------------------------------------------*/


/* Attention: needs custom css to work (.cb__darkmode) */


/* add this in a embed element at the top of each page */

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

if (getCookie("cb-pagemode") === "dark") {
    document.getElementsByTagName("body")[0].className = "cb__darkmode"
}


/* add this before the </body>-tag */

function setCookie(name, value) {
  var date = new Date();
  date.setTime(date.getTime()+15724800000);
  document.cookie = name + "="+value+"; expires=" + date.toGMTString() + "; path=/";
}

function cbToggleDarkmode() {
  if ($("body").hasClass("cb__darkmode")) {
    cbSetPageMode("light")
  }
  else {
    cbSetPageMode("dark")
  }
}

function cbSetPageMode(mode) {
  if (mode === "dark") {
    $("body").addClass("cb__darkmode")
    setCookie("cb-pagemode", "dark")
  }
  else if (mode === "light") {
    $("body").removeClass("cb__darkmode")
    setCookie("cb-pagemode", "light")
  }
}


$("[cb-darkmode-element=toggle]").click(function() {
  cbToggleDarkmode()
})




/*-----------------------------------------------*/
/* Mobile Nav burger lines close animation       */
/*-----------------------------------------------*/


function cbBurgerLinesToggle(state) {
	var pos = "3px" // change this to make the perfect x on closed
	var ofs = 360   // change this to fit the transition duration

    var t = $("[cb-burgerLines-element]").eq(0)
    var b = $("[cb-burgerLines-element]").eq(1)

    if (state === "open") {
        t.css("transform", "translateY("+pos+") rotateZ(0deg)")
        b.css("transform", "translateY("+pos+") rotateZ(0deg)")

        setTimeout(function() {
            t.css("transform", "translateY("+pos+") rotateZ(45deg)")
            b.css("transform", "translateY("+pos+") rotateZ(-45deg)")
        }, ofs)
    }
    else if (state === "close") {
        t.css("transform", "translateY("+pos+") rotateZ(0deg)")
        b.css("transform", "translateY("+pos+") rotateZ(0deg)")

        setTimeout(function() {
            t.css("transform", "translateY(0px) rotateZ(0deg)")
            b.css("transform", "translateY(0px) rotateZ(0deg)")
        }, ofs)
    }
}



/*-----------------------------------------------*/
/* Dropdowns                                     */
/*-----------------------------------------------*/


/* Attention: needs custom css to work (.cb-dropdown-open) */

function cbDropdownSetup(t) {
  if (t === "refresh") {
    $(("[cb-dropdown-element=dropdown].cb-dropdown-open")).each(function() {
      var list = $(this).find("[cb-dropdown-element=list]")
      var content = $(this).find("[cb-dropdown-element=content]")
      list.css("height", content.outerHeight() + "px")
    })
    return
  }

  $("[cb-dropdown-group]").each(function() {

    $("[cb-dropdown-element=button]").click(function() {
        cbToggleDropdown($(this).parents("[cb-dropdown-element=dropdown]"))
    })

    function cbToggleDropdown(e) {
      var parent = e;

      var list = parent.find("[cb-dropdown-element=list]")
      var content = parent.find("[cb-dropdown-element=content]")

      var state = list.height() === 0
      var speed = parseFloat(list.css('transition-duration')) * 1000 + 100


      setTimeout(function() {
        $("[cb-dropdown-element=list]").css("height", "0px")
        $("[cb-dropdown-element=dropdown]").removeClass("cb-dropdown-open")

        if (state) {
            list.css("height", content.outerHeight() + "px")
            parent.addClass("cb-dropdown-open")
        }  
      }, 10)
    }    
  })  
}

// $(window).resize(function() {cbDropdownSetup("refresh")});
// $(window).focusin(function() {cbDropdownSetup("refresh")});

// cbDropdownSetup()


/*-----------------------------------------------*/
/* Dropdown Double Columns                       */
/*-----------------------------------------------*/


function cbDropdownSplitter() {
  $("[cb-ddsplitter-group]").each(function() {
    
    if ($(this).attr("cb-ddsplitter-state") === "finished") {return}
    $(this).attr("cb-ddsplitter-state", "finished")

    $(this).find(".w-dyn-items").clone().html("").appendTo($(this))
    var items = $(this).find(".w-dyn-item")
    items.slice(Math.ceil(items.length / 2)).appendTo($(this).find(".w-dyn-items").eq(1))
  })
}



  


/*-----------------------------------------------*/
/* Default Modals                                */
/*-----------------------------------------------*/


function cbModalSetup() {

  $("[cb-modal-trigger]").each(function() {
    var name = $(this).attr("cb-modal-trigger")
    var index = $(this).index("[cb-modal-trigger="+name+"]")
    $(this).attr("cb-modal-index", index)
  })

  $("[cb-modal-trigger]").click(function() {
    var name = $(this).attr("cb-modal-trigger")
    var index = $(this).attr("cb-modal-index")
    var targetElement = $("[cb-modal-target="+name+"]").eq(index)
    cbModalTrigger("open", targetElement)
  })

  $("[cb-modal-target], [cb-modal-element=close]").click(function(e) {
    if ($(e.target).attr("cb-modal-target") || $(this).attr("cb-modal-element") === "close") {
      cbModalTrigger("close")
    }
  })

  $(document).on('keyup',function(e) {
    if (e.keyCode === 27) {
       cbModalTrigger("close")
    }
  });

}
function cbModalTrigger(state, target) {
  if (state === "open" && target !== undefined) {
    $("[cb-modal-target]").addClass("hidden")
    target.removeClass("hidden")
    $("body").addClass("utl-locked")
  }
  else if (state === "close") {
    $("[cb-modal-target]").addClass("hidden")
    $("body").removeClass("utl-locked")
  }
}
cbModalSetup()












