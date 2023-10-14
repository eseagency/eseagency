/*

cb-textreveal-element=text
cb-textreveal-pageload=true
cb-textreveal-style=h1

cb-parallax-element=work-hero
cb-parallax-start=fully visible
cb-imageload-element=hero

*/





function initBarba() {
  barba.init({
    debug: false,
    timeout: 8000,
    transitions: [{
      name: 'default-transition',
      async before(data) {
        $("body").addClass("transitioning").addClass("first-load")
        $("[data-barba=container]").addClass("barba-old")
      },
      async enter(data) {
        if (typeof data.trigger === "object") {
          if (data.trigger.hasAttribute("cb-barba-delay")) {
            const delay = parseInt(0 + data.trigger.getAttribute("cb-barba-delay"))
            await timeout(delay)
          }
        }

        if (data.trigger === "back") {
          $(".barba__main:not(.barba-old)").addClass("barba-back")
        }
        await imageload()
        $(".barba__main.barba-old").addClass("page-unload")

        defaultPageload()
        restartWebflow()
      },
      async afterEnter() {
        await timeout(1000)
      }
    }],
    views: [{
      namespace: 'work',
      async beforeEnter(data) {
        let path = ""

        if (data.trigger === "back") {
          path = data.current.url.path
        }

        loadPageWork(path)
      },
      afterEnter() {
        console.log("after Enter")
        loadPageWorkAfter()
      }
    },
    {
      namespace: 'work-cms',
      afterEnter() {
        loadCmsWork() 
      },
    },
    {
      namespace: 'expertise-cms',
      afterEnter() {
        loadPageCmsExpertise()
      },
    },
    {
      namespace: 'team',
      beforeEnter() {loadPageTeam()},
      afterEnter() {
        loadPageTeamAfter()
      },
    },
    {
      namespace: 'jobs',
      afterEnter() {
        loadPageJobs()
      },
    },
    {
      namespace: 'jobs-cms',
      afterEnter() {
        loadCmsJobs()
      },
    },
    {
      namespace: 'home',
      async afterEnter() {        
        await loadPageHome()
      }
    }]
  })
}





/* Testing Logs */

function setupCheckDebug() {
  var wrapper = $("[data-barba=wrapper]")
  var container = $("[data-barba=container]")
  var namespace = container.attr("data-barba-namespace") ?? ""

  if (!wrapper.length) {console.log("BARBA > No wrapper found")}
  if (!container.length) {console.log("BARBA > No container found")}
  if (namespace === "") {console.log("BARBA > No namespace name set")}
}

setupCheckDebug()


barba.hooks.before((data) => {
  lenis.stop()

  if (data.current.namespace === 'home') {
    unloadPageHome();
    unloadJS("https://codeblocks.eseassets.ch/imgScrollScrub/imgScrollScrub-lenis.js")
  }
  else if (data.current.namespace === 'team') {
    unloadPageTeam()
  }
  else if (data.current.namespace === "work") {
    unloadPageWork()
  }
  else if (data.current.namespace === "expertise-cms") {
    unloadPageCmsExpertise()
  }
  else if (data.current.namespace === "jobs") {
    unloadPageJobs()
  }
  else if (data.current.namespace === "jobs-cms") {
    unloadCmsJobs()
  }
  else if (data.current.namespace === "work-cms") {
    unloadCmsWork() 
  }
  
});
barba.hooks.after(() => {
  $("body").removeClass("transitioning")
  lenis.resize()
  updateResizeObserver()
});




function defaultPageload() {
  inlineHtmlConverter()
  inlineTextLinkConverter()

  textsplitter($("[cb-textreveal-element=text], .j-prio__word, .j-prio__word-false"))
  indexing()
  cbcurrent()
  initLenis()
  toggleParallax()
  videoCover()
  uiStyler()
  parallaxElements()



  setTimeout(() => {
    $(".barba__main:not(.barba-old)").addClass("page-loaded")
    $("body:not(.body-blocker)").addClass("body-ready")
  }, 10)
}



var testStopperState = false

async function testStopper(data) {
  return new Promise(resolve => {
    var interval = setInterval(() => {
      if (testStopperState) {
        clearInterval(interval)
        testStopperState = false
        resolve("done");
      }
      
    }, 100);
  });
}


async function timeout(delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("done");
    }, delay);
  });
}




/*-----------------------------------------------------------*/
/* lenis scroll                                              */
/*-----------------------------------------------------------*/


let lenisLastScrollPos = 1
let lenisScrollPos = 0
let lenis = false


