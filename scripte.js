// ******** Data And DOMElements ********************************************************************
//
// Data
const mainData = {
  currentQuestion: 0,
  questions: []
};

// All Dom Elements
let domElement = {
  mainButton: document.querySelector("#StartGame"),
  count: document.querySelector("#trivia_amount"),
  category: document.querySelector("#trivia_category"),
  difficulty: document.querySelector("#trivia_difficulty"),
  type: document.querySelector("#trivia_type"),
  firstContainer: document.querySelector(".firstContainer"),
  secondContainer: document.querySelector(".secondContainer"),
  middleContainer: document.querySelector(".middleContainer"),
  ButtonContainer: document.querySelector(".ButtonContainer"),
  mainContainer: document.querySelector(".mainContainer"),
  answerContainer: "",
  nextOrResult: "",
  redTextAlert: "",
  queryString: "",
  svgIcon: `<svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
            x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
            <path fill="#000" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50" 
            transform="rotate(349.943 50 50)"><animateTransform attributeName="transform" 
            attributeType="XML" type="rotate" dur="1s" from="0 50 50" to="360 50 50" 
            repeatCount="indefinite"></animateTransform></path></svg>`
};

// ******** Dom EventS ********************************************************************
//
// Main Event Listeners
//
domElement.middleContainer.addEventListener("click", event => {
  // Start The Game Button Event
  if (event.target.id === "StartGame") {
    domElement.mainButton.innerHTML = `Loading ${domElement.svgIcon}`;
    let queryString = fetchInputData();
    callServer(queryString);
  }

  // clicked Answer Event
  if (event.target.classList.contains("answerContainer")) {
    //hide no answer selected alert text
    domElement.redTextAlert.classList.add("hide");

    // answer selection
    removeSelectedAnswer();
    event.target.classList.add("selectedAnswer");
    getRadio(event.target).checked = true;
  } else if (event.target.parentNode.classList.contains("answerContainer")) {
    // hide no answer selected alert text
    domElement.redTextAlert.classList.add("hide");

    // click on label answer selection
    removeSelectedAnswer();
    event.target.parentNode.classList.add("selectedAnswer");
    getRadio(event.target.parentNode).checked = true;
  }

  // next Question Button Click event
  if (event.target.id === "nextOrResult") {
    if (mainData.currentQuestion < mainData.questions.length - 1) {
      if (checkIfAnswered()) {
        saveAnswer(mainData.currentQuestion);
        mainData.currentQuestion++;
        displayQuestion(mainData.currentQuestion);
      } else {
        domElement.redTextAlert.classList.remove("hide");
        domElement.nextOrResult.classList.add("animate");
        setTimeout(() => {
          domElement.nextOrResult.classList.remove("animate");
        }, 500);
      }
    } else {
      if (checkIfAnswered()) {
        saveAnswer(mainData.currentQuestion);
        let result = 0;
        for (let item of mainData.questions) {
          if (item.correctOrNot === true) {
            result++;
          }
        }
        showResult(result, mainData.questions.length);
      } else {
        domElement.redTextAlert.classList.remove("hide");
        domElement.nextOrResult.classList.add("animate");
        setTimeout(() => {
          domElement.nextOrResult.classList.remove("animate");
        }, 500);
      }
    }
  }

  // Show Final Answer Log Click Event
  if (event.target.classList.contains("clickEvent")) {
    let answerNumber = getAnswerNumber(event.target.className);
    let AnswerDiv = document.querySelector(
      `.CorrectAnswer.clickEvent.${answerNumber}`
    );

    if (AnswerDiv.classList.contains("showSelectedDivContent")) {
      AnswerDiv.classList.toggle("showSelectedDivContent");
      document
        .querySelector(`.fas.fa-chevron-right.clickEvent.${answerNumber}`)
        .classList.toggle("rotate");
    } else {
      collapseAll();
      collapseAllChevrons();
      AnswerDiv.classList.toggle("showSelectedDivContent");
      document
        .querySelector(`.fas.fa-chevron-right.clickEvent.${answerNumber}`)
        .classList.toggle("rotate");
    }
  }

  // Restart the game button Click event (Same Config)
  if (event.target.classList.contains("restart")) {
    event.target.innerHTML = `Loading ${domElement.svgIcon}`;
    callServer(domElement.queryString);
  }

  // New Game Button Click Event (new Config)
  if (event.target.classList.contains("newGame")) {
    location.reload();
  }
});

// ******** Main Logic & api Call  & Functions ********************************************************************
//
// Fetch Data From Server
function callServer(apiCall) {
  fetch(apiCall)
    .then(receivedData => receivedData.json())
    .then(jsonData => getQuestions(jsonData.results))
    .catch(err => alert(err));
}

