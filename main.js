const playerBox = document.getElementById('player');
const enemyBox = document.getElementById('enemy');
const gameStatus = document.querySelector('.game-status');
const autoCreateBtn = document.getElementById('auto-create-btn');
const customCreateButtons = document.getElementById('ships-creating__buttons');
let creatingCountSpans = Array.from(document.querySelectorAll('.ships-creating__count'));


const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
const playerCells = {};
const enemyCells = {};

let side = Symbol();
playerCells[side] = 'player';
enemyCells[side] = 'enemy';

let ships = {};

let isShipPlaced = false;
let isCreationStage = true;
let isCreatingShip = false;
let actualCreatingSize;

const ENEMY_DELAY = 1000;  // Задержка, с которой ai будет выполнять действия (в ms)

const shipsCreatingCount = {
    single: 4,
    double: 3,
    triple: 2,
    quadruple: 1,

    getSum() {
        return this.single + this.double + this.triple + this.quadruple;
    }
}

const CLASS_NAMES = {
    cell: 'cell',
    ship: 'ship',
    missed: 'missed',
    exploded: 'exploded',
    blocked: 'blocked',
    hide: 'hide',
    hover: 'hover',
    row: 'row',
    preLaunch: 'pre-launch'
}


// Создание массива объектов cells
letters.forEach((letter) => {
    for (let i = 1; i <= 10; i++) {
        playerCells[`${letter}${i}`] = new Cell(letter, String(i));
        enemyCells[`${letter}${i}`] = new Cell(letter, String(i));
    }
});



// Отрисовка всех клеток-объектов
fieldDrawing(playerCells, playerBox);
fieldDrawing(enemyCells, enemyBox);

createShips(enemyCells, enemyBox)

autoCreateBtn.addEventListener('click', () => {
    ships.player = [];
    Object.keys(playerCells).forEach(cell => {
        playerCells[cell].isShip = false;
    });
    createShips(playerCells, playerBox);
    creatingFinish();
    fieldDrawing(playerCells, playerBox);
});


enemyBox.addEventListener('click', (event) => {
    if (!isShipPlaced) {
        gameStatus.innerHTML = 'Для начала установите корабли';
        return;
    }

    if (event.target.classList.contains(CLASS_NAMES.cell)) {
        let success = cellClick(event.target);
        if (success === undefined) return
        

        if (isLastShip('enemy')) {
            return victory();            
        }

        if (!success) {
            enemyBox.classList.add(CLASS_NAMES.blocked);
            gameStatus.innerHTML = 'Ход соперника!';
            return enemyShot();
        }  
               
    }
});

enemyBox.addEventListener('mouseover', (event) => {
    if (event.target.classList.contains(CLASS_NAMES.cell)) {
        event.target.classList.add(CLASS_NAMES.hover);
    }
});
enemyBox.addEventListener('mouseout', (event) => {
    if (event.target.classList.contains(CLASS_NAMES.hover)) {
        event.target.classList.remove(CLASS_NAMES.hover);
    }
});

function delay(ms) {
    return new Promise(res => {
        setTimeout(() => {
            res();
        }, ms)
    });
}

async function enemyShot() {
    let success;
    
    await delay(ENEMY_DELAY);
    success = await clickEmulation(playerCells);
    

    if (isLastShip('player')) {
        return loosing();            
    }
    
    await delay(ENEMY_DELAY);
    if (success) {
        return enemyShot();
    }
    enemyBox.classList.remove(CLASS_NAMES.blocked);
    gameStatus.innerHTML = 'Ваш ход!'
    
}

function isLastShip(side) {
    return ships[side].every(ship => ship.cells.every(cell => cell.isExploded));
}

function victory() {
    gameStatus.innerHTML = 'Вы Победили!';
    enemyBox.classList.add(CLASS_NAMES.blocked);
    playerBox.classList.add(CLASS_NAMES.blocked);

}

function loosing() {
    gameStatus.innerHTML = 'Вы проиграли!';
    playerBox.classList.add(CLASS_NAMES.blocked);
    enemyBox.classList.add(CLASS_NAMES.blocked);
}