function initLenis() {
  if (lenis !== false) {
    lenis.destroy()
  }

  const el = $(".barba__main:not(.barba-old) .utl__scroller").last()[0]
  const $el = $(".barba__main:not(.barba-old) .utl__scroller").last()

  if (!$el.length) {
    console.log("LENIS > No Lenis Found!")
    return
  }

  lenis = new Lenis({
    content: el,
    wrapper: el,
  })


  lenis.on('scroll', (e) => {
    lenisScrollPos = e.animate.value

    if (lenisScrollPos === lenisLastScrollPos) {
      lenisScrollPos = $el.scrollTop()
    }
    
    lenisLastScrollPos = e.animate.value

    if (lenisScrollPos > 10) {
      $el.addClass("scrolled-page")
    }
    else {
      $el.removeClass("scrolled-page")
    }
  })

  var prefScroll = parseInt($(".barba__main:not(.barba-old)").eq(0).attr("pref-scroll-pos"))

  if (!isNaN(prefScroll)) {
    console.log(`prefered Scroll to ${prefScroll}`)
    lenis.setScroll(prefScroll)
  }


  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf) 
}


let resizeObserver;

const updateResizeObserver = () => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }

  let debounceTimer;
  const mainElement = document.querySelector('.barba__main:not(.barba-old) .utl__scroller-wrapper');

  if (mainElement) {
    resizeObserver = new ResizeObserver(() => {
      clearTimeout(debounceTimer);

      debounceTimer = setTimeout(() => {
        if (!lenis) {return}
        lenis.resize();
      }, 500)

      
    });

    resizeObserver.observe(mainElement);
  }
};

updateResizeObserver()




/*-----------------------------------------------------------*/
/* New Navigation                                            */
/*-----------------------------------------------------------*/


$("[cb-navdd-element=trigger]").hover(function() {
  $("body").addClass("nav-open")
})
$("[cb-navdd-element=close], .nav__link:not([cb-navdd-element=trigger])").hover(function() {
  $("body").removeClass("nav-open")
})


$(".nav-dd__link").each(function(index) {
  $(this).attr("style", `--index: ${index}`)
})
$(".nav__link__item > .nav__link, .nav-logo").each(function(index) {
  $(this).attr("style", `--index: ${index}`)
})
$(".nav-dd__list").attr("style", `--length: ${$(".nav-dd__link").length}`)


$(".nav-dd__link").hover(function() {
  var i = $(this).parents(".nav-dd__collection-item").index()
  $(".nav-dd__img").removeClass("cb-visible").eq(i).addClass("cb-visible")
}).click(function() {
  $("body").removeClass("nav-open")
})




/*-----------------------------------------------------------*/
/* Click Remote                                              */
/*-----------------------------------------------------------*/


$(document).on("click", "[cb-remote-trigger]", function() {
  var t = $(this).attr("cb-remote-trigger")
  $(`[cb-remote-target=${t}]`)[0].click()
})




/*-----------------------------------------------------------*/
/* Pageload Helpers                                          */
/*-----------------------------------------------------------*/


function cbcurrent() {
  $(".cb-current").removeClass("cb-current")
  $(`[href="${window.location.pathname}"]`).addClass("cb-current")
}


async function imageload() {
  return new Promise((resolve, reject) => {
   var el = $(".barba__main:not(.barba-old) [cb-imageload-element=hero]")

    if (!el.length) {
      //console.log("no Images to load")
      resolve("no Images to load")
      return
    }

    el.imagesLoaded( function() {
      //console.log("Images Loaded")
      clearTimeout(timeout)
      resolve("Images Loaded")
    }); 


    const timeout = setTimeout(function() {
      //console.log("Load overwrite")
      resolve("load overwrite")
    }, 1500)
  })
  
}




/*-----------------------------------------------------------*/
/* UI Styler                                                 */
/*-----------------------------------------------------------*/



function uiStyler() {

  // jobs

  if ($(".barba__main:not(.barba-old) .j-body").length) {
    $("body").addClass("jobs-page")
    $(".barba__main:not(.barba-old)").addClass("jobs-main")
  }
  else {
    $("body.jobs-page").removeClass("jobs-page")
    $(".barba__main:not(.barba-old).jobs-main").removeClass("jobs-main")
  }
}



/*-----------------------------------------------------------*/
/* Convert to HTML                                           */
/*-----------------------------------------------------------*/


function inlineHtmlConverter() {
  var el = $("[cb-html-element=target]:not(.html-converted)")

  if (!el.length) {return}

  el.each(function() {
      $(this).html($(this).text()).addClass("html-converted")
  })
}



/*-----------------------------------------------------------*/
/* Text Link Convert                                         */
/*-----------------------------------------------------------*/

function inlineTextLinkConverter() {
  var el = $("[cb-textlink-element=target]")

  if (!el.length) {return}

  el.each(function() {
      var html = $(this).html()
      var regex = /([a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4})/ig;
      $(this).html(html.replace(regex, '<a href="mailto:$1">$1</a>'))
  })
}





/*-----------------------------------------------------------*/
/* Dropdowns                                                 */
/*-----------------------------------------------------------*/


$(document).off('click', '[cb-dd-element=button]').on('click', '[cb-dd-element=button]', function() {
  var p = $(this).parents("[cb-dd-element=item]")
  var check = p.hasClass("dd-open")

  $("[cb-dd-element=item]").removeClass("dd-open")

  if (check) {return}

  var list = p.find("[cb-dd-element=list]")

  var h = list.children().outerHeight() + "px"
  p.addClass("dd-open")
  list.attr("style", `--height:${h}`)
})



