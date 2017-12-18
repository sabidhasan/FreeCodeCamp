//--------------------//
//--GLOBAL VARIABLES--//
//--------------------//
//define the players symbols
var players = {computer: "O", player: "X"};
//current state of the board
var b = new Array(9).fill(0);
//difficulty 0 always plays randomly. 1 blocks and goes for wins, but otherwuse randomly. anything else always tries to win.
var settings = {difficulty: 2, compFirst: true, gameOn: false};

//--------------------//
//---EVENT HANDLERS---//
//--------------------//
//Wait for DOM to load before setting eventHandlers
window.onLoad = afterLoad();

function afterLoad() {
  //add event listeners for player moves
  var elems = document.getElementsByClassName("square");
  for (var elemen in elems) {
    elems[elemen].addEventListener("click", function(e) {
      game(this.id);
    });
  }
}

function startingLabel() {
  var x = document.getElementById("starting-player-label");
  if (document.getElementById("starting-player").checked) {
    x.textContent = "Human will go first";
    settings.compFirst = false;
  } else {
    x.textContent = "Computer will go first";
    settings.compFirst = true;
  }
}

//----------------------------//
//--START BUTTON in settings--//
//----------------------------//
function startGame() {
  //reset all variables and board state
  resetGame();
  settings.gameOn = true;
  //hide the settings
  document.getElementById("settings").style.visibility = "hidden";
  
  //Update the symbols in players object and in DOM  
  var e = ["computer", "player"];
  e.forEach(function(val) {
    //update player symbols in memory
    players[val] = document.getElementById(val + "-symbol").value;
    //make array from classname and update text to new symbol
    var tmpArr = Array.from(document.getElementsByClassName(val));
    tmpArr.forEach(function(vall) {
      vall.textContent = players[val];
    });
  });
   
  settings.difficulty = parseInt(document.getElementById("difficulty").value);    
  //call start depending on who starts
  if (settings.compFirst === true) game();
}

//------------------//
//--RESET the game--//
//------------------//
function resetGame() {
  //reset the board, update the message
  b = new Array(9).fill(0); 
  document.getElementById("message").textContent = "Hello, human!";
  
  //hide all pieces
  for (var i = 0; i < 9; i++) {
    var classes = [".player", ".computer"];
    var el = document.getElementById(i.toString());
    classes.forEach(function(val) {
      el.querySelectorAll(val)[0].style.display = "none";
    });
  }
}

//----------------//
//--JUST FOR FUN--//
//----------------//
function generateInsult() {
  var subjects = [
    {pronoun: 'You', type: "singular"},
    {pronoun: 'Your mother', type: "plural"},
    {pronoun: 'Your father', type: "plural"},
    {pronoun: 'Your face', type: "plural"},
    {pronoun: 'Your nose', type: "plural"},
    {pronoun: 'Your feet', type: "plural"},
  ];
  
  var verbs = [
    {singular: 'smell like', plural: 'smells like'},
    {singular: 'are', plural: 'is'},
    {singular: 'associate with', plural: 'associates with'},
    {singular: 'play like', plural: 'plays like'}
    ];
  var objects = ['a hamster', 'hamsters', 'a fuzzy bunny', 'fuzzy bunnies', 'an elderberry', 'elderberries', 'a beehive', 'beehives', 'a pencil', 'pencils', 'hot sauce', 'a keychain'];
  
  var subj = subjects[rand(subjects.length)];
  return [subj.pronoun, verbs[rand(verbs.length)][subj.type], objects[rand(objects.length)]].join(" ");
  
  function rand(length) {
    return Math.floor(Math.random() * length);
  }
}

//----------------//
//--JUST FOR FUN--//
//----------------//
function game(playerLocation) {
  var message = document.getElementById("message");
  //is game on?
  if (!settings.gameOn) { 
    message.textContent = "Click Start below to play";
    return null;
  }
  
  if (playerLocation && settings.gameOn) {
    //check for valid location
    if (b[playerLocation] !== 0) {
      message.textContent = "Invalid move - that position is already occupied. No cheating!";
      return null;
    }
    
    //update graphical board
    var elem = document.getElementById(playerLocation).querySelectorAll(".player")[0];
    elem.style.display = "block";
    // elem.style.visibility = "visible";
    //update the board variable
    b[playerLocation] = players.player;
  }
  //check to see win loss tie
  var status = win(b);
  var gameOver = updateBoardBasedOnWinStatus(status);
  if (gameOver) return;

  //call picknextmove
  var compPlay = pickNextMove(b);
  //update message
  message.textContent = generateInsult();  
  //update b variable
  b[compPlay] = players.computer;
  //update graphical board
  var elem2 = document.getElementById(compPlay).querySelectorAll(".computer")[0];
  elem2.style.display = "block";
  
  //check to see win loss tie
  status = win(b);
  gameOver = updateBoardBasedOnWinStatus(status);
}

function updateBoardBasedOnWinStatus(status) {
  if (status == 100) {
    document.getElementById("settings").style.visibility = "visible";
    message.textContent = "I win";
    settings.gameOn = false;
    //true meaning game is over
    return true;
  } else if (status == -100) {
    message.textContent = "You win - I thought this never happens";
    document.getElementById("settings").style.visibility = "visible";
    settings.gameOn = false;
    //true meaning game is over
    return true;
  } else if (status === null && b.every(function(val) {return val !== 0;})) {
    message.textContent = "We tie"; 
    document.getElementById("settings").style.visibility = "visible";
    settings.gameOn = false;
    return true;
  }
  return false;
}


