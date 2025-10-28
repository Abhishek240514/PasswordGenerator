const inputSlider = document.querySelector("[data-len-slider]");
const lengthdisplay = document.querySelector("[data-length]");
const datapassworddisplay = document.querySelector("[data-password-Display]");
const copybutton = document.querySelector("[datacopy]");
const copymessage = document.querySelector("[data-copy-message]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generateButton = document.querySelector(".Generate-Button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const sym = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLen = 10;
let checkcount = 0;

// initialize slider and UI
handleSlider();
setIndicator("#ccc"); // start indicator as grey

// Update slider and length text
function handleSlider() {
    inputSlider.value = passwordLen;
    lengthdisplay.innerText = passwordLen;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLen -min)*100/(max - min)) + "% 100%"; //this give the width of the background of the slider and the other one is for height
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// Generate random integer in [min, max)
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function GetRandomNum() {
    return getRndInteger(0, 10); // 0–9 inclusive
}

function GetLowercase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function GetUppercase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function GenerateSymbol() {
    const Randomnum = getRndInteger(0, sym.length);
    return sym.charAt(Randomnum);
}

// calculate password strength indicator color
function calcStrength() {
    let hasupper = uppercaseCheck.checked;
    let haslower = lowercaseCheck.checked;
    let hassymbols = symbolCheck.checked;
    let hasnum = numberCheck.checked;

    if (haslower && hasupper && (hasnum || hassymbols) && passwordLen >= 8) {
        setIndicator("#0f0"); // strong
    } else if ((haslower || hasupper) && (hasnum || hassymbols) && passwordLen >= 6) {
        setIndicator("#ff0"); // medium
    } else {
        setIndicator("#f00"); // weak
    }
}

// copy password to clipboard
async function copyContent() {
    try {
        await navigator.clipboard.writeText(datapassworddisplay.value);
        copymessage.innerText = "Copied";
    } catch (e) {
        copymessage.innerText = "Failed";
    }
    copymessage.classList.add("active");
    setTimeout(() => {
        copymessage.classList.remove("active");
    }, 2000);
}

// track how many checkboxes are checked
function handleCheckboxChange() {
    checkcount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) checkcount++;
    });

    // if checkboxes > password length, adjust slider
    if (passwordLen < checkcount) {
        passwordLen = checkcount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckboxChange);
});

inputSlider.addEventListener("input", (e) => {
    passwordLen = e.target.value;
    handleSlider();
});

copybutton.addEventListener("click", () => {
    if (datapassworddisplay.value) copyContent();
});

// Fisher–Yates shuffle
function shufflePass(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join("");
}

// Generate button click
generateButton.addEventListener("click", () => {
    if (checkcount <= 0) return;

    if (passwordLen < checkcount) {
        passwordLen = checkcount;
        handleSlider();
    }

    // reset password
    password = "";

    // collect checked generators
    const funarr = [];
    if (uppercaseCheck.checked) funarr.push(GetUppercase);
    if (lowercaseCheck.checked) funarr.push(GetLowercase);
    if (numberCheck.checked) funarr.push(GetRandomNum);
    if (symbolCheck.checked) funarr.push(GenerateSymbol);

    // compulsory addition: ensure each selected type is used once
    for (let i = 0; i < funarr.length; i++) {
        password += funarr[i]();
    }

    // remaining characters
    for (let i = 0; i < passwordLen - funarr.length; i++) {
        let randIndex = getRndInteger(0, funarr.length);
        password += funarr[randIndex]();
    }

    // shuffle the password
    password = shufflePass(Array.from(password));

    // display in UI
    datapassworddisplay.value = password;

    // update strength color
    calcStrength();
});
