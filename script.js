const hiddenNums = [];
const nums = [];
let tries = 0;
let inGeneral = 0;
let inPlace = 0;
const flagColors = ["black", "#3A5F0B", "Maroon"];
const buttonColors = ["#FFB536", "rgb(132, 122, 27)", "rgb(186, 70, 16)"];
let flagMode = "black";

const inputFields = document.querySelectorAll("input");
const numberButtons = document.querySelectorAll(".num-btn");
const resultTable = document.querySelector("#result-table-content")

const modalWindow = document.querySelector("#modal-window");
const modalContentHeader = document.querySelector("#modal-content-header");
const modalContentTextBox = document.querySelector("#modal-content-text-box>div");

numberButtons.forEach(element => {
    element.addEventListener("click", (e) => {handleInput(e.target.innerText, e.target)});
});

inputFields.forEach(element => {
    element.addEventListener("input", (e) => {handleInput(e.target.value, -1,  e.target)});
});

function startGame(){
    createHiddenNums();
    inputFields.forEach(input => {
        input.value = "";
    });

    numberButtons.forEach(button => {
        button.style.backgroundColor = "#FFB536";
    })
    resultTable.replaceChildren();
    console.log(hiddenNums);
}
function createHiddenNums() {
    hiddenNums.length = 0;
    while(hiddenNums.length < 4) {
        let randomNumber = Math.floor(Math.random() * 10);
        if(!hiddenNums.includes(randomNumber)){
            hiddenNums.push(randomNumber);
        }
    }
}

function handleInput(input, button=-1, inputTag=-1){
    // If input was used instead of the button
    if(button === -1 && inputTag !== -1){
        numberButtons.forEach(btn => {
            if(btn.innerText == input){
                button = btn;
            }
        })
    }

    // Normal behavior in black flag mode
    if(flagMode === "black"){
        if(isNumber(input) && input.length < 2){
            let inputIndex = -1;
            if(inputTag !== -1){
                nums[Number(inputTag.classList[0]) - 1] = Number(input);
            }
            else{
                let inserted = false;
                for(let i = 0; i < nums.length; i++){
                    let element = nums[i];
                    if(element == undefined){
                        nums[i] = Number(input);
                        inputIndex = i;
                        inserted = true;
                        break;
                    }
                }
                if(!inserted){
                    nums.push(Number(input));
                }
            }
            updateScreen(input, button, inputIndex)
            if(nums.length === 4 && !nums.includes(undefined)){
                tries++;
                compareNumbers();
                updateTable()
                console.log(`Tries: ${tries}, Nums: ${nums} , Hidden nums: ${hiddenNums}, In place: ${inPlace}, In general: ${inGeneral}`);
                if(inPlace === 4){
                    victory();
                    startGame();
                }
                clearPreviousTry();
            }
        }
    }

    // Mark right numbers in green flag mode and wrong numbers in red flag mode
    else{
        let btnColor = flagMode === "green" ? buttonColors[1] : buttonColors[2];
        button.style.backgroundColor = button.style.backgroundColor == btnColor ? buttonColors[0] : btnColor;
    }
}

function isNumber(number){
    if(number.length == 1 && !isNaN(number)){
        return true;
    }
    return false;
}

function updateScreen(input, button, inputIndex=-1){
    if(inputIndex != -1){
        inputFields[inputIndex].value = input;
    }
    else{
        inputFields[nums.length - 1].value = input;
    }
    button.disabled = true;
}

function updateTable(){
    const newRow = document.createElement("tr");
    const tryData = [tries, nums.join(""), inGeneral, inPlace];
    for(var i = 0; i < 4; i++){
       const td = document.createElement("td");
       td.innerText = tryData[i];
       newRow.appendChild(td);
    }
    resultTable.prepend(newRow);
}

function compareNumbers(){
    for(i = 0; i < hiddenNums.length; i++){
        for(ii = 0; ii < nums.length; ii++){
            if(hiddenNums[i] === nums[ii]){
                if(i === ii){
                    inPlace ++;
                }
                inGeneral ++;
            }
        }
    }
}

function victory(){
    // Show victory modal window
    modalContentHeader.innerHTML = "\u2605 &nbsp;&nbsp; Victory! &nbsp;&nbsp; \u2605";

    const paragraph1 = document.createElement("p");
    paragraph1.classList.add("modal-content-text", "victory-text")
    paragraph1.innerText = `Hidden number: ${hiddenNums.join("")}`;
    const paragraph2 = document.createElement("p");
    paragraph2.classList.add("modal-content-text", "victory-text")
    paragraph2.innerText = `Tries: ${tries}`;

    modalContentTextBox.replaceChildren(paragraph1, paragraph2);
    modalWindow.style.display = "flex";

    tries = 0;
    resultTable.replaceChildren();
}

function clearPreviousTry(){
    nums.length = 0;
    inGeneral = 0;
    inPlace = 0;
    inputFields.forEach(field => {
        field.value = "";
    });
    numberButtons.forEach(button => {
        button.disabled = false;
    });
}

function erasePrevious(){
    if(nums.length > 0){
        inputFields[nums.length - 1].value = "";
        let previous = nums.pop();
        numberButtons.forEach(button => {
            if(button.innerText == previous){
                button.disabled = false;
            }
        });
    }
}

function showRules(){
    modalContentHeader.innerText = "Guess number rules";
    const childNodes = [];
    const helpText = ["The game’s goal is to decipher the secret four-digit code by trial and error.", "The digits in the secret number are unique (no repetition).", "To decipher code, you should input four-digit number and analyse the feedback in the table.", "Number of inputed digits that present in the secret number but stand in the wrong position are showed in “Guessed” column.", "Number of inputed digits that present in the secret number and in the correct position are showed in “In place” column.", "By pressing the '<' button you can erase the last character entered.", "Also, you can mark numbers in green or red by pressing the flag button to switch its mode. The flag has 3 modes:", "- Black (Guessing mode)", "- Green (Marking mode)", "- Red (Marking mode)", "In green and red flag modes, the buttons are not pressed."];
    for(let i = 0; i < helpText.length; i++){
        const paragraph = document.createElement("p");
        paragraph.classList.add("modal-content-text");
        paragraph.innerText = helpText[i];
        childNodes.push(paragraph);
    }
    modalContentTextBox.replaceChildren(...childNodes);
    modalWindow.style.display = "flex";
}

function hideModal(){
    modalWindow.style.display = "none";
}

function changeFlagMode(flag){
    if(flagMode == "black"){
        flagMode = "green";
        flag.style.color = flagColors[1];
        flag.style.backgroundColor = "#ed8d27";
    }
    else if(flagMode == "green"){
        flagMode = "red";
        flag.style.color = flagColors[2];
    }
    else{
        flagMode = "black";
        flag.style.color = flagColors[0];
        flag.style.backgroundColor = "#FFB536";
    }
}
