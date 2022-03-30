import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";
import {changeColumnTitle} from "./cardsManager.js";
import {deleteButtonHandler} from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        console.log(boards)
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
            domManager.addEventListener(`.board-add[data-board-id="${board.id}"]`, "click", addNewCard);
            domManager.addEventListener(`.board-delete[data-board-id="${board.id}"]`, "click", deleteBoard);
        }
    },
};

function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    let button = document.querySelector(`.toggle-board-button[data-board-id="${boardId}"]`);
    console.log(button)
    if (button.innerText === "Show cards") {
        cardsManager.loadCards(boardId);
        button.innerText = "Hide cards";
    } else {
        let columns = document.querySelector(`.board-columns[data-board-id="${boardId}"]`);
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
        addBtn.addEventListener("click", async () => await addNewBoard(), foo())
}

async function foo (){
    modal.style.display = 'block';
  let addBtn = document.getElementById('add_board')
        addBtn.removeEventListener("click", async () => addNewBoard())
}

async function addNewBoard (){
    modal.style.display = 'none'
    let titleID = document.getElementById('board')
    let titleValue = titleID.value
    await dataHandler.addBoard(titleValue)
        const boards = await dataHandler.getBoards();
        for (let board of boards) { if (board.title == titleValue){
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board);
            domManager.addChild("#all-boards", content);
            domManager.addEventListener(`.board-title[data-title-id="${board.id}"]`, "click", changeBoardTitle)
            domManager.addEventListener(
                `.toggle-board-button[data-board-id="${board.id}"]`,
                "click",
                showHideButtonHandler)}
            domManager.addEventListener(`.board-add[data-board-id="${board.id}"]`, "click", addNewCard);
            domManager.addEventListener(`.board-delete[data-board-id="${board.id}"]`, "click", deleteBoard);
        }}
        modal.style.display = 'none'


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


async function addNewCard(clickEvent) {
    let boardId = clickEvent.target.dataset.boardId;
    let button = document.querySelector(`.toggle-board-button[data-board-id="${boardId}"]`);
    await dataHandler.createNewCard("New card", boardId, 1);
    let newCardData = await dataHandler.getNewCardData();
    if (button.innerText === "Hide cards") {
        let content = `<div class="card col${newCardData[0].status_id}" data-card-id="${newCardData[0].id}" >${newCardData[0].title}
                    <div class="card-remove" data-remove-card-id="${newCardData[0].id}">x</div>
                </div>`;
        domManager.addChild(`.board-column-content[data-column-id="${newCardData[0].board_id}${newCardData[0].status_id}"]`, content);
        domManager.addEventListener(`.board-column[data-column-id="${newCardData[0].board_id}${newCardData[0].status_id}"]`, "click", changeColumnTitle)
        domManager.addEventListener(
            `.card-remove[data-remove-card-id="${newCardData[0].id}"]`,
            "click",
            deleteButtonHandler
        );
    }
}

async function deleteBoard(clickEvent) {
    let boardId = clickEvent.target.dataset.boardId;
    await dataHandler.deleteBoard(boardId);
    let board = document.querySelector(`.board-container[data-board-id="${boardId}"]`);
    board.remove();
}
