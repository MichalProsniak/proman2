import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const statuses = await dataHandler.getStatuses();
        const cards = await dataHandler.getCardsByBoardId(boardId);
        console.log (cards)
        for (let column of statuses) {
            const columnBuilder = htmlFactory(htmlTemplates.status)
            const columnsContent = columnBuilder(column, boardId)
            domManager.addChild(`.board-columns[data-board-id="${boardId}"]`, columnsContent);
            for (let card of cards) {
                if (card.status_id === column.id) {
                    const cardBuilder = htmlFactory(htmlTemplates.card);
                    const content = cardBuilder(card, column);
                    domManager.addChild(`.board-column-content[data-column-id="${boardId}${column.id}"]`, content);
                    domManager.addEventListener(`.board-column-title[data-column-id="${boardId}${column.id}"]`, "click", changeColumnTitle)
                    domManager.addEventListener(
                        `.card-remove[data-remove-card-id="${card.id}"]`,
                        "click",
                        deleteButtonHandler
                    );
                }
            }
        }
    },
};

export async function deleteButtonHandler(clickEvent) {
    const cardId = clickEvent.target.dataset.removeCardId
    let allCards = document.getElementsByClassName("card")
    for (let card of allCards) {
        if (card.dataset.cardId === cardId) {
            card.remove();
            break;
        }
    }
    await dataHandler.deleteSpecificCard(cardId)
}

export function changeColumnTitle(clickEvent) {
    let statusId = clickEvent.target.dataset.statusId;
    let element = document.querySelector(`.board-column-title[data-status-id='${statusId}']`)
    element.addEventListener('focusout', async () => {
        let title = element.innerText
        if (title === '') {
            title = 'no name'
        }
        await dataHandler.renameColumn(statusId, title)
        let all_columns = document.querySelectorAll(`.board-column-title[data-status-id="${statusId}"]`);
        for (let column of all_columns) {
            column.innerText = title
        }
    })
}

// async function newColumn (board_id){
//     let clmButton = document.getElementById(`clmbutton${board.id}`)
//     document.addEventListener("click", addColumn())
// }
//
// function addColumn (board_id){
//
// }
