var players = []



function workCMSUnload() {
  try {
    $.each(players, function(index, value) {
      this.destroy()
    })

    players = []
  } catch (error) {
    players = []
  }
}




/*----------------------------*/
/* NEXT UP LOADER             */
/*----------------------------*/



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

nextWork()





/*----------------------------*/
/* MAKE VIMEO AUTOPLAY        */
/*----------------------------*/


$('.barba__main:not(.barba-old) iframe[src*="vimeo.com"]').each(function(i) {
  var url = $(this).attr("src")
  $(this).attr("vid-index", i)

  $(this).attr({
    "src": "",
    "allow": "autoplay"
  })
  $(this).attr("src", url + "?background=1")

  let player = new Vimeo.Player($(this))
  players.push(player)
})



function changeVideo(comnd, el) {
  let vid = el.find('iframe[src*="vimeo.com"]').eq(0)
  let index = parseInt(vid.attr("vid-index"))
  var player = players[index]

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



$(".barba__main:not(.barba-old) .w-richtext-figure-type-video").click(function(e) {
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



$(".barba__main:not(.barba-old) .w-richtext-figure-type-video").each(function() {
  if (!$(this).find("iframe").attr("src").includes("youtube")) {
    $(this).find("iframe").after('<div class="work-video-overlay"><a class="vid-audio"><img src="https://assets.website-files.com/5ad5ed47829a45473b3d336f/60ddd136a230ba18c67a405a_ese-ui-audio-off.svg" loading="lazy" width="25" alt="" class="vid-audio-icon audio-off"><img src="https://assets.website-files.com/5ad5ed47829a45473b3d336f/60ddd137984f428114c72e77_ese-ui-audio-on.svg" loading="lazy" width="25" alt="" class="vid-audio-icon audio-on"></a><a class="vid-audio vid-replay"><img src="https://uploads-ssl.webflow.com/5ad5ed47829a45473b3d336f/61b0d5f9d303133d08c744ef_ese-replay.svg" rotations="0" style="transform: rotate(0deg)" loading="lazy" width="20" height="20" alt="" class="vid-audio-icon"></a></div>')
  }
  else {
    $(this).find("iframe").css("pointer-events", "auto")
  }
})



$(".barba__main:not(.barba-old) .w-richtext-align-floatleft").each(function() {
  var next = $(this).next()
  if (next.is("p") && next.next().hasClass("w-richtext-figure-type-image")) {
    next.remove()
  }
})




/*----------------------------*/
/* POINTER EVENTS YOUTUBE     */
/*----------------------------*/


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






