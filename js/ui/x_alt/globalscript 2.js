/*-----------------------------------------------------------*/
/* Text Splitter                                             */
/*-----------------------------------------------------------*/


$(document).ready(function() {
  $("[cb-textreveal-pageload=true]").addClass("cb-ts__active")

  if (!locomotiveScrollElement) {return}


  locomotiveScrollElement.on('scroll', (e) => {
    $("[cb-textreveal-trigger]").each(function() {
      var el = $(this)
      var scrollPosition = locomotiveScrollPos
      var type = $(this).attr("cb-textreveal-trigger")
      var windowHeight = $(window).height()
      var targetHeight = el.innerHeight()
      var targetOffset = el.offset().top + scrollPosition

      var el = $(this).find("[cb-textreveal-element]")

      if (!el.length) {
        el = $(this)
      }

      var offsetPercent = isNaN(parseFloat(type)) ? 0 : parseFloat(type)


      if (scrollPosition + windowHeight > targetOffset + (targetHeight / 100 * offsetPercent)) {
        el.addClass("cb-ts__active")
      }
    })
  })
})




/*-----------------------------------------------------------*/
/* Video Cover                                               */
/*-----------------------------------------------------------*/


function vidCoverSetup() {
  var vid = $("[cb-vidcover-target]")

  if (!vid.length) {return}

  $(document).on("ready", checkDimensions)
  $(window).on("resize focusin", checkDimensions)
  checkDimensions()
}

vidCoverSetup()

function checkDimensions() {
    $("[cb-vidcover-target]").each(function() {
      var el = $(this)
      var v = el.attr("cb-vidcover-target").split(" ")

      var eh = el.width() * parseInt(v[1]) / parseInt(v[0])
      var ah = el.height()

      if (eh > ah) {
          el.addClass("vertical-crop")
      }
      else {
          el.removeClass("vertical-crop")
      }
    })
  }




/*-----------------------------------------------------------*/
/* Misc                                                      */
/*-----------------------------------------------------------*/

function canUseWebp() {
  var elem = document.createElement('canvas');
  if (!!(elem.getContext && elem.getContext('2d'))) {
    return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
  }
  return false;
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkForWebP() {
  var state = ""+ canUseWebp()

  //if (state == getCookie("webpsupport")) {return}
  
  //ga('send', 'event', 'Browser', 'WebP Support', state);
  document.cookie = `webpsupport=${state}; path=/`

  console.log("state")
  
}

$(document).ready(checkForWebP)


/* Remove Parent of empty Collection */

$("[cb-empty-element=indicator]:visible").parents("[cb-empty-element=target]").remove()


$("[cb-year-element]").text(new Date().getFullYear());

function is_touch_device() {
  try {
    return document.createEvent("TouchEvent"), !0;
  } catch (o) {
    return !1;
  }
}



var locomotiveScrollPos = 0

if ($("[data-scroll-container]").length) {

  function initSmoothScroll() {
    if (is_touch_device() && !window.location.pathname.includes("/jobs")) {return}

    if (window.location.pathname.includes("/v2/")) {return}

    //if (window.location.pathname.includes("/home-v2")) {return}

    const el = document.querySelector("[data-scroll-container]")
    //const isHorizontal = el.dataset.scrollDirection === 'horizontal'

    locomotiveScrollElement = new LocomotiveScroll({
      el,
      smooth: true,
      direction: "vertical", //isHorizontal ? 'horizontal' : 'vertical',
      gestureDirection: "vertical",
      lerp: 0.1,
      smartphone: {
        smooth: true,
        getDirection: true,
      },
      touchMultiplier: 2,
      tablet: {
        smooth: true
      }
    })

    locomotiveScrollElement.on('scroll', (e) => {
      locomotiveScrollPos = e.scroll.y
    })


  }

  document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname === ("/webseiten")) {return}

    initSmoothScroll();
    setTimeout(function() {locomotiveScrollElement.update()},1000)
  });
}

$("body").imagesLoaded(function() {
  if (window.location.pathname === ("/webseiten")) {return}
  locomotiveScrollElement.update()
})





/*----------------------------*/
/* ESE BRANDING               */
/*----------------------------*/

console.log("%cWell, hello there 👋🏼👀", '\
    background: rgba(0, 0, 0, 0); \
    color: black; \
    display: block; \
    adding: 15px 25px;\
    font-size: 40px;\
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";\
')
console.log("%c This website was designed and developed by https://eseagency.ch ", '\
    background: rgba(0, 0, 0, 0); \
    color: black; \
    display: block; \
    adding: 15px 25px;\
    font-size: 16px;\
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";\
')



/* BUTTON HOVER ---------------------------------------------*/

function addButtonHover(element) {
  element.hover(function(e) {
    let p = $(this)
    let el = p.find(".button__circle")
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    p.attr("style", `--width: ${p.outerWidth()}px`)

    el.addClass("notransition")
    el.removeClass("active")
    el.css("opacity", "1")

    setTimeout(function() {
        el.removeClass("notransition")  
    }, 5)

    setTimeout(function() {
      p.find(".button__cursor-position").css({"left": x + "px", "top": y + "px"})
        el.addClass("active") 
    }, 10)
      
  }, function() {
    let el = $(this).find(".button__circle");
    el.css("opacity", "0")
  })
}