// Get The Q&As and Save Them To The Local Memory
function getQuestions(data) {
  mainData.currentQuestion = 0;
  mainData.questions = [];
  for (let item of data) {
    let questions = {};
    questions.category = item.category;
    questions.difficulty = item.difficulty;
    questions.question = item.question;
    questions.correct_answer = item.correct_answer;
    questions.incorrect_answers = item.incorrect_answers;
    questions.userAnswer = "";
    questions.correctOrNot = "";
    mainData.questions.push(questions);
  }
  // Clear The Main Div
  removeDomElement();

  // Call Display the Questions to the UI Function
  displayQuestion(mainData.currentQuestion);
}

// Shuffle tha Question And Return As A Template String
function ShuffleAnswers(questionIndex) {
  let allAnswers = [];

  for (let [index, item] of mainData.questions[
    questionIndex
  ].incorrect_answers.entries()) {
    allAnswers.push(`<div class="answerContainer" id="answer-${index + 1}">
                    <input type="radio" name="answer" class="formControl-2" value="${item}">
                    <label for="answer" class="inputLabel noPadding cursor">${item}</label>
                  </div>`);
  }
  allAnswers.push(`<div class="answerContainer" id="answer-0">
                    <input type="radio" name="answer" class="formControl-2" value="${mainData.questions[questionIndex].correct_answer}">
                    <label for="answer" class="inputLabel noPadding cursor">${mainData.questions[questionIndex].correct_answer}</label>
                  </div>`);
  for (let i = allAnswers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
  }

  let questions = "";
  for (let item of allAnswers) {
    questions += item;
  }

  return questions;
}

// check if Question Answered or not
function checkIfAnswered() {
  let answeredOrNot = false;
  for (let item of domElement.answerContainer) {
    if (getRadio(item).checked === true) {
      answeredOrNot = true;
    }
  }
  return answeredOrNot;
}

// Save User Answer To the Data
function saveAnswer(questionIndex) {
  for (let item of domElement.answerContainer) {
    if (getRadio(item).checked === true) {
      mainData.questions[questionIndex].userAnswer = getRadio(item).value;
      if (
        getRadio(item).value ===
        mainData.questions[questionIndex].correct_answer
      ) {
        mainData.questions[questionIndex].correctOrNot = true;
      } else {
        mainData.questions[questionIndex].correctOrNot = false;
      }
    }
  }
}

// Get Radio Button From parent Node
function getRadio(NodeArray) {
  for (let item of NodeArray.childNodes) {
    if (item.className === "formControl-2") {
      return item;
    }
  }
}

// Get Class Answer number from the result div
function getAnswerNumber(elementNode) {
  let answerNumber = elementNode.slice(elementNode.indexOf("answer-"));
  if (answerNumber.includes(" ")) {
    return answerNumber.split(" ")[0];
  } else {
    return answerNumber;
  }
}

// collapse All Answer in the Answers Log
function collapseAll() {
  let array = document.querySelectorAll(".CorrectAnswer");
  for (let item of array) {
    item.classList.remove("showSelectedDivContent");
  }
}

// Collapse All Answer Chevrons
function collapseAllChevrons() {
  let arry2 = document.querySelectorAll(".fa-chevron-right");
  for (let item of arry2) {
    item.classList.remove("rotate");
  }
}

// ******** UI ********************************************************************
//
// Display the Questions to the UI
function displayQuestion(questionIndex) {
  //Get The Answers Shuffled
  let answers = ShuffleAnswers(questionIndex);

  // Creat A Template String To Add The Dom
  let templateString = `<div class="secondContainer" id="jsDisplayToggle">
                        <div class="TitleContainer">
                          <h1 class="titleText">Question ${questionIndex +
                            1}</h1>                            
                        </div> 
                        <div class="underTitle">    
                              <label>${
                                mainData.questions[questionIndex].category
                              }</label>
                              <label>Difficulty: ${
                                mainData.questions[questionIndex].difficulty
                              }</label>                                
                        </div>                  
                        <div class="questionContainer">
                          <p class="inputLabel noPadding">${
                            mainData.questions[questionIndex].question
                          }</p>
                        </div>
                        ${answers}
                        <div class="textAlert hide" >
                            <label for="answer" class="inputLabel noPadding textAlertLabel">* Please Select An Answer</label>
                          </div>
                        <div class="inputContainer buttonContainer">
                          <button class="mainButton" id="nextOrResult">Next Question</button>
                        </div>                        
                      </div>`;

  // Hide mainContainer Current Content
  removeDomElement();

  // Insert Template String To The Dom
  domElement.middleContainer.insertAdjacentHTML("beforeend", templateString);

  // Add nextOrResult button To DomElement Object
  domElement.nextOrResult = document.querySelector("#nextOrResult");

  // Reassign Answer Containers to DomElement Object
  domElement.answerContainer = document.querySelectorAll(".answerContainer");
  // Reassign redText item to DomElement Object
  domElement.redTextAlert = document.querySelector(".textAlert");
}

