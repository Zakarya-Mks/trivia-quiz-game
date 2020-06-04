// ******** Data And DOMElements ********************************************************************
//
// Data
const mainData = {
  currentQuestion: 0,
  questions: [],
  Categories: [
    'General Knowledge',
    'Entertainment: Books',
    'Entertainment: Film',
    'Entertainment: Music',
    'Entertainment: Musicals & Theatres',
    'Entertainment: Television',
    'Entertainment: Video Games',
    'Entertainment: Board Games',
    'Science & Nature',
    'Science: Computers',
    'Science: Mathematics',
    'Mythology',
    'Sports',
    'Geography',
    'History',
    'Politics',
    'Art',
    'Celebrities',
    'Animals',
    'Vehicles',
    'Entertainment: Comics',
    'Science: Gadgets',
    'Entertainment: Japanese Anime & Manga',
    'Entertainment: Cartoon & Animations',
  ],
};

// All Dom Elements
let domElement = {
  mainButton: document.querySelector('#StartGame'),
  count: document.querySelector('#trivia_amount'),
  category: document.querySelector('#trivia_category'),
  difficulty: document.querySelector('#trivia_difficulty'),
  type: document.querySelector('#trivia_type'),
  firstContainer: document.querySelector('.firstContainer'),
  secondContainer: document.querySelector('.secondContainer'),
  middleContainer: document.querySelector('.middleContainer'),
  mainContainer: document.querySelector('.mainContainer'),
  answerContainer: '',
  nextOrResult: '',
  redTextAlert: '',
  queryString: '',
  svgIcon: `<svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
            x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
            <path fill="#000" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50" 
            transform="rotate(349.943 50 50)"><animateTransform attributeName="transform" 
            attributeType="XML" type="rotate" dur="1s" from="0 50 50" to="360 50 50" 
            repeatCount="indefinite"></animateTransform></path></svg>`,
};

// ******** Dom EventS ********************************************************************
//
// Main Event Listeners
//
domElement.middleContainer.addEventListener('click', (event) => {
  // Start The Game Button Event
  if (event.target.id === 'StartGame') {
    // validation for the number of questions
    if (
      Number(domElement.count.value) > 0 &&
      !Number.isNaN(Number(domElement.count.value))
    ) {
      domElement.mainButton.innerHTML = `Loading ${domElement.svgIcon}`;
      let queryString = fetchInputData();
      callServer(queryString);
    } else {
      domElement.count.classList.add('redFocus');
      domElement.count.classList.add('animate');
      setTimeout(() => {
        domElement.count.classList.remove('animate');
      }, 500);
    }
  }

  // Clear the red Focus
  if (event.target.id == 'trivia_amount') {
    domElement.count.classList.remove('redFocus');
  }

  // clicked Answer Event
  if (event.target.classList.contains('answerContainer')) {
    //hide no answer selected alert text
    domElement.redTextAlert.style.opacity = 0;

    // answer selection
    removeSelectedAnswer();
    event.target.classList.add('selectedAnswer');
    getRadio(event.target).checked = true;
  } else if (event.target.parentNode.classList.contains('answerContainer')) {
    // hide no answer selected alert text
    domElement.redTextAlert.style.opacity = 0;

    // click on label answer selection
    removeSelectedAnswer();
    event.target.parentNode.classList.add('selectedAnswer');
    getRadio(event.target.parentNode).checked = true;
  }
  // next Question Button Click event
  if (event.target.id === 'nextOrResult') {
    if (mainData.currentQuestion < mainData.questions.length - 1) {
      if (checkIfAnswered()) {
        saveAnswer(mainData.currentQuestion);
        mainData.currentQuestion++;
        displayQuestion(mainData.currentQuestion);

        // Change Next Button to Save and show Result
        if (mainData.currentQuestion == mainData.questions.length - 1) {
          domElement.nextOrResult.innerHTML = 'Save & Show Results';
        }
      } else {
        domElement.redTextAlert.style.opacity = 100;
        domElement.nextOrResult.classList.add('animate');
        setTimeout(() => {
          domElement.nextOrResult.classList.remove('animate');
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
        domElement.redTextAlert.style.opacity = 100;
        domElement.nextOrResult.classList.add('animate');
        setTimeout(() => {
          domElement.nextOrResult.classList.remove('animate');
        }, 500);
      }
    }
  }

  // Restart the game button Click event (Same Config)
  if (event.target.classList.contains('restart')) {
    event.target.innerHTML = `Loading ${domElement.svgIcon}`;
    callServer(domElement.queryString);
  }

  // New Game Button Click Event (new Config)
  if (event.target.classList.contains('newGame')) {
    location.reload();
  }
});

domElement.middleContainer.addEventListener('input', (event) => {
  //number of questions limit to 50

  if (event.target.id == 'trivia_amount') {
    if (domElement.count.value.length > 2 || domElement.count.value > 50) {
      domElement.count.value = 50;
    }
  }
});

// ******** Main Logic & api Call  & Functions ********************************************************************
//
// Fetch Data From Server
function callServer(apiCall) {
  fetch(apiCall)
    .then((receivedData) => receivedData.json())
    .then((jsonData) => getQuestions(jsonData.results))
    .catch((err) => alert(err));
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
    questions.userAnswer = '';
    questions.correctOrNot = '';
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
    allAnswers.push(`<div class="alert alert-info cursor h5 answerContainer" role="alert" id="answer-${
      index + 1
    }">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="answer"
                          value="${item}"
                        />
                        ${item}
                      </div>`);
  }
  allAnswers.push(`<div class="alert alert-info cursor h5 answerContainer" role="alert" id="answer-0">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="answer"
                        value="${mainData.questions[questionIndex].correct_answer}"
                      />
                      ${mainData.questions[questionIndex].correct_answer}
                    </div>`);
  for (let i = allAnswers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
  }

  let questions = '';
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
    if (item.className === 'form-check-input') {
      return item;
    }
  }
}

