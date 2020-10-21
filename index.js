// Operator tabs

const startingOperator = add; // add, subtract, multiply, divide
var operator = startingOperator;

// set operator with tabs here
function chooseOperator (event, operation) {
  operator = operation;
  // Show the current tab, and add an "active" class to the button that opened the tab
  var tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  event.currentTarget.className += " active";
  again();
}

// Exercise

var randomNumber1 = Math.floor( Math.random()*10);
var randomNumber2 = Math.floor( Math.random()*10);

function exercise(num1, num2, operator) {
  return operator(num1, num2); // operator functions at the bottom
}

function createExercise(num1, num2, operator) {
  var calculate = exercise(num1, num2, operator);
  if (operator == subtract) {
    calculate = exercise(num1 + num2, num2, operator);
  } else if (operator == divide) {
    if (num2 !== 9) {
      num2 ++;
    }
    calculate = exercise(num1 * num2, num2, operator);
  }
  return calculate;
}

// to generate first exercise
clearAll();
createExercise(randomNumber1, randomNumber2, operator);
// right answer: createExercise(randomNumber1, randomNumber2, operator).toString(10);


// Button actions to click in answer

function addNumber(event) { // Button numbers
  document.querySelector("#exercise-outcome").innerHTML = clickInAnswer( event.currentTarget.textContent );
}

function clickInAnswer (number) {
  document.querySelector("#exercise-outcome").classList.add("blackText");
  var currentAnswer = document.querySelector("#exercise-outcome").innerHTML;
  if (currentAnswer == 0) {
    currentAnswer = number;
  } else if (currentAnswer.length === 1) {
    currentAnswer += number;
  } // 2 digits top
  return currentAnswer;
}

function clearAll () { // Button AC
  document.getElementById("exercise-outcome").classList.remove("blackText");
  document.getElementById("exercise-outcome").classList.remove("rightAnswerClass");
  document.getElementById("exercise-outcome").classList.remove("tryAgainClass");
  document.getElementById("exercise-outcome").classList.remove("wrongAnswerClass");
  document.getElementById("exercise-outcome").classList.add("clearClass");
  document.getElementById("exercise-outcome").innerHTML = 0;
  return "0";
}

function deleteLastDigit () { // Button backSpace
  var currentAnswer = document.querySelector("#exercise-outcome").innerHTML;
  currentAnswer = backSpace( currentAnswer );
  document.querySelector("#exercise-outcome").innerHTML = currentAnswer;
  return currentAnswer;
}

function backSpace(answer) {
  if (answer === "0" || answer.length === 1) {
    return clearAll();
  } else {
    return answer.slice(0, -1);
  }
}

// Key actions to type in answer

function keyBoardUse (event) {
  var keyPress = event.keyCode;
  if (enabled) {
    if (keyPress == 13) { // ENTER to check answer
      event.preventDefault();
      checkAnswer();
    }
    document.querySelector("#exercise-outcome").innerHTML = typeInAnswer(keyPress);
  } else {
    // keys don't work except ENTER during timer off.
    if (keyPress == 13 && timerOff) { // so next exercise when hitting ENTER again
      again();
    }
  }
}

var enabled = true;
document.onkeydown = keyBoardUse;

function typeInAnswer (unicode) {
  if (unicode == 8) {
    return deleteLastDigit();
  } else if (unicode == 27) {
    return clearAll();
  } else if (unicode >= 48 && unicode <= 57){ // numbers
    return clickInAnswer (unicode-48);
  } else if (unicode >= 96 && unicode <= 105) { // numpad numbers
    clickInAnswer(unicode - 96);
  } else {
    return document.querySelector("#exercise-outcome").innerHTML;
  }
}


// Check answer, keep total score, and go to next exercise

var score = 0;
var timerScore = 0;