addButtonHover($(".button"))



/*----------------------------*/
/* CURSOR CLICK DISPLAY       */
/*----------------------------*/


function addCursorHovers(hoveredElement, selectedElement, newClass) {
  $(hoveredElement).hover(function() {
    $(selectedElement).addClass(newClass);
  }, function() {
    $(selectedElement).removeClass(newClass);
  }); 
}

$(document).ready(function() {
  addCursorHovers("a", ".cursor__circle", "cursor__circle__hover")
  addCursorHovers(".vid-audio", ".cursor__circle", "cursor__scale-down")
})



$(".workpage__nav__prev").hover(function() {
  	// do something on hover over
    $('#cursorPointer').hide();
    $('#cursorPrev').show();
}, function() {
    // do something on hover out
    $('#cursorPointer').show();
    $('#cursorPrev').hide();
});


$(".workpage__nav__next").hover(function() {
  	// do something on hover over
    $('#cursorPointer').hide();
    $('#cursorNext').show();
}, function() {
    // do something on hover out
    $('#cursorPointer').show();
    $('#cursorNext').hide();
});



/*----------------------------*/
/* NAVIGATION REMOTECLICKS    */
/*----------------------------*/


$(document).click(function() {
  if ($(".cursor").length) {
    $(".cursor")[0].click();
  }
});

$(".nav__buger__container").click(function(event) {
  if (event.target.className === "nav__burger__text-container") {
    $(".nav__burger-container")[0].click();
  }
});

$(".nav__burger__menu, .nav__logo__link").click(function() {
  $(".nav__burger__background_fixed").css("opacity", "1")
})



/*----------------------------*/
/* PAGELOAD DELAY             */
/*----------------------------*/

// Get Cookies

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
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


/*----------------------------*/
/* PAGE TRANSITION DELAY      */
/*----------------------------*/


$("[transition=true]").click(function (e) {
  if (e.ctrlKey || e.shiftKey || e.metaKey || e.which == 2) {return}
    
  var delay = $(this).attr("transitionDelay")
  var overlayDelay = $(this).attr("transitionOverlayDelay")
  var instant = $(this).attr("transitionInstant")

  if (delay === undefined) {
    delay = 600
  }

  if (instant === "true") {
    $(".transition-overlay").removeClass("transition-time")
  }

  e.preventDefault();         
  var goTo = this.getAttribute("href");

  if (overlayDelay !== undefined) {
    setTimeout(function() {
      $(".transition-overlay").removeClass("hidden")
    }, overlayDelay)
  }
  else {
    $(".transition-overlay").removeClass("hidden")
  }

  setTimeout(function(){
    window.location = goTo;
  }, delay);  
  
  setTimeout(function () {
    $(".transition-overlay").addClass("transition-time")
    $(".transition-overlay").addClass("hidden")
  }, delay + 1000)
});

$(".nav__burger__menu").click(function () {
  $(".nav__burger-container")[0].click()
})



$('body').mouseleave(function(){
  $(".cursor__circle__container").css("opacity", "0")
});

$('body').mouseenter(function(){
  var width = $(window).width() / 2;
  var height = $(window).height() /2;
  var matrix = "matrix(1, 0, 0, 1, " + width + ", " + height + ")";

  if ($(".cursor__circle").css("transform") === matrix) {
      setTimeout(function() {
        $(".cursor__circle__container").css("opacity", "1")
      }, 500);
  }
  else {
    $(".cursor__circle__container").css("opacity", "1")
  }
});

$(".cursor__circle").css("opacity", "0")

$(document).ready(function(){
  setTimeout(function(){
    $(".cursor").css("opacity", "1")
  }, 1000);
})



/*----------------------------*/
/* REAPPLY W-CURRENT FALLBACK */
/*----------------------------


$("nav a").each(function() {
  var link = $(this).attr("href");

  if(link.indexOf("javascript") != -1) {
    var link = link.substring(link.indexOf("/"), link.length - 2);
    var currentSlug = window.location.pathname;
    if (link === currentSlug) {
      console.log("this")
      $(this).addClass("w--current");
    }
  };
});



/*----------------------------*/
/* IE FIXES                   */
/*----------------------------


if(navigator.userAgent.match(/Trident\/7\./)) { // if IE
  $('body').on("mousewheel", function () {
    // remove default behavior
    event.preventDefault(); 

    //scroll without smoothing
    var wheelDelta = event.wheelDelta;
    var currentScrollPosition = window.pageYOffset;
    window.scrollTo(0, currentScrollPosition - wheelDelta);
  });
}



/*----------------------------*/
/* IPAD FIXES                 */
/*----------------------------*/

var deviceIsiPad = navigator.userAgent.match(/iPad/i) != null;

$(function() {
  if (deviceIsiPad === true) {
    $("*").css("cursor", "default");
    $(".cursor").hide();
    if ($(".nav__burger__text-container").lenght !== 0) {
      $(".nav__buger__container").addClass("nav__burger__container__ipad");
      $(".nav__burger__text-container").addClass("nav__burger__ipad");
    }
  }
});