// Get Class Answer number from the result div
function getAnswerNumber(elementNode) {
  let answerNumber = elementNode.slice(elementNode.indexOf('answer-'));
  if (answerNumber.includes(' ')) {
    return answerNumber.split(' ')[0];
  } else {
    return answerNumber;
  }
}

// ******** UI ********************************************************************
//
// Fill in The Categories
//
(function fillTheCategories() {
  let tempArr = Array.from(mainData.Categories);
  tempArr.sort();
  let strTemplate = '';

  for (let item of tempArr) {
    strTemplate = `<option value="${
      mainData.Categories.indexOf(item) + 9
    }">${item}</option>`;
    domElement.category.insertAdjacentHTML('beforeend', strTemplate);
  }
})();
// Display the Questions to the UI
function displayQuestion(questionIndex) {
  //Get The Answers Shuffled
  let answers = ShuffleAnswers(questionIndex);

  // Creat A Template String To Add The Dom
  let templateString = `<div class="card card-bg-custom secondContainer" id="jsDisplayToggle">
                          <div class="card-header d-flex justify-content-center align-items-center">
                            <span class="card-title h1 pl-2 font-weight-normal"
                              >Question ${questionIndex + 1}</span
                            >
                          </div>
                          <div class="container d-flex p-2">
                              <span class="badge"
                                >${
                                  mainData.questions[questionIndex].category
                                }</span
                              >
                              <span class="badge ml-auto"
                                >${
                                  mainData.questions[questionIndex].difficulty
                                }</span
                              >
                            </div>
                          <div class="card-body px-md-5">                            
                            <div class="container h4 py-3 noMargin">
                              <p>${
                                mainData.questions[questionIndex].question
                              }</p>
                            </div>
                            <div class="container p-3">
                              ${answers}
                            </div>
                            <div class="container textAlert">
                              <label for="answer" class="textAlertLabel">* Please Select An Answer</label>
                            </div>
                            <div class="container">
                            <div class="row">
                              <div class="col-lg-8">
                                <button
                                  class="btn w-100 mainButton btn-custom"
                                  id="nextOrResult"
                                >Next Question</button>
                              </div>
                            </div>
                          </div>
                          </div>
                        </div>`;

  // Hide mainContainer Current Content
  removeDomElement();

  // Insert Template String To The Dom
  domElement.middleContainer.insertAdjacentHTML('beforeend', templateString);

  // Add nextOrResult button To DomElement Object
  domElement.nextOrResult = document.querySelector('#nextOrResult');

  // Reassign Answer Containers to DomElement Object
  domElement.answerContainer = document.querySelectorAll('.answerContainer');

  // Reassign redText item to DomElement Object
  domElement.redTextAlert = document.querySelector('.textAlert');
}