$(document).on('click', 'body', function(e) {
  if ($(e.target).parents("[cb-dd-element=item]").length || $(e.target).is("[cb-dd-element=item]")) {return}

  $("[cb-dd-element=item]").removeClass("dd-open")
})


function initDropdowns() {
  if (!$("[cb-dd-element=list]").length) {return}

  $("[cb-dd-element=list]").each(function() {
    const h = $(this).children().outerHeight() + "px"
    $(this).attr("style", `--height:${h}`)
  })
}

$(window).on("resize focusin", initDropdowns)
$(document).ready(initDropdowns)





/*-----------------------------------------------------------*/
/* Indexing                                                  */
/*-----------------------------------------------------------*/


function indexing() {
  $("[cb-indexing-group]:visible").each(function() {
    const name = $(this).attr("cb-indexing-group")
    const index = $(this).index(`[cb-indexing-group=${name}]:visible`)
    const length = $(`[cb-indexing-group=${name}]:visible`).length

    $(this).attr("style", `--index: ${index}`)
    $(this).parent().attr("style", `--length: ${length}`)
  })
}




/*-----------------------------------------------------------*/
/* Debounce                                                  */
/*-----------------------------------------------------------*/


function debounce(func, wait) {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), wait);
    };
}





/*-----------------------------------------------------------*/
/* Pageload                                                  */
/*-----------------------------------------------------------*/


$(document).ready(function() {
  if ($(".barba__wrapper").length && $(".barba__main").length) {
    initBarba()
  }


  defaultPageload()
})



$(window).on("resize focusin", function() {
  lenis.resize()
})




/*-----------------------------------------------------------*/
/* Script Management                                         */
/*-----------------------------------------------------------*/


async function loadJS(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = () => {
      // console.log(`Script ${url} loaded successfully`);
      resolve(`Script ${url} loaded successfully`);
    };
    script.onerror = () => reject(`Failed to load script ${url}`);
    document.body.appendChild(script);
  });
}


async function unloadJS(url) {
  return new Promise((resolve, reject) => {
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
      if (scripts[i].src === url) {
        scripts[i].parentNode.removeChild(scripts[i]);
        // console.log(`Script ${url} removed successfully`)
        resolve(`Script ${url} removed successfully`);
        return;
      }
    }
    reject(`Failed to find script ${url}`);
  });
}




/*-----------------------------------------------------------*/
/* Video Cover                                               */
/*-----------------------------------------------------------*/


function videoCover() {
  var vid = $("[cb-vidcover-target]")

  $(document).off("ready", checkDimensions)
  $(window).off("resize focusin", checkDimensions)

  if (!vid.length) {return}

  $(document).on("ready", checkDimensions)
  $(window).on("resize focusin", checkDimensions)

  checkDimensions()
}


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
/* Webflow Restart                                           */
/*-----------------------------------------------------------*/


async function restartWebflow(modules) {
  const ix2 = Webflow.require('ix2');
  if (ix2) {
    ix2.destroy()

    setTimeout(function() {
      ix2.init();
    }, 100)
    
  }

  /*

    const { Webflow } = window;
    if (!Webflow || !('destroy' in Webflow) || !('ready' in Webflow) || !('require' in Webflow))
        return;
    if (modules && !modules.length)
        return;
    // Global
    if (!modules) {
        Webflow.destroy();
        Webflow.ready();
    }
    // IX2
    if (!modules || modules.includes('ix2')) {
        const ix2 = Webflow.require('ix2');
        if (ix2) {
            const { store, actions } = ix2;
            const { eventState } = store.getState().ixSession;
            const stateEntries = Object.entries(eventState);
            if (!modules)
                ix2.destroy();
            ix2.init();
            await Promise.all(stateEntries.map((state) => store.dispatch(actions.eventStateChanged(...state))));
        }
    }
    // Lightbox
    if (modules?.includes('lightbox'))
        Webflow.require('lightbox')?.ready();
    // Slider
    if (modules?.includes('slider')) {
        const slider = Webflow.require('slider');
        if (slider) {
            slider.redraw();
            slider.ready();
        }
    }
    // Tabs
    if (modules?.includes('tabs'))
        Webflow.require('tabs')?.redraw();
    return new Promise((resolve) => Webflow.push(() => resolve(undefined)));*/
};



/*-----------------------------------------------------------*/
/* GSAP Cursor                                               */
/*-----------------------------------------------------------*/



let xDTo = gsap.quickTo(".crs", "left", {
  duration: 0.3,
  ease: "power3"
});
let yDTo = gsap.quickTo(".crs", "top", {
  duration: 0.3,
  ease: "power3"
});

let isVisible = false;

function mouseMove(e) {
  if (!isVisible) {
    setTimeout(function() {
      $(".crs").addClass("visible")
    }, 300)
    isVisible = true;
  }

  xDTo(e.clientX);
  yDTo(e.clientY);
}

document.addEventListener("mousemove", mouseMove);

$(document).on({
  mouseenter: function () {
    $(".crs").addClass("link-hover")
  },
  mouseleave: function () {
    $(".crs").removeClass("link-hover")
  }    
}, "a");





