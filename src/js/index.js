import * as api_module from './api&B-Logic_module';
import * as data_module from './data_module';
import * as ui_module from './ui_module';

// ******** Dom EventS ********************************************************************
//
// Main Event Listeners
//
data_module.domElement.middleContainer.addEventListener('click', (event) => {
  // Start The Game Button Event
  if (event.target.id === 'StartGame') {
    // validation for the number of questions
    if (
      Number(data_module.domElement.count.value) > 0 &&
      !Number.isNaN(Number(data_module.domElement.count.value))
    ) {
      data_module.domElement.mainButton.innerHTML = `Loading ${data_module.domElement.svgIcon}`;
      let queryString = ui_module.fetchInputData();
      api_module.callServer(queryString);
    } else {
      data_module.domElement.count.classList.add('redFocus');
      data_module.domElement.count.classList.add('animate');
      setTimeout(() => {
        data_module.domElement.count.classList.remove('animate');
      }, 500);
    }
  }

  // Clear the red Focus
  if (event.target.id == 'trivia_amount') {
    data_module.domElement.count.classList.remove('redFocus');
  }

  // clicked Answer Event
  if (event.target.classList.contains('answerContainer')) {
    //hide no answer selected alert text
    data_module.domElement.redTextAlert.style.opacity = 0;

    // answer selection
    ui_module.removeSelectedAnswer();
    event.target.classList.add('selectedAnswer');
    api_module.getRadio(event.target).checked = true;
  } else if (event.target.parentNode.classList.contains('answerContainer')) {
    // hide no answer selected alert text
    data_module.domElement.redTextAlert.style.opacity = 0;

    // click on label answer selection
    ui_module.removeSelectedAnswer();
    event.target.parentNode.classList.add('selectedAnswer');
    api_module.getRadio(event.target.parentNode).checked = true;
  }
  // next Question Button Click event
  if (event.target.id === 'nextOrResult') {
    if (
      data_module.mainData.currentQuestion <
      data_module.mainData.questions.length - 1
    ) {
      if (api_module.checkIfAnswered()) {
        api_module.saveAnswer(data_module.mainData.currentQuestion);
        data_module.mainData.currentQuestion++;
        ui_module.displayQuestion(data_module.mainData.currentQuestion);

        // Change Next Button to Save and show Result
        if (
          data_module.mainData.currentQuestion ==
          data_module.mainData.questions.length - 1
        ) {
          data_module.domElement.nextOrResult.innerHTML = 'Save & Show Results';
        }
      } else {
        data_module.domElement.redTextAlert.style.opacity = 100;
        data_module.domElement.nextOrResult.classList.add('animate');
        setTimeout(() => {
          data_module.domElement.nextOrResult.classList.remove('animate');
        }, 500);
      }
    } else {
      if (api_module.checkIfAnswered()) {
        api_module.saveAnswer(data_module.mainData.currentQuestion);
        let result = 0;
        for (let item of data_module.mainData.questions) {
          if (item.correctOrNot === true) {
            result++;
          }
        }
        ui_module.showResult(result, data_module.mainData.questions.length);
      } else {
        data_module.domElement.redTextAlert.style.opacity = 100;
        data_module.domElement.nextOrResult.classList.add('animate');
        setTimeout(() => {
          data_module.domElement.nextOrResult.classList.remove('animate');
        }, 500);
      }
    }
  }

  // Restart the game button Click event (Same Config)
  if (event.target.classList.contains('restart')) {
    event.target.innerHTML = `Loading ${data_module.domElement.svgIcon}`;
    api_module.callServer(data_module.domElement.queryString);
  }

  // New Game Button Click Event (new Config)
  if (event.target.classList.contains('newGame')) {
    location.reload();
  }
});

data_module.domElement.middleContainer.addEventListener('input', (event) => {
  //number of questions limit to 50

  if (event.target.id == 'trivia_amount') {
    if (
      data_module.domElement.count.value.length > 2 ||
      data_module.domElement.count.value > 50
    ) {
      data_module.domElement.count.value = 50;
    }
  }
});
