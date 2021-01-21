

// Given a parent div HTML element, draw a new board inside the div with the given settings
function drawBoard(parentDiv, settings) {
    if(!isDivElement(parentDiv) || !isValidBoardSettings(settings)) throw new DOMException("Failed to draw board!");

    const board = document.createElement("CANVAS");

    // setup the board

    parentDiv.appendChild(board);
}

function isDivElement(elem) {
    return false;
}

function isValidBoardSettings(settingsObj) {
    return false;
}