/*-----------------------------------------------------------*/
/* GSAP Magnetic Elements                                    */
/*-----------------------------------------------------------*/



$(document).on({
  mousemove: function (e) {
    const el = $(this)
    const factor = parseInt(el.attr("cb-magnetic-factor") ?? 1)
    magneticMove(e, el, factor);
  },
  mouseleave: function (e) {
    TweenMax.to($(this).find("[cb-magnetic-element=target]"), 1, {
      x: 0, 
      y: 0,
      ease: Power2.easeOut
    });
  }    
}, '[cb-magnetic-element=wrapper]');



function magneticMove(e, wrapper, factor){
  const target = wrapper.find("[cb-magnetic-element=target]")
  const relX = e.pageX - wrapper.offset().left;
  const relY = e.pageY - wrapper.offset().top;

  const width = wrapper.width()
  const height = wrapper.height()
  
  TweenMax.to(target, 1, {
    x: (relX - width / 2) / factor,
    y: (relY - height / 2) / factor,
    ease: Power2.easeOut
  });
}







/*-----------------------------------------------------------*/
/* Image Parallax                                            */
/*-----------------------------------------------------------*/


function imgParallaxHandler(c, b, a) {
  if (!c.length) {return}
  
  var amount = a
  var target = b

  c.each(function() {
    var el = $(this);
    var type = el.attr("cb-parallax-element") ?? "default"
    var start = el.attr("cb-parallax-start") ?? "partially visible"
    var end = el.attr("cb-parallax-end") ?? "fully hidden"

    var percent = visiblePercent({
      target: el,
      scrollPosition: lenisScrollPos,
      startBoundaries: {
        type: start,
      },
      endBoundaries: {
        type: end,
      }
    })

    var currPos = el.find(target).data("parallax-position")


    if (type === "work-hero") {
      var position = (percent * (amount * 2) / 100 - amount) + 20

      if (position === currPos) {return}

      requestAnimationFrame(() => {
        el.find(target).css("transform", `translate3d(0px, ${position + "%"}, 0px) scale(1)`).data("parallax-position", position)  
      })
    }
    else if (type === "default") {
      var position = percent * (amount * 2) / 100 - amount

      if (position === currPos) {return}

      requestAnimationFrame(() => {
        el.find(target).css("transform", `translate3d(0px, ${position + "%"}, 0px) scale(${amount/100+1})`).data("parallax-position", position)   
      })
    }
    else if (type === "footer") {
      var c = $(".foo__container")
      var w = c.width()
      var ow = c.outerWidth()

      var scale = w / ow - 1

      var position = (100 - percent) * amount / 100
      var scale = (percent * scale / 100) + 1
      var radius = percent * 30 / 100

      if (position === currPos) {return}

        var fooEl = $(".foo")

        if (percent > 10 && !fooEl.hasClass("foo__visible")) {
          fooEl.addClass("foo__visible")
        }
        else if (percent < 10 && fooEl.hasClass("foo__visible")) {
          fooEl.removeClass("foo__visible")
        }

        if (percent > 0 && !$(`.barba__main:not(.barba-old)`).hasClass("foo__scaling")) {
          $(`.barba__main:not(.barba-old)`).addClass("foo__scaling")
        }
        else if (percent <=0 && $(`.barba__main:not(.barba-old)`).hasClass("foo__scaling")) {
          $(`.barba__main:not(.barba-old)`).removeClass("foo__scaling")
        }

      requestAnimationFrame(() => {
        el.find(target).css("transform", `translate3d(0px, -${position}%, 0px)`).data("parallax-position", position) 
        $(`.barba__main:not(.barba-old)`).find(".lay__page").css({"transform": `scale(${scale})`, "border-radius": `${radius}px`})
      })
    }
  })
}


function restrictPercent(i) {
        if (i < 0) {return 0}
        else if (i > 100) {return 100}
        else {return i}

}

function visiblePercent(a) {
  var prm = a

  prm = $.extend({
      scrollElement: $("body"), 
      target: $("body"),
      startBoundaries: {
        type: "fully visible",
        offset: 0,
      },
      endBoundaries: {
        type: "fully hidden",
        offset: 0,
      },
      scrollPosition: false,
  }, a)


  if (prm.scrollPosition === false) {
    prm.scrollPosition = $(window).scrollTop()
  }

  var scrollPosition = prm.scrollPosition
  var windowHeight = $(window).height()
  var targetHeight = prm.target.innerHeight()
  var targetOffset = prm.target.offset().top + scrollPosition

  var startAtScrollPosition, endAtScrollPosition



  // 0%

  if (prm.startBoundaries.type === "fully visible") {
    var smallEl = targetOffset + targetHeight
    var bigEl = targetOffset + windowHeight

    startAtScrollPosition = Math.min(smallEl, bigEl) - windowHeight
  }
  else if (prm.startBoundaries.type === "partially visible") {
    startAtScrollPosition = targetOffset - windowHeight
  }
  else {
    console.log("invalid Start")
  }


  // 100%

  if (prm.endBoundaries.type === "fully hidden") {
    endAtScrollPosition = targetOffset + targetHeight
  }
  else if (prm.endBoundaries.type === "partially hidden") {
    var smallEl = targetOffset
    var bigEl = targetOffset + targetHeight - windowHeight

    endAtScrollPosition = Math.max(smallEl, bigEl)
  }
  else if (prm.endBoundaries.type === "starts exiting") {
    endAtScrollPosition = targetOffset + targetHeight - windowHeight
  }
  else {
    console.log("invalid End")
  }


  var percent = 100 * (scrollPosition - startAtScrollPosition) / (endAtScrollPosition - startAtScrollPosition)

  return restrictPercent(percent)
}


