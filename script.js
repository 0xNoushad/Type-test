const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");
let quote = "", time = 60, timer = "", mistakes = 0;

const renderNewQuote = async () => {
  const { content } = await (await fetch(quoteApiUrl)).json();
  quote = content;
  quoteSection.innerHTML = quote.split("").map(value => `<span class='quote-chars'>${value}</span>`).join("");
};

const checkQuote = () => {
  const quoteChars = Array.from(document.querySelectorAll(".quote-chars"));
  const userInputChars = userInput.value.split("");
  quoteChars.forEach((char, index) => {
    if (char.innerText == userInputChars[index]) char.classList.add("success");
    else if (!userInputChars[index]) char.classList.remove("success", "fail");
    else {
      if (!char.classList.contains("fail")) mistakes++;
      char.classList.add("fail");
      document.getElementById("mistakes").innerText = mistakes;
    }
  });
  if (quoteChars.every(element => element.classList.contains("success"))) displayResult();
};

const updateTimer = () => {
  if (time === 0) displayResult();
  else document.getElementById("timer").innerText = --time + "s";
};

const startTest = () => {
  mistakes = 0;
  time = 60;
  timer = setInterval(updateTimer, 1000);
  userInput.disabled = false;
  document.getElementById("start-test").style.display = "none";
  document.getElementById("stop-test").style.display = "block";
};

const displayResult = () => {
  clearInterval(timer);
  userInput.disabled = true;
  document.querySelector(".result").style.display = "block";
  document.getElementById("stop-test").style.display = "none";
  const timeTaken = time ? (60 - time) / 100 : 1;
  document.getElementById("wpm").innerText = (userInput.value.length / 5 / timeTaken).toFixed(2) + " wpm";
  document.getElementById("accuracy").innerText = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + " %";
};

window.onload = () => {
  userInput.value = "";
  document.getElementById("start-test").style.display = "block";
  document.getElementById("stop-test").style.display = "none";
  userInput.disabled = true;
  renderNewQuote();
};

userInput.addEventListener("input", checkQuote);
