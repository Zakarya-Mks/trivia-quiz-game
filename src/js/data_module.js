// ******** Data And DOMElements ********************************************************************
//
// Data
export const mainData = {
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
export let domElement = {
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