// triggers

function toggleParallax() {
  lenis.on('scroll', (e) => {
    imgParallaxHandler($("[cb-parallax-element]"), "[cb-parallax-target]", 20)
  })

  imgParallaxHandler($("[cb-parallax-element]"), "[cb-parallax-target]", 20)  
}




/*-----------------------------------------------------------*/
/* Element Parallax                                          */
/*-----------------------------------------------------------*/



function parallaxElements() {
  lenis.off("scroll", changeParallaxPositions)

  if (!$("[data-scroll]").length) {return}

  changeParallaxPositions()

  lenis.on("scroll", changeParallaxPositions)
}

function changeParallaxPositions() {
  const winHeight = $(window).height()
  const scrollPosition = lenisScrollPos

  $("[data-scroll]").each(function() {
    const el = $(this)
    const speedString = el.data("scroll-speed") ?? 0
    const speed = parseFloat(speedString)
    const direction = el.data("scroll-direction") ?? "vertical"
    const transitionOffset = $(".barba__main:not(.barba-old)").offset().top


    const realEl = {
      height: el.outerHeight(),
      width: el.outerWidth(),
      offsetTop: el.offset().top + scrollPosition - transitionOffset
    }

    let verMovement = realEl.height * Math.abs(speed)
    let horMovement = 0

    if (direction === "horizontal") {
      verMovement = 0
      horMovement = realEl.width * Math.abs(speed)
    }

    const imaginaryEl = {
      height: realEl.height + verMovement,
      width: el.outerWidth(),
      offsetTop: realEl.offsetTop - (realEl.height * Math.abs(speed) / 2),
    }

    if (direction === "horizontal") {
      imaginaryEl.offsetTop = realEl.offsetTop
    }


    // calculate Percent

    const startAtScrollPosition = imaginaryEl.offsetTop - winHeight
    const endAtScrollPosition = imaginaryEl.offsetTop + imaginaryEl.height

    var percent = 100 * (scrollPosition - startAtScrollPosition) / (endAtScrollPosition - startAtScrollPosition)

    if (percent > 100 || percent < 0) {return}

    let transformY = ((verMovement / 100 * percent) - (verMovement / 2))
    let transformX = ((horMovement / 100 * percent) - (horMovement / 2))

    if (speed > 0) {
      transformY = transformY * -1
      transformX = transformX * -1
    }

    requestAnimationFrame(() => {
      el.children().css("transform", `translate(${transformX}px, ${transformY}px)`)
    })
  })
}





















/*-----------------------------------------------------------*/
/* PAGE: Work                                                */
/*-----------------------------------------------------------*/


function loadPageWork(lastUrlPath) {

  if (lastUrlPath !== "") {
    const target = $(`.barba__main:not(.barba-old) .wrk-list__item a[href="${lastUrlPath}"]`)
    const scrollPos = target.offset().top - $(`.barba__main:not(.barba-old)`).offset().top
    const windowHeight = $(window).height() / 2

    $(`.barba__main:not(.barba-old)`).attr("pref-scroll-pos", scrollPos - windowHeight)
  }
  

  $(".barba__main:not(.barba-old) .wrk-flt__list-additions .wrk-flt__list > *").appendTo($(".wrk-flt__list").eq(0))
  $(".barba__main:not(.barba-old) .wrk-flt__list-additions").remove()

  textsplitter($("[cb-textreveal-wrapper=filter]"))


  $(document).off('click', '[cb-filter-button=filter]').on('click', '[cb-filter-button=filter]', function() {
    if ($(this).attr("cb-button-state") === "active") {return}

    $("[cb-filter-button=filter]").attr("cb-button-state", "inactive")
    $(this).attr("cb-button-state", "active")

    filterItems()

  })

  $(document).off('click', '[cb-filter-button=reset]').on('click', '[cb-filter-button=reset]', function() {
    if ($(".wrk-flt__link[cb-filter-slug=all]").attr("cb-button-state") === "active") {return}

    $("[cb-filter-button=filter]").attr("cb-button-state", "inactive")
    $(".wrk-flt__link[cb-filter-slug=all]").attr("cb-button-state", "active")

    filterItems()
  })
}


function loadPageWorkAfter() {
  console.log("add workScrollHandler")
  setTimeout(function() {
    lenis.on("scroll", workScrollHandler)
  }, 200)
}


