import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const statuses = await dataHandler.getStatuses();
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let column of statuses) {
            const columnBuilder = htmlFactory(htmlTemplates.status)
            const columnsContent = columnBuilder(column, boardId)
            domManager.addChild(`.board-columns[data-board-id="${boardId}"]`, columnsContent);
            for (let card of cards) {
                if (card.status_id === column.id) {
                    const cardBuilder = htmlFactory(htmlTemplates.card);
                    const content = cardBuilder(card, column);
                    domManager.addChild(`.board-column-content[data-column-id="${boardId}${column.id}"]`, content);
                    domManager.addEventListener(`.board-column-content[data-column-id="${boardId}${column.id}"]`, "click", changeColumnTitle)
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

async function deleteButtonHandler(clickEvent) {
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


function changeColumnTitle(clickEvent) {
    const columnId = clickEvent.target.attributes['data-column-id'].nodeValue[0];

    let element = document.querySelector(`.board-column-title[data-column-id='${columnId}']`)
    let oldTitle = element.innerText
    element.addEventListener('focusout', async () => {
        let title = element.innerText
        if (title === '') {
            element.innerText = 'no name'
            await dataHandler.renameColumn(columnId, 'no name')
        } else if (title !== oldTitle || title === oldTitle) {
            await dataHandler.renameColumn(columnId, title)
        }
    })
}
