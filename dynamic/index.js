// select elements
const loading = document.querySelector(".loading");
const startBtn = document.querySelector(".start_btn");
const gameContainer = document.querySelector(".game_container"),
      formList = document.querySelector(".game_container .form_list"),
      checkBtn = document.querySelector(".game_container .check_btn"),
      hintBtn = document.querySelector(".game_container .hint_btn");
const resultContainer = document.querySelector(".result_container"),
      containerContent = document.querySelector(".result_container .container_content"),
      resetBtn = document.querySelector(".result_container .reset_btn");


// start control the game
// fetch all words
fetchWords();
async function fetchWords() {
  let promise = await fetch("/data/english-words.json");
  data = await promise.json();
  loading.classList.remove("active_loading");
  startBtn.classList.add("active_start_btn");
  getData(data);
};

function getData(data) {

  let words = data;
      randomIndex = Math.floor(Math.random() * words.length), // get random index between 0 and last index number
      chosenWord = words[randomIndex].toUpperCase(); // get the random word my the random index and make it upper case

  // console.log(chosenWord);

  // number of trys that build lis from it
  let tryNumb;
  // number of hints
  let hintsNumb;

  // if number of letters of the chosen word is from 2 to 3
  if (chosenWord.length >= 2 && chosenWord.length <= 3) {
    tryNumb = 2;
    hintsNumb = 1;

  // if number of letters of the chosen word is from 4 to 6
  } else if (chosenWord.length >= 4 && chosenWord.length <= 6) {
    tryNumb = 4;
    hintsNumb = 2;

  // if number of letters of the chosen word is from 7 to 10
  } else if (chosenWord.length >= 7 && chosenWord.length <= 10) {
    tryNumb = 6;
    hintsNumb = 3;

  // if number of letters of the chosen word is from 11 to 15
  } else if (chosenWord.length >= 11 && chosenWord.length <= 15) {
    tryNumb = 8;
    hintsNumb = 4;

  // if number of letters of the chosen word is from 16 to 21
  } else if (chosenWord.length >= 16 && chosenWord.length <= 21) {
    tryNumb = 10;
    hintsNumb = 5;

  // if number of letters of the chosen word is from 22 and more
  } else if (chosenWord.length >= 22) {
    tryNumb = 12;
    hintsNumb = 6;
  }
  // end control the game

  // add click events to start button
  startBtn.addEventListener("click", startGame);
  startBtn.addEventListener("click", createGame);

  // remove active from start button and add active to game container
  function startGame() {
    startBtn.classList.remove("active_start_btn");
    gameContainer.classList.add("active_game_container");
  };

  function createGame() {
    // create numb of li depends on numb of trys
    for (let i = 1; i <= tryNumb; i++) {
      // create li, add class
      const li = document.createElement("li");
      li.classList.add("list_item");

      // create span, add class, add content
      const span = document.createElement("span");
      span.classList.add("item_numb");
      span.innerHTML = `Try ${i}`;

      // create div, add class
      const div = document.createElement("div");
      div.classList.add("item_content");

      // create numb of inputs depends on letters of word
      for (let j = 0; j < chosenWord.length; j++) {
        // create input, add class, add type, add data attr, add disabled attr
        const input = document.createElement("input");
        input.classList.add("content_input");
        input.type = "text";
        input.maxLength = "1";
        input.setAttribute("disabled", true);

        // append elements
        div.appendChild(input);
      }
      
      // append elements
      li.appendChild(span);
      li.appendChild(div);
      formList.appendChild(li);
    }
    handleInputs();
  };

  // counter index for li, set zero us defult
  let indexListItem = 0;

  // counter index for inputs
  let indexContentInputs;

  function handleInputs() {
    // set zero us defult
    indexContentInputs = 0;

    // select lis as array
    const listItems = Array.from(document.querySelectorAll(".game_container .main_form .list_item"));
    // select inputs as array of current li index
    const contentInputs = Array.from(listItems[indexListItem].childNodes[1].childNodes);

    // remove active from all lis
    listItems.forEach(item => {
      item.classList.remove("active_list_item");
    });
    // add active on current li index
    listItems[indexListItem].classList.add("active_list_item");

    // set disabled (inActive) on all inputs of all lis
    listItems.forEach(item => {
      item.childNodes[1].childNodes.forEach(child => {
        child.setAttribute("disabled", true);
      })
    });
    // remove disabled (Active) from all inputs of current li index
    contentInputs.forEach(input => {
      input.removeAttribute("disabled", true);
    });

    // looping on current inputs to add some events
    contentInputs.forEach(input => {
      // on focus => remove active from any input that empty, add active on target input
      input.addEventListener("focus", e => {
        if (input.value === "") {
          input.classList.remove("active_content_input");
        }
        e.target.classList.add("active_content_input");
      });

      // on blur => remove active from target input that empty
      input.addEventListener("blur", e => {
        if (e.target.value === "") {
          e.target.classList.remove("active_content_input");
        }
      });

      // on mousedown => counter index for inputs = current index number of the target input (or) target input position number in its array
      input.addEventListener("mousedown", e => {
        indexContentInputs = contentInputs.indexOf(e.target);
      })

      // on keydown => 
      input.addEventListener("keydown", e => {
        // on click ArrowRight => +1 and focus on the new index input if counter index for inputs less than number of current inputs - 1
        if (e.key === "ArrowRight") {
          // other way: if counter index for inputs = the last number of current inputs index in the array: stop
          if (indexContentInputs < contentInputs.length - 1) {
            indexContentInputs++;
            contentInputs[indexContentInputs].focus();
          }
        }
        // on click ArrowLeft => -1 and focus on the new index input if counter index for inputs more than or equal 1
        if (e.key === "ArrowLeft") {
          // other way: if counter index for inputs = 0: stop
          if (indexContentInputs >= 1) {
            indexContentInputs--;
            contentInputs[indexContentInputs].focus();
          }
        }
      });

      // on input => 
      input.addEventListener("input", e => {
        // make target input value to upper case
        e.target.value = e.target.value.toUpperCase();
        // if not empty? true: false; (+1 focus) after fill the target input and to avoid making (+1 focus) after deleting
        if (e.target.value !== "") {
          // other way: if counter index for inputs = the last number of current inputs index in the array: stop
          if (indexContentInputs < contentInputs.length - 1) {
            indexContentInputs++;
            contentInputs[indexContentInputs].focus();
          }
        }
      });
    });
    
    // as defult focus on the first input index of the current active li
    contentInputs[indexContentInputs].focus();
  };

  // as defult, put number of hints in button
  if (hintsNumb <= 1) {
    hintBtn.innerHTML = `${hintsNumb} Hint`;
  } else if (hintsNumb > 1) {
    hintBtn.innerHTML = `${hintsNumb} Hints`;
  }

  hintBtn.addEventListener("click", _ => {
    // select lis as array
    const listItems = Array.from(document.querySelectorAll(".game_container .main_form .list_item"));
    // select inputs as array of current li index
    const contentInputs = Array.from(listItems[indexListItem].childNodes[1].childNodes);

    // the avaliable inputs for hint
    let hintsInputs = [];
    // the right letter in the chosenWord for the avaliable inputs
    let hintsWord = [];

    for (let i = 0; i < contentInputs.length; i++) {
      // if input value is empty then put it in the array and its right letter from chosenWord, because its avaliable for hint
      if (contentInputs[i].value === "") {
        hintsInputs.push(contentInputs[i]);
        hintsWord.push(chosenWord[i]);
      }
    }
    
    // if the array of the avaliable inputs for hint not empty => get random index number from the length of the array
    if (hintsInputs.length !== 0) {
      let randomIndexInput = Math.floor(Math.random() * hintsInputs.length);
    
      // if number of hints more than 0 
      if (hintsNumb > 0) {
        // -1 from number of hints
        hintsNumb--;
      
        // get a random avaliable input and put its right letter in its value
        hintsInputs[randomIndexInput].value = hintsWord[randomIndexInput];
        // add active to the hinted input
        hintsInputs[randomIndexInput].classList.add("active_content_input");
      
        // put the new number of hints in button
        if (hintsNumb <= 1) {
          hintBtn.innerHTML = `${hintsNumb} Hint`;
        } else if (hintsNumb > 1) {
          hintBtn.innerHTML = `${hintsNumb} Hints`;
        }
      }
    }
  });

  // add click event on check word button
  checkBtn.addEventListener("click", _ => {
    // as defult true, and will change to false if the value is invalid, for the validat of the input value before check for the answer
    let validValue = true;
    // the valid value is from A to Z only
    let validType = /[A-Z]/;

    // select lis as array
    const listItems = Array.from(document.querySelectorAll(".game_container .main_form .list_item"));
    // select inputs as array of current li index
    const contentInputs = Array.from(listItems[indexListItem].childNodes[1].childNodes);
    
    // check for every input value if its between A to Z or not
    for (let i = 0; i < contentInputs.length; i++) {
      // is input value between A to Z? !true: !false; ! => to convert true to false and false to true
      if (!validType.test(contentInputs[i].value)) {
        // change validValue to false if input value not from A to Z
        validValue = false;
      }
    }

    // if validValue = true => then inputs value is valid so check for the answer, if false do nothing
    if (validValue) {
      checkValue();
    }
  });

  function checkValue() {
    // as defult true, and will change to false if the answer is wrong, to check if player won or need another try
    let rightAnswer = true;

    // select lis as array
    const listItems = Array.from(document.querySelectorAll(".game_container .main_form .list_item"));
    // select inputs as array of current li index
    const contentInputs = Array.from(listItems[indexListItem].childNodes[1].childNodes);

    // check every answer if in right place or not or not in the word
    for (let i = 0; i < contentInputs.length; i++) {
      // if letter is right and in place add best
      if (contentInputs[i].value === chosenWord[i]) {
        contentInputs[i].classList.add("best_content_input");

        // if letter is right but not in place add good and change rightAnswer to false to get another try
      } else if (chosenWord.includes(contentInputs[i].value)) {
        contentInputs[i].classList.add("good_content_input");
        rightAnswer = false;

        // if letter not exist in the word add bad and change rightAnswer to false to get another try
      } else {
        contentInputs[i].classList.add("bad_content_input");
        rightAnswer = false;
      }
    }
    
    // after check for the answer take action if player won or need another try or lost
    result(rightAnswer, listItems.length); // function takes value of rightAnswer(true/false), length of lis array => number of trys
  };

  function result(answer, trysLength) {
    // if the answer is right: true => print message in p tag in result container, run endGame function
    if (answer) {
      containerContent.innerHTML = `Congratulations! You won, The word was: <span class="content_color">${chosenWord}</span>`;
      endGame();
      // if the answer is wrong: false => +1 counter index for li, then check if there is another try or the player lost
    } else {
      indexListItem++;
      // as soon as counter index for li still less than li array length => there is another try so run handleInputs function
      if (indexListItem < trysLength) {
        handleInputs();
        // if counter index for li = li array length => there is no trys so print message in p tag in result container, run endGame function
      } else {
        containerContent.innerHTML = `Better luck next time! You lost, The word was: <span class="content_color">${chosenWord}</span>`;
        endGame();
      }
    }
  };

  // remove active from game container and add active to result container
  function endGame() {
    gameContainer.classList.remove("active_game_container");
    resultContainer.classList.add("active_result_container");
  };

  // add click event on reset button => reload the game (page)
  resetBtn.addEventListener("click", _ => {
    location.reload();
  });

}