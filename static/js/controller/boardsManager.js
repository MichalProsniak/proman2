import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";
import {changeColumnTitle} from "./cardsManager.js";
import {deleteButtonHandler} from "./cardsManager.js";

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
            domManager.addEventListener(`.board-add[data-board-id="${board.id}"]`, "click", addNewCard);
        }
    },
};
addNewBoard ()

function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    let button = document.querySelector(`.toggle-board-button[data-board-id="${boardId}"]`);
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

async function addNewBoard (){
    let boardBtn = document.getElementById('new-board')
    boardBtn.addEventListener('click', async function (){
    let titleValue = "New board"
    await dataHandler.addBoard(titleValue)
        let lastID = await dataHandler.getMaxId()
        const boards = await dataHandler.getBoards();
        for (let board of boards) { if (board.id == lastID[0].max){
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board);
            domManager.addChild("#all-boards", content);
            domManager.addEventListener(`.board-title[data-title-id="${board.id}"]`, "click", changeBoardTitle)
            domManager.addEventListener(
                `.toggle-board-button[data-board-id="${board.id}"]`,
                "click",
                showHideButtonHandler)}}})
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
