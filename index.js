// Import methods from Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// Define your DB url
const appSettings = {
    databaseURL: "https://playground-9c7b7-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

//Save Firebase functions
const app = initializeApp(appSettings)
const database = getDatabase(app)
const messagesInDB = ref(database, "messages")


//DOM
const textAreaEl = document.getElementById("message-box")
const toEl = document.getElementById("to-input")
const fromEl = document.getElementById("from-input")
const likeEl = document.querySelector(".heart")
const likeCounterEl = document.querySelector(".like-counter")
const formEl = document.getElementById('message-form');
const messagesEl = document.getElementById("messages")

//Publish Button
formEl.addEventListener("submit", (event) => {
  event.preventDefault()
  let messageValue = textAreaEl.value
  let toValue = toEl.value
  let fromValue = fromEl.value

  //Create a message object
  const messageObject = {
    message: messageValue,
    to: toValue,
    from: fromValue
  }

  // Push the message object into the DB
  push(messagesInDB, messageObject)
  clearAllValues()
})

//Update DB
onValue(messagesInDB, function(snapshot) {
  if (snapshot.exists()) {
    clearMessagesEl();

    // The snapshot.val() => nested object with the message, to, and from
    const messagesArray = Object.values(snapshot.val()).reverse();

    // Iterate through each messageObject
    messagesArray.forEach((messageObject) => {
      renderMessages(messageObject.message, messageObject.to, messageObject.from);
      renderLikes();
    });
  } else {
    messagesEl.innerHTML = `<p class="white-font">No endorsements... yet</p>`;
  }
});

//Clear Textarea & Inputs
function clearAllValues() {
  textAreaEl.value = ""
  toEl.value = ""
  fromEl.value = ""
}

//Clear innerHTML (Old DB)
function clearMessagesEl() {
  messagesEl.innerHTML = ""
}


// Render Lkes
function renderLikes() {
  //Select only new messages that do not have click event on heart icon
  const likeEls = document.querySelectorAll(".fa-heart:not(.click-bound)");

  likeEls.forEach((heartIcon) => {
    heartIcon.addEventListener("click", () => {
      
      const likeCounter = heartIcon.nextElementSibling || heartIcon.parentElement;
    
      let likesCount = parseInt(likeCounter.textContent) || 0;
      likesCount++;
      likeCounter.textContent = likesCount.toString();
      heartIcon.classList.add("disabled")

    });
    
    heartIcon.classList.add("click-bound");
  });
}

// Render Messages in HTML
function renderMessages(message, to, from) {
  let messageHtml = `<div class="messages-wrapper">
                        <p class="to">To ${to}</p>
                        <p class="message-content">${message}</p>
                        <div class="heart-div">
                          <p class="from">From ${from} </p>
                          <p class="like-counter"><i class="fa-solid fa-heart"></i> <span class="likes-count">0</span></p>
                        </div>
                      </div>`;
  messagesEl.insertAdjacentHTML("beforeend", messageHtml);
  renderLikes();
}
