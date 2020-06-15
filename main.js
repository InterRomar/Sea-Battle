const playerBox = document.querySelectorAll('.game-box')[0];
const enemyBox = document.querySelectorAll('.game-box')[1];
const gameStatus = document.querySelector('.game-status');
const autoCreateBtn = document.getElementById('auto-create-btn');
let creatingInfo = document.querySelector('.ships-creating__info');

let start = document.getElementById('start');

let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
let side = Symbol();

let playerCells = {};
playerCells[side] = 'player';
let enemyCells = {};
enemyCells[side] = 'enemy';
let ships = {};

let isShipPlaced = false;

const ENEMY_DELAY = 1000;  // Задержка, с которой ai будет выполнять действия (в ms)

// Создание массива объектов cells
letters.forEach((letter, idx) => {
    for (let i = 1; i <= 10; i++) {
        playerCells[`${letter}${i}`] = new Cell(letter, String(i));
        enemyCells[`${letter}${i}`] = new Cell(letter, String(i));
    }
});



// Отрисовка всех клеток-объектов
fieldDrawing(playerCells, playerBox).then(() => {
    autoCreateBtn.addEventListener('click', () => {
        createShips(playerCells, playerBox);
        autoCreateBtn.disabled = true;
        isShipPlaced = true;
        creatingInfo.innerHTML = 'Приятной игры.';
        gameStatus.innerHTML = 'Для начала игры просто сделайте первый выстрел!'
    });
});
fieldDrawing(enemyCells, enemyBox).then(() => createShips(enemyCells, enemyBox));


enemyBox.addEventListener('click', async (event) => {
    if (!isShipPlaced) {
        gameStatus.innerHTML = 'Для начала установите корабли';
        return;
    }

    if (event.target.classList.contains('cell')) {
        let success = await cellClick(event.target);
        if (success === undefined) return
        

        if (isLastShip('enemy')) {
            return victory();            
        }

        if (!success) {
            enemyBox.classList.add('blocked');
            gameStatus.innerHTML = 'Ход соперника!';
            return enemyShot();
        }  
               
    }
} )

enemyBox.addEventListener('mouseover', (event) => {
    if (event.target.classList.contains('cell')) {
        event.target.classList.add('hover');
    }
});
enemyBox.addEventListener('mouseout', (event) => {
    if (event.target.classList.contains('hover')) {
        event.target.classList.remove('hover');
    }
});


async function enemyShot() {
    let success;
    setTimeout(async () => {
        success = await clickEmulation(playerCells);
    }, ENEMY_DELAY);

    if (isLastShip('player')) {
        return loosing();            
    }
    
    setTimeout(() => {
        if (success) {
            return enemyShot();
        }
        enemyBox.classList.remove('blocked');
        gameStatus.innerHTML = 'Ваш ход!'
    }, ENEMY_DELAY);
    
}

function isLastShip(side) {
    return ships[side].every(ship => ship.cells.every(cell => cell.isExploded));
}

function victory() {
    gameStatus.innerHTML = 'Вы Победили!';
    enemyBox.classList.add('blocked');
    playerBox.classList.add('blocked');

}

function loosing() {
    gameStatus.innerHTML = 'Вы проиграли!';
    playerBox.classList.add('blocked');
    enemyBox.classList.add('blocked');
}



// функция рисования клеток
function fieldDrawing(cells, box, success) {   
    
    fieldClear(cells);    

    return new Promise(resolve => {
        letters.forEach((letter, idx) => {
            let row = document.createElement('div');
            Object.keys(cells).filter(key => cells[`${key}`].row === letter).forEach(key => {
                let cell = document.createElement('div');
                cell.classList.add('cell');
                if (cells[`${key}`].isShip) {
                    cell.classList.add('ship');
                }
                if (cells[`${key}`].isMissed) {
                    cell.classList.add('missed');
                }
                if (cells[`${key}`].isExploded) {
                    cell.classList.add('exploded');
                }
                if (cells[`${key}`].isHide) {
                    cell.classList.add('hide');
                }
                cell.dataset.id = key;
                row.appendChild(cell);
            });
            row.classList.add('row');
            row.dataset.id = letter;
            box.append(row);
        });

        resolve(success);
    });
}


function cellClick(event, cells = enemyCells) {
    
    if (event.nodeType !== 1) {
        event = event.target;
        console.log(event.target);
        
    }
   
    let cell = cells[`${event.dataset.id}`];
    
    if (cell.isMissed || cell.isExploded) {
        console.log(`repeat click, return null `);
        return
    }

    let success = false;
    cell.isHide = false;
    let x = letters.indexOf(cell.row),
        y = Number(cell.col);

    if (!cell.isShip) {
        cell.isMissed = true;
    } else if (cell.isShip) {
        success = true;
        cell.isExploded = true;
        rightHit(x, y, cells);

        let ship = cell.identifyShip(cells[side].toString());
        
        ship.checkState(cells);
    }  

    if (cells[side] === 'player') {
        return fieldDrawing(cells, playerBox, success);    
    }
    
    return fieldDrawing(cells, enemyBox, success);    
}

function findCellById(id, side) {     // функция возвращает node элемент
    let cells = document.querySelectorAll(`.${side} .cell`);
    return Array.from(cells).find(cell => cell.dataset.id === id);
}


function clickEmulation(cells) {
    let cell = getRandomCell();
    
    if (cells[cell].isMissed || cells[cell].isExploded) {
       return clickEmulation(cells);
    }
    
    return cellClick(findCellById(cell, cells[side].toString()), playerCells);
}

// Функция очистки поля
function fieldClear(cells) {
    
    if (cells[side] === 'player') {
        let rows = document.querySelectorAll('.player .row');
        if (rows) {
            rows.forEach(col => col.remove());
        }
    } else {
        let rows = document.querySelectorAll('.enemy .row');
        if (rows) {
            rows.forEach(col => col.remove());
        } 
    }
}


function createShips(cells, box) {
    createSingleShips(cells, box);
    createDoubleShips(cells, box);
    createTripleShips(cells, box);
    createQuadrupleShip(cells, box);
}
let container = document.getElementById('container');


function rightHit(x, y, cells) {
    let arr = [[x - 1, y - 1], [x + 1, y - 1 ], [x - 1, y + 1], [x + 1, y + 1]];
    let currentCoords = [x, y];

    // Все 8 клеток вокруг выбранной
    let fullRing = getCoordinates(x, y).single.vertical.filter(arr => arr.join('') !== currentCoords.join(''));  

    let currentCell = cells[`${letters[x]}${y}`];
    
    if (currentCell.size === 1) {
        arr = fullRing;
    }

    arr.forEach(coords => {
        let letter = letters[coords[0]],
            number = coords[1],
            cell = cells[`${letter}${number}`];
        if (cell) {
            cell.isHide = false;
            cell.isMissed = true;
        }
    });

    if (cells[side] === 'player') {
        return fieldDrawing(cells, playerBox);    
    } else {
        return fieldDrawing(cells, enemyBox);    
    }

}




function getRandomCell() {
    const letter = letters[Math.floor(Math.random() * Math.floor(10))];
    const number = String(Math.floor(Math.random() * Math.floor(11)));
    if (number !== '0') {
        return letter + number;
    } 
    return getRandomCell();
}

function getRandom(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
