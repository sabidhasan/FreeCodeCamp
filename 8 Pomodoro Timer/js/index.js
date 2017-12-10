//Globals for durations, current timer, and setInterval object
var pomLength, breakLength, totTime, mainTimer;

//Start the app
$(document).ready(function() { init(); });

$(".setting-pom-length").on("click", function() {
  //calculte new value and see if its acceptable
  var newVal = parseInt(eval(pomLength + $(this).val() + 1));
  if (newVal < 1 || newVal > 60) { return null; }
  pomLength = newVal;
  //update the text in UI
  $(".pom-val").text(pomLength);
  $(".timer-text").text(humanizeTime(pomLength * 60 * 1000));
  $("#pom-val-input").val(pomLength);
});

$(".setting-break-length").on("click", function() {
  //calculate new value, and see if its acceptable
  var newVal = parseInt(eval(breakLength + $(this).val() + 1));
  if (newVal < 1 || newVal > 60) { return null; }
  breakLength = newVal;
  //update text in UI
  $(".break-val").text(breakLength);
  $("#break-val-input").val(breakLength);
});

function startStop() {
  if ($("#start").val() == "start") {
    //Start the pomodoro timer
    clock();
    //remove pause status blinking
    $(".timer-text").removeClass("blink");
    //hide settings pane
    $(".settings").addClass("hidden");
    //toggle start stop text
    $("#start").val("pause");
    $("#start").text("Pause");
  } else {
    //Pause the pomodoro timer
    clock(false);
    //add blinking to text
    $(".timer-text").addClass("blink");
    //update start stop text
    $("#start").val("start");
    $("#start").text("Start");    
  }
}

function humanizeTime(milliseconds) {
  //Returns humanized value in seconds/minutes
  var minutes = {length: Math.floor(milliseconds / 60000), text: " minutes "};
  var seconds = {length: Math.round((milliseconds - (minutes.length * 60000)) / 1000), text: " seconds"}
  if (minutes.length === 0) {
    return seconds.length + seconds.text + " remaining";
  }
  return minutes.length + minutes.text + seconds.length + seconds.text  + " remaining";
}

function clock(param) {
  if (param === false) {
    clearInterval(mainTimer);
    return;
  }

  mainTimer = window.setInterval(function() {
    //update the visual clock
    $(".timer-square").css("height", (totTime / ((pomLength + breakLength) * 60000) * 180) + 'px');
    
    //Reset to 0 if needed
    if (totTime == (pomLength + breakLength) * 60000 || totTime === 0) {
      //if reached end the play sound
      playAudio();
      //set color to pomodoro color, update status to "work"
      $(".timer-square").addClass("pomodoro");
      $(".timer-square").removeClass("break");
      $(".timer").addClass("pomodoro");
      $(".timer").removeClass("break");
      $(".pom-status").text("Work!");
      //reached the end, so lets reset tot time
      totTime = 0;      
    } else if (totTime == (pomLength * 60000)) {
      //Reached break play sound
      playAudio();
      
      $(".timer-square").addClass("break");
      $(".timer-square").removeClass("pomodoro");
      $(".timer").addClass("break");
      $(".timer").removeClass("pomodoro");
      $(".pom-status").text("Break!");
    }
    var timeLeft = totTime > (pomLength * 60000) ? ((pomLength + breakLength) * 60000) - totTime : (pomLength * 60000) - totTime;
    $(".timer-text").text(humanizeTime(timeLeft));
    totTime = totTime + 1000;
  }, 1000);
}

$(".break-length .break-val").on("click", function() {
  $("#break-val-input").toggle();
  $("#break-val-input").focus();
  $(this).toggle();
});

$(".pom-length .pom-val").on("click", function() {
  $("#pom-val-input").toggle();
  $("#pom-val-input").focus();
  $(this).toggle();
});

$("#break-val-input").keydown(function(event) {
  if (event.which == 13) {
    breakLength = parseInt(handleKeyInput($(this), breakLength));
    $(".break-val").text(breakLength);
    $(".break-length .break-val").trigger("click");
  }
});

$("#pom-val-input").keydown(function(event) {
  //if enter, then call handkeyinput and return
  if (event.which == 13) {
    pomLength = parseInt(handleKeyInput($(this), pomLength));
    $(".pom-val").text(pomLength);
    $(".timer-text").text(humanizeTime(pomLength * 60 * 1000));
    //Hide the textbox
    $(".pom-length .pom-val").trigger("click");
  }
});

function handleKeyInput(textbox, defaultVal) {
  //test for nonnumeric
  if (/[^0-9]/.test(textbox.val()) === true || parseInt(textbox.val()) < 1 || parseInt(textbox.val()) > 60 || textbox.val().length === 0) {
    return defaultVal;
  }
  return textbox.val();
}

function playAudio() {
  if (totTime !== 0 && $("#audio").prop("checked") === true) {
    $("#audiocontrol").get(0).play();
  }
}

//start the app
function init() {
  //stop existing timer
  clock(false);
  //reset break and pomodoro lengths
  pomLength = 25;
  breakLength = 5;
  //return existing timer to 0
  totTime = 0;
  //update settings text
  $(".pom-val").text(pomLength);
  $(".break-val").text(breakLength);
  //update status and time remaining
  $(".pom-status").text("Not yet started");
  $(".timer-text").text(humanizeTime(pomLength * 60 * 1000));
  //show settings again
  $(".settings").removeClass("hidden");
  //reset the circle
  $(".timer-square").css("height", "0px");
  $(".timer-square").addClass("pomodoro");
  $(".timer-square").removeClass("break");
  
  //set timer colors for pomodoro
  $(".timer").addClass("pomodoro");
  $(".timer").removeClass("break");
  //start button reset 
  $("#start").val("start");
  $("#start").text("Start");
  //Hide input boxes and update their values
  $("#pom-val-input").val(pomLength);
  $("#pom-val-input").hide();
  $(".pom-length .pom-val").show();
  
  $("#break-val-input").val(breakLength);
  $("#break-val-input").hide();
  $(".break-length .break-val").show();
  
  $(".timer-text").removeClass("blink");
  
  $("#audiocontrol").get(0).pause();
  $("#audiocontrol").get(0).currentTime = 0;
}