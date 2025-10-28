const inputSlider = document.querySelector("[data-len-slider]");
//this is query selection from custiom attribute
const lengthdisplay = document.querySelector("[data-length]");

const datapassworddisplay = document.querySelector("[data-password-Display]");
const copybutton = document.querySelector("[datacopy]");
const copymessage = document.querySelector("[data-copy-message]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowecase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generateButton = document.querySelector(".Generate-Button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const sym = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/'

let password ="";
let passwordLen = 10; 
let checkcount = 1;
handleSlider();
//set circlr colour to grey in start

//set password length 
function handleSlider(){
    inputSlider.value = passwordLen;
    lengthdisplay.innerText = passwordLen;
}

function setIndicator(color){
    indicator.computedStyleMap.backgroundColor = color;
    //shadow in HW
}
function getRndInteger(min, max){
    return Math.floor(Math.random()*(max-min))+min;
    //Math.random 0 se 1 ke beech number generate kar ke deta hai a
}
function GetRandomNum(){
    return getRndInteger(0,9);
}
function GetLowercase(){
    return String.fromCharCode(getRndInteger(97,123));
}
function GetUppercase(){
    return String.fromCharCode(getRndInteger(65,90));
}
function GenerateSymbol(){
    const Randomnum = getRndInteger(0,Sym.length);
    return Sym.charAt(Randomnum);
}
function calcStrength(){
    let hasupper = false;
    let haslower = false;
    let hassymbols = false;
    let hasnum = false;
    if(uppercaseCheck.checked) hasupper = true;//By the use of . checked property we can see if the checkbox is checked or not 
    if(lowercaseCheck.checked) haslower = true;
    if(numberCheck.checked) hasnum = true;
    if(symbolCheck.checked) hassymbols = true;

    if(haslower && hasupper &&(hasnum||hassymbols) && passwordLen >= 8) {
        setIndicator("#0f0");
    }
    else if(
        (haslower||hasupper)&&
        (hasnum||hassymbols)&&
        passwordLen>=6 
    ){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}
async function copyContent(){
    try{
        await navigator.clipboard.writeText(datapassworddisplay.value);
        copymessage.innerText = "Copied";
    }
    catch(e){
        copymessage.innerText = "Failed";
    }
    //To make copied text visible 
    copymessage.classList.add("active");
    setTimeout(()=>{
        copymessage.classList.remove("active");
    }, 2000)
}
function handleCheckboxChange(){
    checkcount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkcount++;
        }
    });
    //special condition
    if(checkcount>passwordLen){
        passwordLen = checkcount;
        handleSlider();
    }
}
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change', handleCheckboxChange);
})
inputSlider.addEventListener('input', (e)=>{
    passwordLen = e.target.value;//here e represents the slider element
    handleSlider();
})
copybutton.addEventListener('click', ()=>{
    if(datapassworddisplay.value) copyContent();
})
generateButton.addEventListener('click', ()=>{

})