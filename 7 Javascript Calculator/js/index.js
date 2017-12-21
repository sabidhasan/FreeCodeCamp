var Calculator = function() {
  //Holds order of operations
  var ops;
  //becomes true if there is an error
  var errorState = false;
  //calculator on?
  var calcOn = true;
  //This stores last two operations before equal pressed. (eg. "+34")
  //In case we press equals twice
  var lastOp = "";
  //Memory
  var memory = "";
  //Possible functions;
  var functions = ["*", "/", "+", "-"];
  //length of display
  var displayLimit = 9999999999;

  //Called when initailizing calcuator, resetting with AC
  function resetCalc() {
    ops = ["0"];
    errorState = false;
    lastOp = "";
    setDisplay(0);
  }
  
  //Draw number on display (num), and M (true/false)
  function setDisplay(num, memory) {
    if (memory === true) {
      $(".display-memory").removeClass("display-inactive");
    } else if (memory === false) {
      $(".display-memory").addClass("display-inactive");
    }
    
    if (parseFloat(num) < 0) {
     $("#display-minus").removeClass("display-inactive"); 
    } else {
     $("#display-minus").addClass("display-inactive");       
    }
    
    //if number too big for display, then make it into scintific notation.
    //Javascript automatically converts to Sci Not when num ? 1e21
    if (num > displayLimit) {
      num = num.toExponential();
    }
    //if number has "e" in it
    if (num.toString().indexOf("e") !== -1) {
      //Is it too small o6f a number?
      if (num.toString().split("e")[1].length > 3) {
        setDisplay("Err");
        errorState = true;
        return null;
      }
      
      $("#display-ten").removeClass("display-inactive");
      $("#display-power").removeClass("display-inactive");
      $("#display-power").text(num.toString().split("e")[1]);
    } else {
      $("#display-ten").addClass("display-inactive");
      $("#display-power").addClass("display-inactive");
      $("#display-power").text("00");
    }
    
    $(".display-numbers").text(num.toString().split("e")[0].replace("-", "").slice(0,10));
  }
  
  function doCalc() {
      //Check for error
      var evaluatedExpression = eval(ops.reduce(function(a, v) { return a + v;}));
      console.log(evaluatedExpression)
      if (isNaN(evaluatedExpression) === true) {
        errorState = true;
        setDisplay("Err");
        return null;
      }
      
      //See if there is a real calculation to be done. If not, then we might
      //have to repeat prev calc.
      if (ops.length < 3) {
        setDisplay(eval(evaluatedExpression + lastOp));
        ops = [eval(evaluatedExpression + lastOp).toString()];
        return eval(evaluatedExpression + lastOp);
      }
      
      //Do Calc, clear array, set previous calc
      setDisplay(evaluatedExpression);
      lastOp = ops[ops.length-2] + ops[ops.length-1];
      ops = [evaluatedExpression];
      return evaluatedExpression;
  }
  
  //Initialize calculator
  resetCalc();
  
  this.buttonPress = function(button) {
    //Check for error state and calcaltr on. Only OFF and AC should work
    if ((errorState === true || calcOn == false) && (button !== "OFF")) {
      if (button !== "AC") {
        return null;
      }
      resetCalc();        
    }
        
    if (/[0-9.]/.test(button)) {
      //Number from 0-9 or decimal point?
      //Check if operationw as pressed last
      if (functions.indexOf(ops[ops.length-1]) !== -1) {
        ops.push("0");
      }
      //see if decimal already present
      if (button === "." && ops[ops.length-1].indexOf(".") !== -1) {
        return null;
      }
      this.appendNum(button); 
      
      
    } else if (functions.indexOf(button) !== -1) {
      //basic functions - +-*/?
      //Check if we already have a button, if so update
      if (functions.indexOf(ops[ops.length-1]) !== -1) {
        ops[ops.length-1] = button.toString();  
      } else {
        setDisplay(0);
        ops.push(button.toString());
      }
      
      
    } else if (button === "+/-") {
      //Is it plus minus?
      //Test to see if its numeric, if not then we do nothing
      if (/[0-9]+/.test(ops[ops.length-1])) {
          ops[ops.length-1] = parseFloat(ops[ops.length-1] * -1).toString();
          setDisplay(ops[ops.length-1])
      }
      
      
    } else if(button === "OFF") {
      //Calc turned off
      resetCalc();
      memory = "";
      $("#display-memory").addClass("display-inactive");

      calcOn = false;
      $("#display-minus").addClass("off");
      $("#display-memory").addClass("off");
      $(".display-eights").addClass("off");
      $(".display-numbers").addClass("off");
      
      
    } else if(button === "AC") {
      //If AC then reset calc
      calcOn = true;
      resetCalc();
      //Show LCD
      $("#display-minus").removeClass("off");
      $("#display-memory").removeClass("off");
      $(".display-eights").removeClass("off");
      $(".display-numbers").removeClass("off");
      
      
    } else if (button === "C") {
      //C - if final is number, replace with 0, show 0, 
      if (/[0-9]+/.test(ops[ops.length-1])) {
          //Replace with 0
          ops[ops.length-1] = "0";
          setDisplay(ops[ops.length-1]);
      }
      
      
    } else if (button === "√") {
      //if final is number, then root it and display it, otherwise 
      if (/[0-9]+/.test(ops[ops.length-1])) {
          //Replace with 0
          //Test for error
          if (isNaN(Math.sqrt(parseFloat(ops[ops.length-1]))) == true) {
            setDisplay("Err");
            errorState = true;
            return null;
          }
          ops[ops.length-1] = Math.sqrt(parseFloat(ops[ops.length-1])).toString();
          setDisplay(ops[ops.length-1]);
          //Because last operation after square root makes no sense
          lastOp = "";
      }
      
    
    } else if (button === "=") {
      //See if they entered an operator with no number:   ==>  '2 +'
      if (functions.indexOf(ops[ops.length-1]) !== -1) {
        //remove the useless operator
        ops.splice(-1, 1);
        console.log(ops);
      }
      //Time to compute
      doCalc();

    
    } else if (button === "M+") {
      //If just a number, then lets add it to memory. Otherwise, we need to
      //Do calculation
      if (ops.length === 1) {
        memory = ops[0];
        $("#display-memory").removeClass("display-inactive");
        return;
      }
      
      //Call equals and add result to memory
      var calculation = doCalc();
      //null is returned when the calc doesnt work.
      if (calculation !== null) {
        //Store result in memory
        memory = calculation;
        $("#display-memory").removeClass("display-inactive");
      }
      
      
    } else if (button === "M-") {
      memory = "";
      $("#display-memory").addClass("display-inactive");

    
    } else if (button === "MR") {
      //check if memory
      if (memory == "") return null;
      
      //if final element number, then replace it
      if (/[0-9]+/.test(ops[ops.length-1])) {
        ops[ops.length-1] = memory;
      } else {
        ops.push(memory);
      }
      setDisplay(memory);
    }
    console.log(ops)

    
  }
  
  
  //A number key press (0-9)
  this.appendNum = function(num) {
    //If too long, then ignore
    if (ops[ops.length - 1].toString().length === 10) {
      return null;
    }
    //Othewise, add on the number
    //If only one zero, then replace with number, else add number
//    ops[ops.length - 1] = ops[ops.length - 1] === "0" ? num.toString() : ops[ops.length - 1].toString() + num.toString();
    ops[ops.length - 1] = ops[ops.length - 1].toString().replace(/^[0]$/, "") + num.toString();
    setDisplay(ops[ops.length-1]);
  }
}

$(document).ready(function() {
  var calc = new Calculator();
  
  //key presses
  $("button").click(function() {
    calc.buttonPress($(this).text());
  });
  //keyboard keys
  //keydown  27  C
  $(document).on("keypress", function(e) {
    var map = {27: "C", 48: "0", 49: "1", 50: "2", 51: "3", 52: "4", 53: "5",
              54: "6", 55: "7", 56: "8", 57: "9", 46: ".", 45: "-", 43: "+",
              42: "*", 47: "/", 13: "="}
    if (map.hasOwnProperty(e.which)) {calc.buttonPress(map[e.which]); }
  });
  $(document).keydown(function(e) {
    if (e.which === 27) calc.buttonPress("C");
  });
});