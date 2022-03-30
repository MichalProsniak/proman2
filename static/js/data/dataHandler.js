export let dataHandler = {
    getBoards: async function () {
        return await apiGet("/api/boards");
    },
    getBoard: async function (boardId) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: async function () {
        return await apiGet(`api/statuses`);
    },
    getStatus: async function (statusId) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}/cards/`);
    },
    getCard: async function (cardId) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: async function (boardTitle) {
        // creates new board, saves it and calls the callback function with its data
    },
    createNewCard: async function (cardTitle, boardId, statusId) {
        return await apiPost(`/api/${boardId}/${statusId}/${cardTitle}`);
    },
    renameBoard: async function(boardId, boardTitle) {
        await apiPost(`/rename-board-by-id/${boardId}/${boardTitle}`)
    },
    renameColumn: async function(statusId, columnTitle) {
        await apiPost(`/rename-column-by-id/${statusId}/${columnTitle}`)
    },
    deleteSpecificCard: async function(cardId) {
        await apiPost(`/delete-card/${cardId}`)
    },
    addBoard: async function (boardTitle){
        console.log ('new board')
        await apiPost(`/add-board/${boardTitle}`)
    },
    getNewCardData: async function (){
        return await apiGet(`/api/new-card`)
    },
    getMaxId: async function (){
        return await apiGet(`/api/max-id`)
    },
    deleteBoard: async function (boardId){
        await apiPost(`/api/delete-board/${boardId}`)
    },
    addNewColumn: async function () {
        await apiPost(`/api/add-new-column`)
    },
    newColumnData: async function () {
        return apiGet('/api/new-column')
    },
    getAllBoardsIds: async function () {
        return apiGet('/api/all-boards-ids')
    }
};

async function apiGet(url) {
    let response = await fetch(url, {
        method: "GET",
    });
    if (response.ok) {
        return await response.json();
    }
}

async function apiPost(url) {
    await fetch(url, {
        method: 'POST',
    })
}

async function apiDelete(url) {
}

async function apiPut(url) {
}

async function apiPatch(url) {
}
