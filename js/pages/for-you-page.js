function getParam(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


var fySwiper;
var globalActiveIndex = 0

let vimeoPlayers = {};

console.log("test")


function updateGlobalIndex(i) {
    $(`.fy__collection-item[real-index]`).removeClass("video-slide-active")
    $(`.fy__collection-item[real-index=${i}]`).addClass("video-slide-active")

    globalActiveIndex = i
}

function detectMob() {    
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];
    
    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}


/* Preload Video */

async function preloadVimeoVideo(index) {
    const el = $(`.fy__collection-item[real-index=${index}] .fy__video__embed`);
    const vimeoId = el.data("vimeo-id-test");

    if (!vimeoPlayers[index] && vimeoId) {
        //console.log("create Video: " + index)

        vimeoPlayers[index] = new Vimeo.Player(el[0], {
            id: vimeoId,
            autoplay: false,
            controls: false,
            autopause: false,
            loop: true,
        });

        console.log("created player: " + index)

        // Add play and pause event listeners to manage the body class
        vimeoPlayers[index].on('play', function() {
            $('body').removeClass('player-paused');
        });
        vimeoPlayers[index].on('pause', function() {
            if (index !== globalActiveIndex) {return}
            $('body').addClass('player-paused');
        });
        vimeoPlayers[index].on('timeupdate', function(e) {
            $(`.fy__collection-item[real-index=${index}]`).attr("style", `--player-progress: ${e.percent * 100}%`)
        });

        
        if (detectMob()) {
            return
        }

        // Start and immediately pause the video to preload it


        vimeoPlayers[index].play().then(() => {
            if (index === globalActiveIndex) {return}
            vimeoPlayers[index].pause();
        }).catch(function(error) {
            //console.log("error")
        });
    }
}


async function updateVimeoSlide() {
    // Preload adjacent videos for a more seamless experience

    $(".fy__collection-item").each(async function() {
        var i = parseInt($(this).attr("real-index"))

        if (i >= globalActiveIndex - 1 && i <= globalActiveIndex + 1) {
            await preloadVimeoVideo(i);
        }
        else if (vimeoPlayers[i]) {
            vimeoPlayers[i].destroy()
            delete vimeoPlayers[i]
            $(`.fy__collection-item[real-index=${i}]`).removeAttr("style")
            console.log("destroy vimeo with index " + i)
        }
    })
}


function updatePlayback(play) {
    // Stop all videos
    for (const player of Object.values(vimeoPlayers)) {
        player.pause();
    }

    var i = globalActiveIndex

    if (detectMob()) {
        $('body').addClass('player-paused');
    }
        
    // Start the video for the current slide
    if (vimeoPlayers[i] && !detectMob() && play !== false) {
        vimeoPlayers[i].play();
    }
}



function trimToTen() {
  let el = $('.fy__collection-item');
  let count = el.length;

  if (count > 10) {
    let toRemove = count - 10;
    let shuffled = el.sort(() => 0.5 - Math.random());
    shuffled.slice(0, toRemove).remove();
  }
}


$(document).on("ready", checkDimensions)
$(window).on("resize", checkDimensions)
checkDimensions()

function checkDimensions() {
    var eh = $(window).width() * 1920 / 1080
    var ah = $(window).height()

    if (eh > ah) {
        $("body").addClass("cb-horizontal-screen")
    }
    else {
        $("body").removeClass("cb-horizontal-screen")
    }
}


/* Initialize Swiper */

$(document).ready(function() {
    var target = getParam("v")
    
    if (target !== "") {
        slide = $(`.fy__collection-item[cb-slug=${target}]`)

        if (slide.length) {
            slide.parent().prepend(slide)
        }
    }

    if (getParam("back") === "true") {
        $("a[cb-navigation-back] .fy__topbar__link-text").text("Zurück")

        $(".fy__collection-item, a[cb-navigation-back]").click(function(e) {
            if ($(e.target).hasClass("fy__collection-item")) {
                history.back()
            }
        })
    }


    if (detectMob()) {
        trimToTen()
    }


    $(".fy__collection-item").each(function(index) {
        var el = $(this)
        el.attr("real-index", index)
    })




    fySwiper = new Swiper ('.fy__collection-container', {
        wrapperClass: 'fy__collection-wrapper',
        slideClass: 'fy__collection-item',
        slidesPerView: 'auto',
        direction: 'vertical',
        spaceBetween: 0,
        speed: 200,
        grabCursor: true,
        loop: false,
        loopAdditionalSlides: 0,
        threshold: 10,
        cssMode: true,
        mousewheel: true,
        grabCursor: true,
        keyboard: true,
        noSwipingClass: "fy__progress__bar",
        navigation: {
            nextEl: '[cb-swiper-controls=next]',
            prevEl: '[cb-swiper-controls=prev]',
        },
        on: {
            init: function () {
                updateGlobalIndex(0)
                updateVimeoSlide(false)
            },
            realIndexChange: function () {
                updateGlobalIndex(fySwiper.realIndex)
                updateVimeoSlide()
                updatePlayback()
            },
            touchMove: function () {
                $("body").addClass("dragging")
            },
            touchEnd: function () {
                $("body").removeClass("dragging")
            },
        },
    });
});


$(".fy__pause").click(function() {
    const realIndex = $(this).parents('.fy__collection-item').attr('real-index');
    const player = vimeoPlayers[realIndex];
    
    if (player) {
        player.getPaused().then(function(paused) {
            if (paused) {
                player.play();
            } else {
                player.pause();
            }
        });
    }
})



var dragPercent = false

$(".fy__progress__bar").bind("mousedown touchstart", function(e){
    var offset = $(this).offset().left;
    var width = $(this).width();

    var start = e.pageX - offset;

    var startPercent = 100 * start / width

    if (startPercent > 100) {startPercent = 100}
    else if (startPercent < 0) {startPercent = 0}

    dragPercent = startPercent

    $("body").addClass("time-dragging")

    $(`.fy__collection-item[real-index=${globalActiveIndex}] .fy__progress__bar`).attr("style", `--player-progress: ${dragPercent}%`)

    $(window).on("mousemove.validator touchmove.test",function(e){
        var current = e.pageX - offset;
        var currentPercent = 100 * current / width

        if (currentPercent > 100) {currentPercent = 100}
        else if (currentPercent < 0) {currentPercent = 0}

        dragPercent = currentPercent

        $(`.fy__collection-item[real-index=${globalActiveIndex}] .fy__progress__bar`).attr("style", `--player-progress: ${currentPercent}%`)

        
    });
})




$(window).on("mouseup touchend", function(){
    $(window).off("mousemove.validator touchmove.test");
    $("body").removeClass("time-dragging")


    if (vimeoPlayers[globalActiveIndex] && dragPercent !== false) {
        vimeoPlayers[globalActiveIndex].getDuration().then(function(duration) {
            var newTime = duration / 100 * dragPercent
            vimeoPlayers[globalActiveIndex].setCurrentTime(newTime)
            vimeoPlayers[globalActiveIndex].play()
            dragPercent = false
            $(`.fy__collection-item[real-index=${globalActiveIndex}] .fy__progress__bar`).attr("style", ``)
        });
    }
});








