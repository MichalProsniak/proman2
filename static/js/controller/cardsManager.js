import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const statuses = await dataHandler.getStatuses();
        console.log(statuses)
        const cards = await dataHandler.getCardsByBoardId(boardId);
        console.log(cards)
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
                        `.card[data-card-id="${card.id}"]`,
                        "click",
                        deleteButtonHandler
                    );
                }
            }
        }
    },
};

function deleteButtonHandler(clickEvent) {
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