function win(board) {
  var wins = ['012', '345', '678', '036', '147', '258', '048', '246'];
  for (var winCond in wins) {
    var res = wins[winCond].split('').map(function(val) {
      return board[parseInt(val)];
    }).join("");
    if (res === players.computer.repeat(3)) {
      return 100;
    } else if (res === players.player.repeat(3)) {
      return -100;
    }
  }
  //either tie or no one wins
  return null;
}

function pickNextMove(board) {
  //give me a board, i'll  tell you where computer should play next
  //if difficulty easy, then return random position - no thinking
  if (settings.difficulty === 0) {
    console.log("Randomizing, difficulty easy");
    return randomValidMove();
  } 

  
  //Check for empty boardm and pick from + position
  if (board.every(function(val) {return val === 0;})) {
    return [1, 3, 4, 5, 7][Math.floor(Math.random() * 5)];
  }
  
  //else call fillboard to fill up tots
  var tots = {wins: [], loss: [], ties: []};
  fillBoard(board, false, []);
  //find one move wins
  var oneMoveWins = tots.wins.filter(function(val) {return val.moves.length === 1;});
  if (oneMoveWins.length > 0) {
    console.log("I should play in pos (I am O) \n" + oneMoveWins[0].moves[0]);
    return oneMoveWins[0].moves[0];
  }
  
  //looking for one move losses
  var oneMoveLosses = tots.loss.filter(function(val) {return val.moves.length === 1;});
  if (oneMoveLosses.length > 0) {
    //do a diff on the board, looking for where X went
    var blockPos = findWhereToBlock(board, oneMoveLosses[0].board, players.player);
    console.log("I think I should block in position " + blockPos);
    return blockPos;
  }  
  
  //if difficulty medium, then randomize think more
  if (Math.random() > 0.5 && settings.difficulty === 1) {
    console.log("Difficulty medium but I want to do random move");
    return randomValidMove();
  } else if (settings.difficulty === 1) {
    console.log("Difficulty medium but I want to play hard");
  }

  //Find most logical move
  //We have a list of all possible games. From each game, look at the first move (i.e.
  //the next move to make) from moves array
  //This move leads ultimately either to win, loss or tie. Score wins as +1 loss as -1 tie as +0.5

  //firstMoveScores stores the scores for each move (index number denotes board position)
  var firstMoveScores = new Array(9).fill(0);
  var moveScores = {"wins": 1, "loss": -1, "ties": 0.5};
  //Look through wins
  for (var item in tots) {
    tots[item].forEach(function(val) {
      //update firstMoveScores
      firstMoveScores[val.moves[0]] += moveScores[item];
    });
  }
  //filter places you cant go, because they are already full
  //we use map, because array indices are importat - they represent the board positions;
  firstMoveScores = firstMoveScores.map(function(val, index) {
    //if space is occupied, make it undefined
    return board[index] !== 0 ? undefined : val;
  });
  //find highest scoring index in array - that is where we need to go!
  var plausibleMoveIndex = 0;
  var maxVal = firstMoveScores[plausibleMoveIndex];
  for (var i = 0; i < firstMoveScores.length; i++) {
    if (firstMoveScores[i] > maxVal || maxVal === undefined ) {
       plausibleMoveIndex = i;
       maxVal = firstMoveScores[i];
    }
  }
  console.log("i should play in position " + plausibleMoveIndex + ' to maximize chances of winning');
  return plausibleMoveIndex;
  
  
  function findWhereToBlock(currBoard, hypotheticalBoard, player) {
    //this function takes a current board, and hypothetical board
    //and tells you where tje first difference is
    for (var i = 0; i < currBoard.length; i++) {
      //if object board == "X" and real boar !== X then returbn
      if (hypotheticalBoard[i] === player && currBoard[i] !== player) return i;
    }
  }
  
  function fillBoard(board, todo, moves) {
    //If todo == true then human player goes first, else computer goes first
    var victory = win(board);
    if (victory === 100) {
      //X won
      tots.wins.push({board: board, moves: moves});
      return board;
    } else if (victory === -100) {
      //O won
      tots.loss.push({board: board, moves: moves});
      return board;
    } else if (victory === null && board.every(function(val) {return val !== 0;})) {
      //board is full and no one won
      tots.ties.push({board: board, moves: moves});
      return board;
    }

    var move = {true: players.player, false: players.computer};

    //otherwise, we loop through, fill one position
    for (var i = 0; i < board.length; i++) {
      var tmp = board.slice();
      //if its 0 then make it 1, and re call the function
      if (tmp[i] === 0) {
        tmp[i] = move[todo];
        if (todo === true) {
          fillBoard(tmp, !todo, moves);
        } else {
          //computers turn so record the move and call fillboard again
          fillBoard(tmp, !todo, moves.concat([i]));
        }
      }    
    }
  }
  
  function randomValidMove() {
    var randomPos = Math.floor(Math.random() * 9);
    while (board[randomPos] !== 0) {
      randomPos = Math.floor(Math.random() * 9);
    }
    return randomPos;
  }
}