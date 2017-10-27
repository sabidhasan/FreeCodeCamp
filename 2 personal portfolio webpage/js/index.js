var active = 0;
var navs = [];

$(document).ready(function() {
  $(".nav-link").map(function() { navs.push($(this).attr("data-target"));});
  
  $(".nav-link").on("click", function() {
    showContent($(this).attr("data-target"));
  });
});

function showContent(currId) {
    $(".content-box").addClass("hidden");
    $("#"+currId).removeClass("hidden");
    $("#"+currId).addClass("slideInRight");
    active = navs.indexOf(currId)
}

$(window).bind('DOMMouseScroll mousewheel', function(e) {
  active = e.originalEvent.wheelDelta /120 > 0 ? (active - 1) % navs.length : (active + 1) % navs.length;
  if (active < 0) { active = navs.length -1 ; }
  showContent(navs[active])
});