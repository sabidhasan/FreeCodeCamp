var app;

var Simon = function() {
  /////////////////////////
  //Constants and Options//
  /////////////////////////
  this.settings = {strict: false, power: false, shortDuration: 250, longDuration: 450};
  //what is the secret pattern;
  var secretPattern = [];
  //which index of pattern are we trying to guess
  var matchGuessIndex = 0;
  //True when currently playing a pattern
  var running = false;
  //The four colors
  this.colors = {
    0: {name: "yellow", domId: ".yellow", index: 0, path: 'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'},
    1: {name: "green", domId: ".green", index: 1, path: 'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'},
    2: {name: "red", domId: ".red", index: 2, path: 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'},
    3: {name: "blue", domId: ".blue", index: 3, path: 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'},
  }
  //To lookup in colors table in reverse fashion
  this.reverseColorTable = {
    yellow: 0,
    green: 1,
    red: 2,
    blue: 3
  }
  
  ////////////
  //Settings//
  ////////////
  this.togglePower = function(powerState) {
    //expects Boolean
    this.settings.power = powerState;
    if (powerState === false) {
      resetGame();
      //Turn the display off
      $(".settings-count-actual").addClass("off");
    } else {
      $(".settings-count-actual").removeClass("off");
    }
  }
  
  this.toggleStrictMode = function() {
    //If off then do nothing
    if (!this.settings.power) return;
    
    //Update the settings object and LED
    this.settings.strict = !this.settings.strict;
    $(".strict-led").toggleClass("inactive");
  }
  
  //////////////////
  //Start Function//
  //////////////////
  this.startGame = async function() {
    //if no power or already running then do nothing
    if (!this.settings.power || running) return;
    //Reset the game to start fresh
    resetGame();
    
    //Pick random color and add to array; play the pattern
    addNewColorToSecret();
    await playPattern(secretPattern, this.settings.longDuration);
    
    //update the count
    updateCount(secretPattern.length);
  }
  
  ///////////////
  //Color Click//
  ///////////////
  //To handle a color click for the buttons
  this.colorClick = async function(colorName) {
    //check for power or currently playing pattern, or no pattern (start not pressed)
    if (!this.settings.power || running || !secretPattern.length) return;
    //get the color ID from color name, and play clicked color
    const pressedColorId = this.reverseColorTable[colorName];
    await playPattern([this.colors[pressedColorId]], this.settings.shortDuration)
    
    //check whether guess matches proper index. If so, add new secret and check for win
    if (secretPattern[matchGuessIndex].index === pressedColorId) {
      //if at the end of trail then reset guessIndex, add new color
      if (matchGuessIndex === (secretPattern.length - 1)) {
        matchGuessIndex = 0;
        addNewColorToSecret();
        //wait a bit before playing the pattern
        setTimeout(() => {
          playPattern(secretPattern, this.settings.longDuration)
        }, this.settings.longDuration * 2);
        
        updateCount(secretPattern.length);
      } else {
        matchGuessIndex++;
      }      
    } else {
      //guess is wrong, play wrong sound
      playWrong();
      
      //Check for strict mode
      if (this.settings.strict) {
        running = false;
        this.startGame();
      } else {
        //replay
        matchGuessIndex = 0;
        setTimeout(() => {
          playPattern(secretPattern, this.settings.longDuration)
        }, this.settings.longDuration);
      }     
    }
  } 
  
  /////////////////////
  //General Functions//
  /////////////////////
  var playWrong = function() {
    playPattern([this.colors[0], this.colors[1], this.colors[2], this.colors[3]], 30);
    let wrongSound = new Audio()
  }
  
  var pickColor = function() {
    //Function to pick a random color from the four choices
    const index = Math.floor(Math.random() * 4);
    return this.colors[index];
  }
  
  var addNewColorToSecret = function() { 
    let randomColor = pickColor();
    secretPattern.push(randomColor);
  }
  
  function resetGame() {
    //Retain strict, everything else gets reset
    if (this.settings.strict) {
      $(".strict-led").removeClass("inactive");  
    } else {
      $(".strict-led").addClass("inactive");
    }
    
    //Reset pattern and guess
    secretPattern = [];
    matchGuessIndex = 0;
    updateCount(secretPattern.length);
    //Reset settings
    this.settings = {strict: this.settings.strict, power: this.settings.power, shortDuration: 250, longDuration: 450};
  }
  
  function updateCount(count) {
    //Set the count to whatever it's given
    $(".settings-count-actual").text(count);
  }
  
  async function playPattern(pattern, duration) {
    console.log(secretPattern)
    // recieves a array of color objects, which each need to be played
    // running variable gets updated when the promises get resolved.
    // until then we block further input
     running = true;
     for (let item in pattern) {
       await Promise.all([playSound(pattern[item], duration), lightBoard(pattern[item], duration)])
     }
    running = false;
  }  

  function playSound(obj, time) {

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        var audioObj = new Audio(obj.path)
        audioObj.play();
        resolve();
      }, time)
    })
  }

  function lightBoard(obj, time) {
    //lights up the passed object for 500 ms by reducing its opacity
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        $(obj.domId).css("opacity", "0.35");
        setTimeout(() => {
          $(obj.domId).css("opacity", "1");
          resolve();
        }, time)        
      }, time/2)
    })
  }
   //Binding non-scoped (hidden) functions so they get object scope
  pickColor = pickColor.bind(this);
  playWrong = playWrong.bind(this);
  resetGame = resetGame.bind(this);
  
}

