import allQuests from '../js-assets/quest-list.js';
import userDisplay from '../js-assets/user-display.js';
// In general, work towards converting your code comments (these are great) 
// into code by wrapping the code in named and called functions or
// assigning it to a named variable. This will also expose and remove
// excess code duplication.


// For example, this action on 15 and 16 is performed three
// different times in different .js files in your app.
// It would be easy to call it just as you've named it: 
// const player = getPlayerObjectFromStorage();

// Get player object from localStorage
const json = window.localStorage.getItem('player');
const player = JSON.parse(json);

userDisplay(player);

const questDescription = document.getElementById('quest-description');
const questOptions = document.getElementById('quest-options');
const mapLink = document.getElementById('map-link');

// Search URL looks for HTML?quest=
const searchURL = window.location.search;
const searchParams = new URLSearchParams(searchURL);
const questTitleToFind = searchParams.get('quest');
// Something to consider; its important to distinguish your domain concepts from
// language keywords; 'element' is both html and your domain;
// perhaps specify 'natureElement' or 'avatarElement' or the like.
let elementToFind = searchParams.get('element');

// Set CSS to current element
const mapElement = document.getElementById('quest-element');
mapElement.href = './src/elements-css/' + elementToFind + '.css';

// Another good opportunity for TDD
// For loop sets current quest the user chose to be displayed on the page
let currentQuest = null;
for(let i = 0; i < allQuests[elementToFind + 'Quests'][1].length; i++) {
    const questTitle = allQuests[elementToFind + 'Quests'][1][i].questTitle;
    // Defining current quest
    if(questTitle === questTitleToFind) {
        currentQuest = allQuests[elementToFind + 'Quests'][1][i];
        break;
    }
}

const questTitle = document.getElementById('quest-title');
questTitle.textContent = currentQuest.questTitle;

// add quest description to page
const descriptionP = document.createElement('p');
descriptionP.textContent = currentQuest.questDescription;
questDescription.appendChild(descriptionP);

//creates answer  choices as radio buttons 
for(let i = 0; i < currentQuest.questChoices.length; i++) {
    const choiceLabel = document.createElement('label');
    const choiceInput = document.createElement('input');

    choiceInput.type = 'radio';
    choiceInput.name = 'options';
    choiceInput.value = i;
    choiceInput.required = true;

    questOptions.appendChild(choiceLabel);
    choiceLabel.textContent = currentQuest.questChoices[i].choiceDescription;
    choiceLabel.prepend(choiceInput);
}

// creat submit button
const button = document.createElement('button');
button.textContent = 'submit';
questOptions.appendChild(button);
mapLink.href = 'map.html?element=' + elementToFind;

// player submits answer choes
questOptions.addEventListener('submit', function(event) {
    event.preventDefault();
    // After button click, clear out the options
    // Replace with "result" text
    const questOptionsFormData = new FormData(questOptions);
    const chosen = questOptionsFormData.get('options');
    
    // this removes currentQuest form incompleteQuests
    for(let i = 0; i < player.incompleteQuests[elementToFind + 'Quests'].length; i++) {
        const questTitle = player.incompleteQuests[elementToFind + 'Quests'][i];
        if(questTitle === questTitleToFind) {
            player.incompleteQuests[elementToFind + 'Quests'].splice(i, 1);
        }
    }

    // removes current/completed element from player.element if quests are completed
    if(player.incompleteQuests[elementToFind + 'Quests'].length === 0) {
        const mastered = player.element.shift();
        player.masteredElements.push(mastered);
        elementToFind = player.element[0];
        mapLink.href = 'map.html?element=' + elementToFind;
    }
    
    // Check if elements array is empty > then go to results.html
    if(player.element.length === 0) {
        mapLink.href = 'results.html';
        mapLink.textContent = 'See Results';
    }

    // update player score in store it in local Storage
    player.score += currentQuest.questChoices[chosen].choicePoints;
    const json = JSON.stringify(player);
    window.localStorage.setItem('player', json);

    // remove answer 
    descriptionP.textContent = currentQuest.questChoices[chosen].choiceResult;
    questOptions.remove();


});