// функция рисования клеток
function fieldDrawing(cells, box, success) {   
    
    fieldClear(cells);    
    
    letters.forEach((letter) => {
        let row = document.createElement('div');
        Object.keys(cells).filter(key => cells[key].row === letter).forEach(key => {
            let cell = document.createElement('div');
            cell.classList.add(CLASS_NAMES.cell);
            if (cells[key].isShip) {
                cell.classList.add(CLASS_NAMES.ship);
            }
            if (cells[key].isMissed) {
                cell.classList.add(CLASS_NAMES.missed);
            }
            if (cells[key].isExploded) {
                cell.classList.add(CLASS_NAMES.exploded);
            }
            if (cells[key].isHide) {
                cell.classList.add(CLASS_NAMES.hide);
            }
            cell.dataset.id = key;
            row.appendChild(cell);
        });
        row.classList.add(CLASS_NAMES.row);
        row.dataset.id = letter;
        box.append(row);
    });

    return (success)
}


function cellClick(event, cells = enemyCells) {
    
    if (event.nodeType !== 1) {
        event = event.target;
        console.log(event.target);
        
    }
   
    let cell = cells[event.dataset.id];
    
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
    
    return cellClick(findCellById(cell, cells[side]), playerCells);
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
    createSingleShips(cells, box, 4);
    createDoubleShips(cells, box, 3);
    createTripleShips(cells, box, 2);
    createQuadrupleShip(cells, box);
}


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



customCreateButtons.addEventListener('click', (event) => {
    event = event.target;
    if (!event.classList.contains('ships-creating__btn-block')) return;

    const textSizeArr = ['одно', 'двух', 'трёх', 'четырёх'];

    if (isCreationStage) {
        if (Number(event.parentNode.lastElementChild.innerHTML) > 0) {
            isCreatingShip = true;
            actualCreatingSize = Number(event.parentNode.dataset.size);
            gameStatus.innerHTML = `Установка ${textSizeArr[actualCreatingSize - 1]}палубного корабля..`;
            
        } else {
            gameStatus.innerHTML = `Вы установили максимальное количество ${textSizeArr[Number(event.parentNode.dataset.size) - 1]}палубных кораблей!`
        }
    }
    
    
    
});

playerBox.addEventListener('click', (event) => {

    if (isCreationStage) {
        event = event.target;        
        if (!event.classList.contains(CLASS_NAMES.cell)) return;

        let success = false;

        if (!isCreatingShip || !actualCreatingSize) {
            gameStatus.innerHTML = 'Вы не выбрали размер корабля для установки!';
            return;            
        }

        switch (actualCreatingSize) {
            case 1:
                if (createSingleShips(playerCells, playerBox, 1, event.dataset.id)) {
                    isCreatingShip = false;
                    actualCreatingSize = 0;
                    success = true;
                    creatingCountSpans.find(btn => btn.parentNode.dataset.size === String(1)).innerHTML = --shipsCreatingCount.single;   
                }
                break;
            case 2:
                if (createDoubleShips(playerCells, playerBox, 2, event.dataset.id, 1)) {
                    isCreatingShip = false;
                    actualCreatingSize = 0;
                    success = true;
                    creatingCountSpans.find(btn => btn.parentNode.dataset.size === String(2)).innerHTML = --shipsCreatingCount.double;
                    
                }
                break;
            case 3:
                if (createTripleShips(playerCells, playerBox, 3, event.dataset.id, 1)) {
                    isCreatingShip = false;
                    actualCreatingSize = 0;
                    success = true;
                    creatingCountSpans.find(btn => btn.parentNode.dataset.size === String(3)).innerHTML = --shipsCreatingCount.triple;
                    
                }
                break;
            case 4:
                if (createQuadrupleShip(playerCells, playerBox, 4, event.dataset.id, 1)) {
                    isCreatingShip = false;
                    actualCreatingSize = 0;
                    success = true;
                    creatingCountSpans.find(btn => btn.parentNode.dataset.size === String(4)).innerHTML = --shipsCreatingCount.quadruple;
                    
                }
                break;
        
            default:
                break;
        }

        if (success) {
            if (shipsCreatingCount.getSum() === 0) {
                return creatingFinish();
            } 
            gameStatus.innerHTML = `Продолжайте расстановку кораблей!`;
            return
        }

        gameStatus.innerHTML = 'Здесь установить корабль нельзя! Попробуйте снова'
        isCreatingShip = false;
        actualCreatingSize = 0;


    }
});