// Get Field Value As A String
function fetchInputData() {
  domElement.queryString = `https://opentdb.com/api.php?amount=${domElement.count.value}`;
  if (domElement.category.value !== 'any') {
    domElement.queryString += `&category=${domElement.category.value}`;
  }
  if (domElement.difficulty.value !== 'any') {
    domElement.queryString += `&difficulty=${domElement.difficulty.value}`;
  }
  if (domElement.type.value !== 'any') {
    domElement.queryString += `&type=${domElement.type.value}`;
  }
  return domElement.queryString;
}

// remove answer Selection
function removeSelectedAnswer() {
  for (let item of domElement.answerContainer) {
    item.classList.remove('selectedAnswer');
  }
}

// hide or Show Dom Element
function removeDomElement() {
  for (let item of domElement.middleContainer.childNodes) {
    if (item.id === 'jsDisplayToggle') {
      //remove element
      domElement.middleContainer.removeChild(item);
    }
  }
}

// Show Result
function showResult(score, outOff) {
  // Generate Score Result
  let templateString = `<div class="Container" id="jsDisplayToggle">
                          <div class="card card-bg-custom">
                            <div
                              class="card-header d-flex justify-content-center align-items-center"
                            >
                              <span class="card-title h1 pl-2 font-weight-normal">Game Score</span>
                            </div>
                            <div class="card-body px-md-5">
                              <div class="container">
                                <div class="row py-3">
                                  <div class="col-sm-12 col-lg-6 d-flex flex-column align-items-center">
                                    <label for="" class="h1">Final Score!</label>
                                    <div>
                                      <label for="" class="h1">${score} / ${outOff}</label>
                                    </div>
                                  </div>
                                  <div class="col-sm-12 col-lg-6">
                                    <div class="container d-flex flex-column justify-content-around h-100">
                                      <button class="btn w-100 btn-custom restart shadowEffect">
                                        Restart Game
                                      </button>
                                      <button class="btn mt-2 w-100 btn-custom newGame shadowEffect">New Game</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="row py-3">
                                <div class="col">
                                  <span class="h5">Answer Log</span>
                                </div>
                              </div>
                        `;

  // Show The Correct Answer For the Users Wrong Answer
  let stringToInsert = '';
  let id = 0;
  for (let item of mainData.questions) {
    id++;

    if (item.correctOrNot === true) {
      stringToInsert += `<div class="card bg-success-light noShadow mb-1">
                            <div class="card-header cursor d-flex" id="answer-${id}-heading" data-toggle="collapse" data-target="#answer-${id}" aria-expanded="true" aria-controls="answer-${id}">
                              <div class="mr-3 d-flex align-items-center"><i class="far fa-check-circle greenColor"></i></div> ${item.question}
                            </div>
                        
                            <div id="answer-${id}" class="collapse" aria-labelledby="answer-${id}-heading" data-parent="#AnswerLog">
                              <div class="card-body bg-white d-flex">
                                <div class="mr-3 d-flex align-items-center"><i class="far fa-arrow-alt-circle-right"></i></div>${item.correct_answer}
                              </div>
                            </div>
                          </div>`;
    } else {
      stringToInsert += `<div class="card bg-danger-light noShadow mb-1">
                            <div class="card-header cursor bg-danger-light d-flex" id="answer-${id}-heading" data-toggle="collapse" data-target="#answer-${id}" aria-expanded="true" aria-controls="answer-${id}">
                              <div class="mr-3 d-flex align-items-center"><i class="far fa-times-circle redColor"></i></div>
                             ${item.question}
                            </div>
                        
                            <div id="answer-${id}" class="collapse" aria-labelledby="answer-${id}-heading" data-parent="#AnswerLog">
                              <div class="card-body bg-white d-flex">
                                <div class="mr-3 d-flex align-items-center"><i class="far fa-arrow-alt-circle-right"></i></div>${item.correct_answer}
                              </div>
                            </div>
                          </div>`;
    }
  }

  templateString += `<div class="answerScroll"><div class="accordion px-3" id="AnswerLog">${stringToInsert}</div></div></div></div></div>`;
  removeDomElement();
  domElement.middleContainer.insertAdjacentHTML('beforeend', templateString);
}
