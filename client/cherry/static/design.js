/*
* this is just the design
* it makes things look fancy
*/

// set the theme for bootstrap
function setTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme)
    const chat = document.getElementById("chat");
    if (theme == "dark") {
        chat.classList.add("bg-dark");
    } else {
        chat.classList.remove("bg-dark");
    }
}

// show the key popover
function showElement(element) {
    const shown = element.cloneNode(true);
    shown.style.display = 'block';
    shown.lastElementChild.id = "send-key"

    return shown
}

// do the random effect things
function randomEffect(element) {
    const original = element.querySelector('#original').textContent
    const text = element.querySelector('.toast-body').textContent

    for (let i = 0; i < original.length+1; i++) {
        setTimeout(() => {
            element.querySelector('.toast-body').textContent = revealText(text, original.length - i)
        }, i * 70) // is this right
    }
}

// reveal only a certain portion of the text
function revealText(text, i) {
    const randomized = randomizeText(i);
    let revealed = "";
    for (let j = 0; j < i; j++) {
        revealed += randomized[j];
    }
    for (let j = revealed.length; j < text.length; j++) {
        revealed += text[j];
    }

    return revealed
}

// create randomized text
function randomizeText(length) {
    // uses the base 64 char set
    const characterCollection = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let randomized = "";
    for(var i = 0; i < length; i++)
    {
        randomized += characterCollection[ Math.floor( Math.random() * characterCollection.length ) ];
    }

    return randomized;
}

// scroll to the botton of the chat log
function scrollToBottom() {
    var chatbox = document.getElementById('chatbox');
    
    if (chatbox.lastElementChild !== null) {
        // Scroll to the bottom with smooth animation
        chatbox.lastElementChild.scrollIntoView({ behavior: 'smooth' });
    }
}