var tries = 0;
const maxTries = 2;
function checkAnswer() {
  tries++;
  if (tries > maxTries) {
    again();
    return;
  }
  var givenAnswer = document.querySelector("#exercise-outcome").innerHTML;
  var rightAnswer = createExercise(randomNumber1, randomNumber2, operator).toString(10);

  if (givenAnswer == rightAnswer) {
    document.getElementById("exercise-outcome").classList.remove("tryAgainClass");
    document.getElementById("exercise-outcome").classList.add("rightAnswerClass");
    score++;
    nextExercise();
    if (timerOff) {
      document.querySelector(".score").innerHTML = score;
      tries = maxTries; // so next exercise when hitting ENTER again
    } else { // Show score in total score during this timer on, is switched back when timer is done
      timerScore++;
      document.querySelector(".score").innerHTML = timerScore;
      again();
    }
  } else if (tries < maxTries) {
    document.getElementById("exercise-outcome").classList.remove("blackText");
    document.getElementById("exercise-outcome").classList.add("tryAgainClass");
  } else if (tries === maxTries) {
    document.getElementById("exercise-outcome").classList.add("wrongAnswerClass");
    document.querySelector("#exercise-outcome").innerHTML = rightAnswer;
    nextExercise();
    if (!timerOff) {
      document.querySelector("button.check-answer").disabled = true;
      setTimeout( again, 2000);
    }
  }
}

function disableButtons (bool) {
  var numpadNumbers = document.querySelectorAll("button.disableClass");
  for ( var i = 0; i < numpadNumbers.length; i++) {
    numpadNumbers[i].disabled = bool;
  }
}

function nextExercise () {
  document.querySelector(".check-answer").innerHTML = "<i class='fas fa-redo-alt'></i>";
  disableButtons(true); // disable buttons
  enabled = false; // disable keys
  document.onkeydown = keyBoardUse;
}

function again() { // reset to start the next exercise
  tries = 0;
  clearAll();
  randomNumber1 = Math.floor( Math.random()*10);
  randomNumber2 = Math.floor( Math.random()*10);
  document.querySelector(".check-answer").innerHTML = "=";
  disableButtons (false); // enable buttons
  document.querySelector("button.check-answer").disabled = false;
  enabled = true; // enable keys
  document.onkeydown = keyBoardUse;
  return createExercise(randomNumber1, randomNumber2, operator);
}

// Timer active

var myTimer;
function startTimer(duration, display) {
    var timer = duration;
    myTimer = setInterval(myClock, 1000);

    function myClock() {
      display.innerHTML = timer;
      if (--timer < 0) {
          clearInterval(myTimer);
          display.innerHTML = "<i class='fas fa-hourglass-half'></i>";
          timerOff = true;
          document.querySelector(".last-score").innerHTML = timerScore;
          highScore = determineHighScore( timerScore );
          document.querySelector(".high-score").innerHTML = highScore;
          document.querySelector(".score").innerHTML = score;
          timerScore = 0;
      }
    };
}

var timerOff = true;
function runTimer() {
    var time = 30;
    display = document.querySelector("button.timer");
    if (timerOff) {
      startTimer(time, display);
      timerOff = false;
    }
};

var highScore = 0;
function determineHighScore( score ) {
  if (score > highScore) {
    return score;
  } else {
    return highScore;
  }
}

// Operators

function add(num1, num2) {
  document.querySelector(".exercise-numbers").innerHTML = num1.toString(10) + " + " + num2.toString(10);
  return num1 + num2;
}

function subtract(num1, num2) {
  document.querySelector(".exercise-numbers").innerHTML = num1.toString(10) + " - " + num2.toString(10);
  return num1 - num2;
}

function multiply(num1, num2) {
  document.querySelector(".exercise-numbers").innerHTML = num1.toString(10) + " x " + num2.toString(10);
  return num1 * num2;
}

function divide(num1, num2) {
  document.querySelector(".exercise-numbers").innerHTML = num1.toString(10) + " : " + num2.toString(10);
  return num1 / num2;
}