function unloadPageWork() {
  lenis.off("scroll", workScrollHandler)
}


function filterItems() {
  $(".wrk-list__wrapper").addClass("cb-animate-out")
  $(".wrk-list__item").removeClass("scroll-past scroll-before")

  setTimeout(function() {
    var filters = "=" + $("[cb-button-state=active]").eq(0).attr("cb-filter-slug")

    if (filters === "=all") {filters = ""}

    $(`.wrk-list__item`).addClass("cb-filter-hidden")
    $(`.wrk-list__item [cb-filter-slug${filters}]`).parents(".wrk-list__item").removeClass("cb-filter-hidden")

    indexing()

    $(".wrk-list__wrapper").removeClass("cb-animate-out")
  }, 400)
}


function workScrollHandler() {
  requestAnimationFrame(() => {
    const items = $(".wrk-list__item")

    if (!items.length) {return}

    const scrollPosition = lenisScrollPos
    const windowHeight = $(window).height()

    let prevBefore = 0
    let prevAfter = 0

    items.each(function(index) {
      var el = $(this)
      var child = $(this).children(".work-list__link")

      const targetOffset = el.offset().top + scrollPosition
      const targetHeight = el.outerHeight()

      const hasBefore = el.hasClass("scroll-before")
      const hasPast = el.hasClass("scroll-past")

      if (scrollPosition + windowHeight < targetOffset) {
        el.addClass("scroll-before")
      }
      else if (scrollPosition > targetOffset + targetHeight) {
        el.addClass("scroll-past")
      }
      else if (hasBefore) {
        el.removeClass("scroll-before")
        prevBefore++
        child.attr("style", `--scrollIndex: ${prevBefore}`)
      }
      else if (hasPast) {
        el.removeClass("scroll-past")
        prevAfter++
        child.attr("style", `--scrollIndex: ${prevAfter}`)
      }
    })
  })
}



$(document).on("click", ".work-list__link", function() {
  lenis.stop()
  const el = $(this)
  el.parents(".barba__main").addClass("clicked-work")
  el.addClass("clicked-work-active")
})





















/*-----------------------------------------------------------*/
/* PAGE: Home                                                */
/*-----------------------------------------------------------*/


let scrollScrub;

async function loadPageHome() {
  $("body").addClass("body-blocker")
  await loadJS("https://codeblocks.eseassets.ch/imgScrollScrub/imgScrollScrub-lenis.js")
  addScrollScrub()
  lenis.on("scroll", workScrollHandler)
}

function unloadPageHome() {
  scrollScrub.destroy()
  lenis.off("scroll", workScrollHandler)
}


function canUseWebp() {
  let elem = document.createElement('canvas');
  if (!!(elem.getContext && elem.getContext('2d'))) {
    return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
  }
  return false;
}


function addScrollScrub() {
    let path = "https://eseassets.ch/ese-media/assets/hero-sequence/v2/webp/ese-hero-sequence[XX].webp"

    if (!canUseWebp()) {
        path = "https://eseassets.ch/ese-media/assets/hero-sequence/v2/jpg/ese-hero-sequence[XX].jpg"
    }

    lenis.stop()



    scrollScrub = new imgScrollScrub({
        imgUrl: path,
        scrollElement: $(".hh2__section"), 
        canvas: $(".hh2-vid__target"),
        frameCount: 49,
        start: 0, 
        end: 100,
        endBoundaries: {
          type: "starts exiting",
          offset: 0,
        },
        loadPercent: function(val) {
          $(".hh2__loading__copy").text(parseInt(val))

            if (val === 100) {
              $(".hh2__loading").addClass("cb-hidden")
              $("body").addClass("body-ready").removeClass("body-blocker")

                scrollScrub.play(30)
                $(".hh2-heading__h1-dummy").addClass("cb-ts__active")

                setTimeout(function() {
                    $(".hh2-heading__h3-wrapper").addClass("cb-ts__active")
                    lenis.start()
                }, 1000)
            }
        },
        reverse: true,
        loadFirstFrame: false,
    })   

    $(window).focusin(function() {
        scrollScrub.preload()
    });
    $(window).focus(function() {
        scrollScrub.preload()
    });  
}


















/*-----------------------------------------------------------*/
/* PAGE: CMS Expertise                                       */
/*-----------------------------------------------------------*/

function loadPageCmsExpertise() {
  var l = $(".barba__main:not(.barba-old) .hh2-heading__h1").eq(0).text().length
  $(".barba__main:not(.barba-old) .hh2-heading__h1-wrapper").attr("style", `--char-length: ${l}`)
  $(".barba__main:not(.barba-old) .hh2-heading__h1-dummy").addClass("cb-ts__active")

  setTimeout(function() {
    $(".ang__preheading").addClass("cb-ts__active")
  }, 1000)

  lenis.on("scroll", workScrollHandler)
}


function unloadPageCmsExpertise() {
  lenis.off("scroll", workScrollHandler)
}

























/*-----------------------------------------------------------*/
/* PAGE: Team                                                */
/*-----------------------------------------------------------*/