// Get Field Value As A String
function fetchInputData() {
  domElement.queryString = `https://opentdb.com/api.php?amount=${domElement.count.value}`;
  if (domElement.category.value !== "any") {
    domElement.queryString += `&category=${domElement.category.value}`;
  }
  if (domElement.difficulty.value !== "any") {
    domElement.queryString += `&difficulty=${domElement.difficulty.value}`;
  }
  if (domElement.type.value !== "any") {
    domElement.queryString += `&type=${domElement.type.value}`;
  }
  return domElement.queryString;
}

// remove answer Selection
function removeSelectedAnswer() {
  for (let item of domElement.answerContainer) {
    item.classList.remove("selectedAnswer");
  }
}

// hide or Show Dom Element
function removeDomElement() {
  for (let item of domElement.middleContainer.childNodes) {
    if (item.id === "jsDisplayToggle") {
      //remove element
      domElement.middleContainer.removeChild(item);
    }
  }
}

// Show Result
function showResult(score, outOff) {
  // Generate Score Result
  let templateString = `<div class="firstContainer resultMainContainer" id="jsDisplayToggle">
                          <div class="TitleContainer">
                            <h1 class="titleText">Game Score</h1>         
                          </div>
                          <div class="scoreContainer">
                            <div class="score">
                              <label for="" class="resultLabel">Final Score!</label> 
                              <div>
                                <label for="" class="result">${score}</label>
                                <label for="" class="result">/</label>
                                <label for="" class="result">${outOff}</label>
                              </div>       
                            </div>
                            <div class="RestartNewContainer">
                              <button class="restart">Restart Game</button>
                              <button class="newGame">New Game</button>
                            </div>
                          </div>`;

  // Show The Correct Answer For the Users Wrong Answer
  let stringToInsert = "";
  let id = 0;
  for (let item of mainData.questions) {
    id++;

    if (item.correctOrNot === true) {
      stringToInsert += `<div class="answersLog">
                            <div class="answerIcon">
                                <i class="far fa-check-circle"></i>
                            </div>
                            <div class="singleAnswerResult clickEvent answer-${id}">
                                <div class="theAnswer clickEvent answer-${id}">
                                    <i class="fas fa-chevron-right clickEvent answer-${id}"></i>
                                    <div class="clickEvent answer-${id}">
                                        ${item.question}
                                    </div>
                                </div>
                                <div class="CorrectAnswer clickEvent answer-${id}">
                                    <div class="hrLine clickEvent answer-${id}">
                                        <hr class="clickEvent answer-${id}" />
                                    </div>
                                    <div class="theAnswerBottomSection clickEvent answer-${id}">
                                        <i class="far fa-arrow-alt-circle-right clickEvent answer-${id}"></i>
                                        <div class="theQuestionCorrectAnswer clickEvent answer-${id}">
                                            ${item.correct_answer}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
    } else {
      stringToInsert += `<div class="answersLog">
                            <div class="answerIcon">
                              <i class="far fa-times-circle"></i>
                            </div>
                            <div class="singleAnswerResult clickEvent answer-${id}">
                                <div class="theAnswer clickEvent answer-${id}">
                                    <i class="fas fa-chevron-right clickEvent answer-${id}"></i>
                                    <div class="clickEvent answer-${id}">
                                        ${item.question}
                                    </div>
                                </div>
                                <div class="CorrectAnswer clickEvent answer-${id}">
                                    <div class="hrLine clickEvent answer-${id}">
                                        <hr class="clickEvent answer-${id}" />
                                    </div>
                                    <div class="theAnswerBottomSection clickEvent answer-${id}">
                                        <i class="far fa-arrow-alt-circle-right clickEvent answer-${id}"></i>
                                        <div class="theQuestionCorrectAnswer clickEvent answer-${id}">
                                            ${item.correct_answer}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
    }
  }

  templateString += `<div class="scoreBottomSection">${stringToInsert}</div>`;
  removeDomElement();
  domElement.middleContainer.insertAdjacentHTML("beforeend", templateString);
}
