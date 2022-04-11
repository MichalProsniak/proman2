import {boardsManager} from "./controller/boardsManager.js";
import {removeAllBoards} from "./controller/boardsManager.js";
import {domManager} from "./view/domManager.js";


function init() {
    boardsManager.loadBoards();
    domManager.addEventListener("#refresh", "click", refresh)

}

function refresh() {
    removeAllBoards()
    boardsManager.loadBoards();
}

init();
