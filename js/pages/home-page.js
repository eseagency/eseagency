/*----------------------------*/
/* HERO                       */
/*----------------------------*/


$(document).ready(function() {
    var path = "https://eseassets.ch/ese-media/assets/hero-sequence/v2/webp/ese-hero-sequence[XX].webp"

    if (!canUseWebp()) {
        path = "https://eseassets.ch/ese-media/assets/hero-sequence/v2/jpg/ese-hero-sequence[XX].jpg"
    }

    scrollScrub1 = new imgScrollScrub({
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
        progress: function(val) {
            var percent = val / 3
            //$(".hh2-heading__h1-wrapper").css("transform", `translateX(-${percent}%)`)
        },
        loadPercent: function(val) {
            if (val === 100) {
                scrollScrub1.play(30)
                $(".hh2-heading__h1-dummy").addClass("cb-ts__active")

                setTimeout(function() {
                    $(".hh2-heading__h3-wrapper").addClass("cb-ts__active")
                }, 1000)
            }
        },
        reverse: true,
        loadFirstFrame: false,
    })   

    $(window).focusin(function() {
        scrollScrub1.preload()
    });
    $(window).focus(function() {
        scrollScrub1.preload()
    });
})








/*----------------------------*/
/* HERO MOBILE HEIGHT FIX     */
/*----------------------------


$(document).ready(function() {
    if (globalViewportWidth < 767) {
        var screenHeight = window.innerHeight + "px"
        $(".homehero__section, .homehero__copy-wrapper").css("height", screenHeight)
    }
});



/*----------------------------*/
/* WORK OPEN ANIMATION        */
/*----------------------------*/

$(function(){
    $(".work-list__link").click(function(e){
        if (e.ctrlKey || e.shiftKey || e.metaKey || e.which == 2) {return}

        e.preventDefault();

        var el =  $(this)
        var link = el.attr("href");

        $(".work-list__link").css("opacity", "0")
        $(".blog-list__hover").css("opacity", "0")
        el.css("opacity", "1")
        el.addClass("opened")
        $(".cursor").css("opacity", "0")


        $.ajax({
            url: link,
            success: function() {
              console.log("prefetch")
            }
        });



        setTimeout(function() {
            el.css("opacity", "0")
        }, 900)

        
        setTimeout(function() {
            window.location.href = link;
        }, 1200);


        setTimeout(function() {
            el.css("opacity", "1")
        }, 3000);

        setTimeout(function() {
            $(".work-list__link").css("opacity", "1")
            $(".blog-list__hover").css("opacity", "1")
            el.removeClass("opened")
            $(".cursor").css("opacity", "1")
        }, 3900);
    });
});






/*----------------------------*/
/* HOME TEAM VIDEO            */
/*----------------------------*/


var teamVideo = new Vimeo.Player($(".teamvid__section iframe"))

$(document).ready(function() {
    var first = false

    if (globalViewportWidth < 768) {
        teamVideo.loadVideo(705342070).then(function(id) {
            $(".teamvid__section[cb-vidcover-target]").attr("cb-vidcover-target", "1500 1920")
            checkDimensions()
            teamVideo.play()
        })
    }
    else {
        teamVideo.play()
    }

    

    $(".teamvid__cursor-container").click(function() {
        if (!first) {
            first = true
            $(".teamvid__cursor-container").addClass("tvid__hidden")
            $(".teamvid__section .tvid__audio-toggle").removeClass("tvid__hidden")
            $(".teamvid__section .tvid__audio-toggle").addClass("audio-on")

            for(var i=0;i<players.length;i++){players[i].setVolume(0)}
                
            $(".tvid__section .tvid__audio-toggle").removeClass("audio-on")

            teamVideo.pause()
            teamVideo.setCurrentTime(0)
            teamVideo.setVolume(1)
            teamVideo.play()
        }
        else {
            quoteAudioToggle()
        }
    })

    $(".teamvid__section .tvid__audio-toggle").click(function() {
        quoteAudioToggle()
    })

    function quoteAudioToggle() {
        teamVideo.getMuted().then(function(muted) {
          if (muted === true) {
              for(var i=0;i<players.length;i++){players[i].setVolume(0)}
              $(".tvid__section .tvid__audio-toggle").removeClass("audio-on")

              teamVideo.setVolume(1)
              $(".teamvid__section .tvid__audio-toggle").addClass("audio-on")
            }
            else {
              teamVideo.setVolume(0)
              $(".teamvid__section .tvid__audio-toggle").removeClass("audio-on")
            }
        }).catch(function(error) {
            return
        });
    }
})




/*----------------------------*/
/* HOME QUOTE VIDEOS          */
/*----------------------------*/


// static Variables

var players = []
var videoHeadings = []
var progressBars = []
var firstClick = false
var activePlayer = 0


// create all players