$(document).ready(() => {
  //create new App
  app = new Simon();
  
  //Bind click handlers for on-off
  $("#settings-power").on("click", () => {
    app.togglePower(document.getElementById("settings-power").checked)
  })
  //Bind click handler for start button
  $("#start-button").on("click", () => {
    app.startGame();
  })
  //Bind click handlers for strict mode switch
  $("#strict-button").on("click", () => {
    app.toggleStrictMode();
  });
  $(".circle").on("click", function() {
    //light board and play sound
    const color = $(this).attr("class").split(" ")[1];
    app.colorClick(color);
  })
});




//upon click of color
    //if so, and we are NOT at the end (i.e. match_guess_index != secret.length)
    //then wait - this "upon click of color" will be called again.
    //if we are at the end then 
        //if legnth is 20, then call win function to end game
        //otherwise, call add random again to generate new clor

//FUNCTIONS this.
    //addSecretGuess - adds secret to secret_pattern
    //OBJECT playColor(callback) - plays color sound and lights it up
        //var tmp = new playColor
        //tmp.color('yellow')
        //tmp.play(function() {console.log('I am done now!')})

        // playColor = function() {
        //  colorMap = {'yellow': [{path: '123.mp3', length: 300}, '#yellow'] ... }
        //  this.color = function(specificcolor) {
        //    this.selectedcolor = specificcolor;
        //    this.element = document.getelemenytbyid(colorMap.color[1])
        //    this.soundPath = colormap.color[0].path
        //    this.soundLength = colormap.color[0].length
        //  }
        //  this.play(callback) {
        //    if (!this.selectedcolor) log error and return null;
        //    plauSound(path)     //play the sound
        //    add color to highlight divs
        //    settimeout(function(cleanup) {
        //        stop sound
        //        stop highlighting color
        //    }, this.soundLength)      //wait 300 ms so sound gets finished, then clean up
        //    callback          //call the callback function. shoulod execute when playsound is finished
        //  }
        //  playSound(path) {//play sound somehow}
        // 
        // }

    //playSecret(secret_array) - call playColor on each item in array
    //updateVisualCounter(secretArray) - update the visual counter to secretarray length
    //clickOnColor(colorId) - if playColor then nothing, else playColor