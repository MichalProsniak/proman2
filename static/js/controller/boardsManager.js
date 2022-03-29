import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board);
            domManager.addChild("#all-boards", content);
            domManager.addEventListener(`.board-title[data-title-id="${board.id}"]`, "click", changeBoardTitle)
            domManager.addEventListener(
                `.toggle-board-button[data-board-id="${board.id}"]`,
                "click",
                showHideButtonHandler
            );
        }
    },
};

function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    let button = document.getElementsByClassName(`toggle-board-button`)[boardId-1];
    if (button.innerText === "Show cards") {
        cardsManager.loadCards(boardId);
        button.innerText = "Hide cards";
    } else {
        let columns = document.getElementsByClassName("board-columns")[boardId-1];
        columns.remove();
        let content = `<div class="board-columns" data-board-id="${boardId}"></div>`
        domManager.addChild(`.board[data-board-id="${boardId}"]`, content);
        button.innerText = "Show cards";
    }
}

function changeBoardTitle(clickEvent) {
    const boardId = clickEvent.target.attributes['data-title-id'].nodeValue;
    let element = document.querySelector(`.board-title[data-title-id='${boardId}']`)
    let oldTitle = element.innerText
    element.addEventListener('focusout', async () => {
        let title = element.innerText
        if (title === '') {
            element.innerText = 'no name'
            await dataHandler.renameBoard(boardId, 'no name')
        } else if (title !== oldTitle || title === oldTitle) {
            await dataHandler.renameBoard(boardId, title)
        }
    })
}


// Get modal element
var modal = document.getElementById('boardMdl');
// Get open modal button
var modalBtn = document.getElementById('mdlButton');
// Get close button
var closeBtn = document.getElementsByClassName('closeBtn')[0];

// Listen for open click
modalBtn.addEventListener('click', openModal);
// Listen for close click
closeBtn.addEventListener('click', closeModal);
// Listen for outside click
window.addEventListener('click', outsideClick);

// Open modal
function openModal(){
  modal.style.display = 'block';
  let addBtn = document.getElementById('add_board')
        addBtn.addEventListener("click", async () => addNewBoard())
}

async function addNewBoard (){
    let titleID = document.getElementById('board')
    let titleValue = titleID.value
    await dataHandler.addBoard(titleValue)
    clear ()
    await boardsManager.loadBoards()
    modal.style.display = 'none'
}
function clear(){
    let boards = document.getElementsByClassName("board-container")
    console.log (boards.length)
    while (boards.length>0){
        boards[0].remove()
    }
}

// Close modal
function closeModal(){
  modal.style.display = 'none';
}

// Click outside and close
function outsideClick(e){
  if(e.target == modal){
    modal.style.display = 'none';
  }
}