$.fn.shuffleChildren = function() {
  $.each(this.get(), function(index, el) {
    var $el = $(el);
    var $find = $el.children().slice(0,3);

    $find.sort(function() {
      return 0.5 - Math.random();
    });

    $find.remove();
    $find.prependTo($el);
  });
};

function loadPageTeam() {
  $(".tem__collection-wrapper").shuffleChildren();
}

function loadPageTeamAfter() {
  if (!lenis) {return}

  lenis.on('scroll', teamScrollHandler); 
}


function teamScrollHandler() {
  requestAnimationFrame(() => {
    const items = $(".tem__collection-item")

    if (!items.length) {return}

    const scrollPosition = lenisScrollPos
    const windowHeight = $(window).height()

    let prevBefore = 0
    let prevAfter = 0

    items.each(function(index) {
      var el = $(this)
      var child = $(this).children(".tem__block")

      const targetOffset = el.offset().top + scrollPosition
      const targetHeight = el.outerHeight()

      const hasBefore = el.hasClass("scroll-before")
      const hasPast = el.hasClass("scroll-past")

      if (scrollPosition + windowHeight < targetOffset) {
        el.addClass("scroll-before")
      }
      else if (scrollPosition > targetOffset + targetHeight) {
        el.addClass("scroll-past")
      }
      else if (hasBefore) {
        el.removeClass("scroll-before")
        prevBefore++
        child.attr("style", `--scrollIndex: ${prevBefore}`)
      }
      else if (hasPast) {
        el.removeClass("scroll-past")
        prevAfter++
        child.attr("style", `--scrollIndex: ${prevAfter}`)
      }
    })
  })
}




function unloadPageTeam() {
  lenis.off('scroll', teamScrollHandler); 
}





















/*-----------------------------------------------------------*/
/* PAGE: Jobs                                                */
/*-----------------------------------------------------------*/



$(document).on({
    mouseenter: function () {
        $(".j-hero__button-hover").css("opacity", "1");
    },
    mouseleave: function () {
        $(".j-hero__button-hover").css("opacity", "0");
    },
    click: function () {
        lenis.scrollTo("#stellen");
        $(".j-hero__button-hover").css("opacity", "0");
    }
}, ".j-hero__button");


$(document).on({
  mouseenter: function () {
    $(".j-cta__section").addClass("hover")
    $(".crs").addClass("jobs-hover")
  },
  mouseleave: function () {
    $(".j-cta__section").removeClass("hover")
    $(".crs").removeClass("jobs-hover")
  },
}, ".j-cta__heading");




function loadPageJobs() {
  var el = $(".j-prio__word")
  var max = el.length
  var i = 0

  advance = function advance() {
    var cleanupEl = $(".j-prio__section .cb-tt-top")

    cleanupEl.addClass("notransition")

    setTimeout(function() {
      cleanupEl.removeClass("cb-tt-top")
    }, 1000)
    setTimeout(function() {
      cleanupEl.removeClass("notransition")
    }, 1500)
        


    var active = $(".j-prio__section .cb-tt-active")

    active.addClass("cb-tt-top").removeClass("cb-tt-active")


    setTimeout(function() {
      $(".j-prio__word").eq(i).addClass("cb-tt-active")
      $(".j-prio__word-false").eq(i).addClass("cb-tt-active")
    }, 400)


    i++
    if (i === max) {
      i = 0
    }
  }

  advance()

    
  pageJobsInterval = setInterval(function() {
    if (document.hasFocus()) {advance()}
  }, 2500)
}


function unloadPageJobs() {
  clearInterval(pageJobsInterval)
}


























/*-----------------------------------------------------------*/
/* PAGE: CMS Jobs                                            */
/*-----------------------------------------------------------*/



$(document).on("click", ".j-cms__dd__button", function() {
  var p = $(this).parent()
  var check = p.hasClass("dd-open")

  $(".j-cms__dd__item").removeClass("dd-open")
  $(".j-cms__dd__item .j-cms-dd__list").css("height", "0px")  

  if (!check) {
    var h = p.find(".j-cms-dd__list-copy").outerHeight() + "px"
    p.addClass("dd-open")
    p.find(".j-cms-dd__list").css("height", h)    
  }
})


$(document).on("click", ".j-cta__heading.mehrzu", function() {
    $(".j-cursor__circle").removeClass("active")
})


$("body").click(function(e) {
    if ($(e.target).parents(".j-cms__dd__item").length || $(e.target).hasClass("j-cms__dd__item")) {return}

    $(".j-cms__dd__item").removeClass("dd-open")
    $(".j-cms__dd__item .j-cms-dd__list").css("height", "0px")
})


function loadCmsJobs() {
  lenis.on("scroll", cmsJobsProfil)
}
function unloadCmsJobs() {
  lenis.off("scroll", cmsJobsProfil)
}

function cmsJobsProfil() {
  var center = $(window).height() / 2

  $(".j-cms-profil__richtext *").each(function() {
    var elTop = $(this).offset().top
    var elBottom = elTop + $(this).outerHeight()

    if (center > elTop && center < elBottom) {
      $(this).addClass("active")
    }
    else {
      $(this).removeClass("active")
    }
  })
}






























