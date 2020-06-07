import * as api_module from './api&B-Logic_module';
import * as data_module from './data_module';

// ******** UI ********************************************************************
//
// Fill in The Categories
//
(function fillTheCategories() {
  let tempArr = Array.from(data_module.mainData.Categories);
  tempArr.sort();
  let strTemplate = '';

  for (let item of tempArr) {
    strTemplate = `<option value="${
      data_module.mainData.Categories.indexOf(item) + 9
    }">${item}</option>`;
    data_module.domElement.category.insertAdjacentHTML(
      'beforeend',
      strTemplate
    );
  }
})();
// Display the Questions to the UI
export function displayQuestion(questionIndex) {
  //Get The Answers Shuffled
  let answers = api_module.ShuffleAnswers(questionIndex);

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
                                    data_module.mainData.questions[
                                      questionIndex
                                    ].category
                                  }</span
                                >
                                <span class="badge ml-auto"
                                  >${
                                    data_module.mainData.questions[
                                      questionIndex
                                    ].difficulty
                                  }</span
                                >
                              </div>
                            <div class="card-body px-md-5">                            
                              <div class="container h4 py-3 noMargin">
                                <p>${
                                  data_module.mainData.questions[questionIndex]
                                    .question
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
  data_module.domElement.middleContainer.insertAdjacentHTML(
    'beforeend',
    templateString
  );

  // Add nextOrResult button To DomElement Object
  data_module.domElement.nextOrResult = document.querySelector('#nextOrResult');

  // Reassign Answer Containers to DomElement Object
  data_module.domElement.answerContainer = document.querySelectorAll(
    '.answerContainer'
  );

  // Reassign redText item to DomElement Object
  data_module.domElement.redTextAlert = document.querySelector('.textAlert');
}

// Get Field Value As A String
export function fetchInputData() {
  data_module.domElement.queryString = `https://opentdb.com/api.php?amount=${data_module.domElement.count.value}`;
  if (data_module.domElement.category.value !== 'any') {
    data_module.domElement.queryString += `&category=${data_module.domElement.category.value}`;
  }
  if (data_module.domElement.difficulty.value !== 'any') {
    data_module.domElement.queryString += `&difficulty=${data_module.domElement.difficulty.value}`;
  }
  if (data_module.domElement.type.value !== 'any') {
    data_module.domElement.queryString += `&type=${data_module.domElement.type.value}`;
  }
  return data_module.domElement.queryString;
}

// remove answer Selection
export function removeSelectedAnswer() {
  for (let item of data_module.domElement.answerContainer) {
    item.classList.remove('selectedAnswer');
  }
}

// hide or Show Dom Element
export function removeDomElement() {
  for (let item of data_module.domElement.middleContainer.childNodes) {
    if (item.id === 'jsDisplayToggle') {
      //remove element
      data_module.domElement.middleContainer.removeChild(item);
    }
  }
}

// Show Result
export function showResult(score, outOff) {
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
  for (let item of data_module.mainData.questions) {
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
  data_module.domElement.middleContainer.insertAdjacentHTML(
    'beforeend',
    templateString
  );
}