playerBox.addEventListener('dblclick', (event) => {
    event = event.target;
    if (!event.classList.contains(CLASS_NAMES.ship)) return;

    let ship = playerCells[event.dataset.id].identifyShip('player');
    if (ship.size === 'single') {
        gameStatus.innerHTML = 'Однопалубный корабль нельзя перевернуть';
        return;
    }

    let mainCell = ship.cells[0];

    let reversePosition; 
    if (ship.position === 'vertical') {
        reversePosition = 1
    } else {
        reversePosition = 0
    }

    ships.player = ships.player.filter(s => s.cells[0].id !== mainCell.id);
    ship.cells.map(cell => cell.isShip = false);
    let position;
    

    switch (ship.size) {
        case 'double':
            if (createDoubleShips(playerCells, playerBox, 1, mainCell.id, reversePosition)) {  
                gameStatus.innerHTML = 'Корабль успешно перевёрнут';
                return;
            }

            
            if (ship.position === 'vertical') position = 0;
            else position = 1;
            createDoubleShips(playerCells, playerBox, 1, mainCell.id, position);
            gameStatus.innerHTML = 'В данном месте нельзя перевернуть корабль.';
            return;

        case 'triple':
            if (createTripleShips(playerCells, playerBox, 1, mainCell.id, reversePosition)) { 
                gameStatus.innerHTML = 'Корабль успешно перевёрнут';
                return; 
            }

            if (ship.position === 'vertical') position = 0;
            else position = 1;
            createDoubleShips(playerCells, playerBox, 1, mainCell.id, position);
            gameStatus.innerHTML = 'В данном месте нельзя перевернуть корабль.';
            return;
        case 'quadruple':
            if (createQuadrupleShip(playerCells, playerBox, 1, mainCell.id, reversePosition)) {
                gameStatus.innerHTML = 'Корабль успешно перевёрнут';
                return;  
            }
            if (ship.position === 'vertical') position = 0;
            else position = 1;
            createDoubleShips(playerCells, playerBox, 1, mainCell.id, position);
            gameStatus.innerHTML = 'В данном месте нельзя перевернуть корабль.';
            
            return;
    
        default:
            break;
    } 
});

playerBox.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    event = event.target;
    if (!event.classList.contains(CLASS_NAMES.ship)) return;

    let ship = playerCells[event.dataset.id].identifyShip('player');
    mainCell = ship.cells[0];
    
    ships.player = ships.player.filter(s => s.cells[0].id !== mainCell.id);
    ship.cells.map(cell => cell.isShip = false);

    fieldDrawing(playerCells, playerBox);

    let sizes = ['single', 'double', 'triple', 'quadruple'];
    let size = sizes.indexOf(ship.size) + 1;
    let span = creatingCountSpans.find(btn => btn.parentNode.dataset.size === String(size));   
    span.innerHTML = Number(span.innerHTML) + 1;    
});


function creatingFinish() {
    gameStatus.innerHTML = 'Расстановка завершена. Для начала игры сделайте первый выстрел!';
    autoCreateBtn.disabled = true;
    isShipPlaced = true;
    isCreationStage = false;
    playerBox.classList.remove(CLASS_NAMES.preLaunch);
    creatingCountSpans.forEach(span => span.innerHTML = '0')
    customCreateButtons.classList.add(CLASS_NAMES.blocked);
}


function getCellCoordinates(cell) {
        
    return {
        x: letters.indexOf(cell.row),
        y: Number(cell.col)
    };
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