/*-----------------------------------------------------------*/
/* PAGE: CMS Work                                            */
/*-----------------------------------------------------------*/

var workPlayers = []


function loadCmsWork() {
  nextWork()
  workCmsCreatePlayer()
  workCmsMiniscripts()
}

function unloadCmsWork() {
  try {
    $.each(workPlayers, function(index, value) {
      this.destroy()
    })

    workPlayers = []
  } catch (error) {
    workPlayers = []
  }
}


/* adds Next Item to the end */

function nextWork() {
  var index = window.location.pathname
  var nextContainer = $('.barba__main:not(.barba-old) a[href="' + index + '"]').parent().next();

  if (nextContainer.length == 0) {
    var nextContainer = $(".barba__main:not(.barba-old) .work__next__hidden-link").eq(0).parent();
  }

  var link = nextContainer.children("a").attr("href");
  var name = nextContainer.children("a").text();

  $(".barba__main:not(.barba-old) .work__next__section .work__hero__heading").text(name);
  $(".barba__main:not(.barba-old) .work__next__section").attr("href", link);
}


/* creates all Players */

function workCmsCreatePlayer() {
  $('.barba__main:not(.barba-old) iframe[src*="vimeo.com"]').each(function(i) {
    var url = $(this).attr("src")
    $(this).attr("vid-index", i)


    $(this).attr({
      "src": "",
      "allow": "autoplay"
    })
    $(this).attr("src", url + "?background=1")

    let player = new Vimeo.Player($(this))
    workPlayers.push(player)
  })
}


/* player UI functionality */

function changeVideo(comnd, el) {
  let vid = el.find('iframe[src*="vimeo.com"]').eq(0)
  let index = parseInt(vid.attr("vid-index"))
  var player = workPlayers[index]

  console.log(index)

  if (comnd === "pause") {
    player.pause()
  }
  if (comnd === "play") {
    player.play()
  }
  if (comnd === "replay") {
    player.setCurrentTime(0)
     player.setVolume(1)
     vid.next().find(".vid-audio").addClass("audio-on")
  }
  else if (comnd === "unmute") {
    player.setVolume(1)
  }
  else if (comnd === "unmute") {
    player.setVolume(0)
  }
  else if (comnd === "mute-toggle") {
    player.getMuted().then(function(muted) {
      if (muted === true) {
          player.setVolume(1)
          vid.next().find(".vid-audio").addClass("audio-on")
        }
        else {
          player.setVolume(0)
          vid.next().find(".vid-audio").removeClass("audio-on")
        }
    }).catch(function(error) {
        return
    });
  }
}


/* add player toggles */

$(document).on("click", ".barba__main:not(.barba-old) .w-richtext-figure-type-video", function(e) {
  let el = $(this)

  e.preventDefault()

  if (!e.target.className.includes("vid-replay")) {
    changeVideo("mute-toggle", el)
  }
  else {
    var rotations = parseInt($(this).find(".vid-replay img").attr("rotations"))
    rotations++ 
    $(this).find(".vid-replay img").attr("rotations", rotations)

    var deg = rotations * 360

    $(this).find(".vid-replay img").css("transform", "rotate("+deg+"deg)")

    changeVideo("replay", el) 
  }
})



function workCmsMiniscripts() {

  /* Load Player UI */

  $(".barba__main:not(.barba-old) .w-richtext-figure-type-video").each(function() {
    if (!$(this).find("iframe").attr("src").includes("youtube")) {
      $(this).find("iframe").after('<div class="work-video-overlay"><a class="vid-audio"><img src="https://assets.website-files.com/5ad5ed47829a45473b3d336f/60ddd136a230ba18c67a405a_ese-ui-audio-off.svg" loading="lazy" width="25" alt="" class="vid-audio-icon audio-off"><img src="https://assets.website-files.com/5ad5ed47829a45473b3d336f/60ddd137984f428114c72e77_ese-ui-audio-on.svg" loading="lazy" width="25" alt="" class="vid-audio-icon audio-on"></a><a class="vid-audio vid-replay"><img src="https://uploads-ssl.webflow.com/5ad5ed47829a45473b3d336f/61b0d5f9d303133d08c744ef_ese-replay.svg" rotations="0" style="transform: rotate(0deg)" loading="lazy" width="20" height="20" alt="" class="vid-audio-icon"></a></div>')
    }
    else {
      $(this).find("iframe").css("pointer-events", "auto")
    }
  })

  /* Prevents occassional rich text error */

  $(".barba__main:not(.barba-old) .w-richtext-align-floatleft").each(function() {
    var next = $(this).next()
    if (next.is("p") && next.next().hasClass("w-richtext-figure-type-image")) {
      next.remove()
    }
  })


  /* Makes youTube-videos clickable */

  $(".work__content__richtext figure").each(function() {
    let link = $(this).find("iframe").attr("src");

    if (link) {
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
      var match = link.match(regExp);
      if (match) {
        $(this).css("pointer-events", "auto")
      }
    }
  })  
}


















