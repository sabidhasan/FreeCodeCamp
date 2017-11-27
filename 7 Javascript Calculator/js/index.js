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
  

  //Called when initailizing calcuator, resetting with AC
  function resetCalc() {
    ops = ["0"];
    errorState = false;
    lastOp = "";
    memory = "";
    setDisplay(0);
  }
  
  //Draw number on display (num), and M (true/false)
  function setDisplay(num, memory) {
    if (memory === true) {
      $(".display-memory").removeClass("display-inactive");
    } else if (memory === false) {
      $(".display-memory").addClass("display-inactive");
    }
    
    if (num < 0) {
     $("#display-minus").removeClass("display-inactive"); 
    } else {
     $("#display-minus").addClass("display-inactive");       
    }
    
    $(".display-numbers").text(num.toString().replace("-", "").slice(0,10));
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
        ops = [eval(evaluatedExpression + lastOp)];
        return null;
      }
      
      //Do Calc, clear array, set previous calc
      setDisplay(evaluatedExpression);
      lastOp = ops[ops.length-2] + ops[ops.length-1];
      ops = [evaluatedExpression];
      return evaluatedExpression
  }
  
  //Initialize calculator
  resetCalc();
  
  this.buttonPress = function(button) {
    //Check for error state and calcaltr on. Only OFF and AC should work
    if ((errorState === true || calcOn == false) && (button !== "OFF")) {
      if (button !== "AC") {
        return null;
      } else {
        resetCalc();        
      }
    }
        
    if (/[0-9.]/.test(button)) {
      //Number from 0-9 or decimal point?
      //Check if operationw as pressed last
      if (functions.indexOf(ops[ops.length-1]) !== -1) {
        ops.push("0");
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
          ops[ops.length-1] = parseFloat(ops[ops.length-1] * -1);
          setDisplay(ops[ops.length-1])
      }
      
      
    } else if(button === "OFF") {
      //Calc turned off
      resetCalc();
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
          ops[ops.length-1] = Math.sqrt(parseFloat(ops[ops.length-1]));
          setDisplay(ops[ops.length-1]);
          //Because last operation after square root makes no sense
          lastOp = "";
      }
      
    
    } else if (button === "=") {
      //Time to compute
      doCalc();

    
    } else if (button === "M+") {
      //Call equals and add result to memory
      var calculation = doCalc();
      if (calculation !== null) {
        //Store result in memory
        memory = calculation;
      }
      
      
    } else if (button === "M-") {
               
    } else if (button === "MR") {
      
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
    
    ops[ops.length - 1] = (ops[ops.length - 1].toString() + num.toString()).replace(/^[0]$/, "");
    setDisplay(ops[ops.length-1]);
  }
  
  
}

var s = new Calculator();
//console.log(s.buttonPress(2))

$(document).ready(function() {
  $("button").click(function() {
    s.buttonPress($(this).text());
  });
});