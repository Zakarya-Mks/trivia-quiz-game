import * as data_module from './data_module';
import * as ui_module from './ui_module';

// ******** Main Logic & api Call  & Functions ********************************************************************
//
// Fetch Data From Server
export function callServer(apiCall) {
  fetch(apiCall)
    .then((receivedData) => receivedData.json())
    .then((jsonData) => getQuestions(jsonData.results))
    .catch((err) => alert(err));
}

// Get The Q&As and Save Them To The Local Memory
export function getQuestions(data) {
  data_module.mainData.currentQuestion = 0;
  data_module.mainData.questions = [];
  for (let item of data) {
    let questions = {};
    questions.category = item.category;
    questions.difficulty = item.difficulty;
    questions.question = item.question;
    questions.correct_answer = item.correct_answer;
    questions.incorrect_answers = item.incorrect_answers;
    questions.userAnswer = '';
    questions.correctOrNot = '';
    data_module.mainData.questions.push(questions);
  }
  // Clear The Main Div
  ui_module.removeDomElement();

  // Call Display the Questions to the UI Function
  ui_module.displayQuestion(data_module.mainData.currentQuestion);
}

// Shuffle tha Question And Return As A Template String
export function ShuffleAnswers(questionIndex) {
  let allAnswers = [];

  for (let [index, item] of data_module.mainData.questions[
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
                          value="${data_module.mainData.questions[questionIndex].correct_answer}"
                        />
                        ${data_module.mainData.questions[questionIndex].correct_answer}
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
export function checkIfAnswered() {
  let answeredOrNot = false;
  for (let item of data_module.domElement.answerContainer) {
    if (getRadio(item).checked === true) {
      answeredOrNot = true;
    }
  }
  return answeredOrNot;
}

// Save User Answer To the Data
export function saveAnswer(questionIndex) {
  for (let item of data_module.domElement.answerContainer) {
    if (getRadio(item).checked === true) {
      data_module.mainData.questions[questionIndex].userAnswer = getRadio(
        item
      ).value;
      if (
        getRadio(item).value ===
        data_module.mainData.questions[questionIndex].correct_answer
      ) {
        data_module.mainData.questions[questionIndex].correctOrNot = true;
      } else {
        data_module.mainData.questions[questionIndex].correctOrNot = false;
      }
    }
  }
}

// Get Radio Button From parent Node
export function getRadio(NodeArray) {
  for (let item of NodeArray.childNodes) {
    if (item.className === 'form-check-input') {
      return item;
    }
  }
}

// Get Class Answer number from the result div
export function getAnswerNumber(elementNode) {
  let answerNumber = elementNode.slice(elementNode.indexOf('answer-'));
  if (answerNumber.includes(' ')) {
    return answerNumber.split(' ')[0];
  } else {
    return answerNumber;
  }
}