$(".tvid__video__item").each(function() {
    var el = $(this)
    let vid = el.find("iframe")
    let player = new Vimeo.Player(vid)

    player.setCurrentTime(0)
    players.push(player)
    player.setLoop(false)

    player.on('ended', function() {
        gotoNextQuote()
        console.log("finished")
    });

    player.on('play', function(data) {
    });
})


// create all progressbars

$(".tvid__nav__item").each(function(i) {
    var id = "progressBar" + i;
    $(this).find(".tvid__nav__progress").attr("id", id)

    var progressBar = new ProgressBar.Circle("#" + id, {
      strokeWidth: 2,
      color: '#ffffff',
      svgStyle: null,
      trailColor: 'rgba(255, 255, 255, 0.2)',
      trailWidth: 2,
    });

    progressBars.push(progressBar)  
})


// create all heading animations

$(".tvid__heading").each(function(i) {
    var index = i;
    var el = $(this);

    var heading1 = new textReveal({
        target: ".tvid__main-heading:eq(" + index + ")",
        repeat: false,
        intervalSpeed: 30,
        offsetShow: 100,
        transitionSpeed: 1.5,
        autoTrigger: false,
        finished: function() {
            transitionBlocker = false
            setTimeout(function() {
                el.find(".tvid__text").removeClass("hidden")
            },300)
            setTimeout(function() {
                el.find(".tvid__text-function").removeClass("hidden")
            },400)
        },
    })  
    videoHeadings.push(heading1)  
})


// goto specific quote

function setQuote(i) {
    var index = i;
    activePlayer = i;

    if (transitionBlocker) {return}


    // hide old

    $(".tvid__video__item").addClass("hidden")
    $(".tvid__nav__item").removeClass("tvid__nav__active")


    // show new

    setTimeout(function() {
        $(".tvid__video__item").eq(index).removeClass("hidden")
        $(".tvid__nav__item").eq(index).addClass("tvid__nav__active")

        for(var i=0;i<players.length;i++){ 
            if (i !== index) {
                players[i].pause()
                players[i].setCurrentTime(0)
                videoHeadings[i].animateOut()
                transitionBlocker = true
                progressBars[i].set(0.0)
            }
            else {
                players[index].play().then(function() {
                    videoHeadings[index].animateIn()
                    players[index].getDuration().then(function(duration) {
                        var time = duration * 1000
                        progressBars[index].animate(1.0, {
                            duration: time,
                        })
                    })
                    $(".tvid__text, .tvid__text-function").addClass("hidden")
                }).catch(function(error) {
                    videoHeadings[index].animateIn()
                })

            }
        }
    }, 400)    
}


// go to next quote

function gotoNextQuote() {
    activePlayer++
    if (activePlayer >= players.length) {
        activePlayer = 0
    }
    setQuote(activePlayer)
}





// audio control

$(".tvid__section .tvid__audio-toggle").click(function() {
    quoteAudioToggle()
})

function quoteAudioToggle() {
    players[0].getMuted().then(function(muted) {
      if (muted === true) {
          teamVideo.setVolume(0)
          $(".teamvid__section .tvid__audio-toggle").removeClass("audio-on")
          for(var i=0;i<players.length;i++){
            players[i].setVolume(1)
        }
          $(".tvid__section .tvid__audio-toggle").addClass("audio-on")
        }
        else {
          for(var i=0;i<players.length;i++){
            players[i].setVolume(0)
        }
          $(".tvid__section .tvid__audio-toggle").removeClass("audio-on")
        }
    }).catch(function(error) {
        return
    });
}

$(".tvid__section").click(function(e) {
    if (!firstClick) {
        firstClick = true
        $(".tvid__cursor-container").addClass("tvid__hidden")
        $(".tvid__audio-toggle").addClass("audio-on")
        $(".tvid__audio-toggle").removeClass("tvid__hidden")
        teamVideo.setVolume(0)
        $(".teamvid__section .tvid__audio-toggle").removeClass("audio-on")
        for(var i=0;i<players.length;i++){
            players[i].setVolume(1)
            
        }
    }
})


// make quotelist clickable

$(".tvid__nav__item").click(function() {
    setQuote($(this).index())
})


// setup

var firstPlay = true
var transitionBlocker = false

$(window).scroll(function() {
    var pos = $(".tvid__section").offset().top - $(window).scrollTop() - $(window).innerHeight()

    if (pos < 500 && firstPlay) {
        setQuote(0)
        firstPlay = false
    } 
})

$(document).ready(function() {
    locomotiveScrollElement.on('scroll', (args) => {
        var pos = $(".tvid__section").offset().top - $(window).innerHeight()

        if (pos < 500 && firstPlay) {
            setQuote(0)
            firstPlay = false
        } 
    });  

    $(".tvid__video__item").addClass("hidden")
    $(".tvid__video__item").eq(0).removeClass("hidden")

    $(".tvid__nav__item").eq(0).addClass("tvid__nav__active")

    $(".tvid__video__item").each(function(i) {
        var index = i;

        players[index].play().then(function() {
            players[index].pause()
            players[index].setCurrentTime(0)
        })
    })  
})






