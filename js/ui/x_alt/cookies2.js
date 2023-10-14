function getCookie(e) {
    var c = e + "=";
    var d = document.cookie.split(";");
    for (var b = 0; b < d.length; b++) {
        var a = d[b];
        while (a.charAt(0) == " ") a = a.substring(1);
        if (a.indexOf(c) == 0) return a.substring(c.length, a.length);
    }
    return "";
}

function setCookieConsent(value) {
    const date = new Date();
    date.setTime(date.getTime() + 15724800000);  // 6 months in milliseconds
    document.cookie = `cookieConsent=${value}; expires=${date.toGMTString()}; path=/`;
}

function cookiesClose() {
 $(".cookies__section.active").removeClass("active");

}

if (getCookie("cookieConsent") === "") {
    $(".cookies__section").addClass("active");
}
else if (getCookie("cookieConsent") === "OPTIMAL") {
    dataLayer.push({'event': 'cookies-allowed'})
}


$(".cookies__copy span").click(() => {
    $(".cookies__slide1").hide();
    $(".cookies__slide2").show();
});

$(".cookies__slide2 #cookiesBack").click(() => {
    $(".cookies__slide2").hide();
    $(".cookies__slide1").show();
});

$(".cookies__checkbox-wrapper").click(function() {
    const checkbox = $(this).children(".cookies__checkbox");
    $(".cookies__checkbox").removeClass("checked");
    checkbox.addClass("checked");
});

$(".cookies__slide1 #cookiesAll").click(() => {
    cookiesClose();
    setCookieConsent("OPTIMAL");
    dataLayer.push({'event': 'cookies-allowed'})
});

$(".cookies__slide1 #cookiesSelection").click(() => {
    cookiesClose();
    if ($("#cookiesLimited").hasClass("checked")) {
        setCookieConsent("LIMITED");
    } else {
        setCookieConsent("OPTIMAL");
        dataLayer.push({'event': 'cookies-allowed'})
    }
});