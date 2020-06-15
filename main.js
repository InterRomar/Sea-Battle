let playerBox = document.querySelectorAll('.game-box')[0];
let enemyBox = document.querySelectorAll('.game-box')[1];
// let box = document.querySelectorAll('.game-box')[1];
let playerBtn = document.getElementById('playerBtn');
let enemyBtn = document.getElementById('enemyBtn');

let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
let side = Symbol();

let playerCells = {};
playerCells[side] = 'player';
let enemyCells = {};
enemyCells[side] = 'enemy';
let ships = {};


// Создание массива объектов cells
letters.forEach((letter, idx) => {
    for (let i = 1; i <= 10; i++) {
        playerCells[`${letter}${i}`] = new Cell(letter, String(i));
        enemyCells[`${letter}${i}`] = new Cell(letter, String(i));
    }
});

// Отрисовка всех клеток-объектов
fieldDrawing(playerCells, playerBox);
fieldDrawing(enemyCells, enemyBox);

enemyBox.addEventListener('click', (event) => {
    if (event.target.classList.contains('cell')) {
        cellClick(event.target);
    }
} )



function cellsListener() {    // Назначение обработчика событий (применяется каждый раз после отрисовки поля)
    let cellsDOM = document.querySelectorAll('.cell');
    cellsDOM.forEach(cell => {
        cell.addEventListener('click', cellClick);
    })
}

// функция рисования клеток
function fieldDrawing(cells, box) {   
    
    fieldClear(cells);    

    return new Promise(resolve => {
        letters.forEach((letter, idx) => {
            let col = document.createElement('div');
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
                cell.setAttribute('id', `${key}`);
                col.appendChild(cell);
            });
            col.classList.add('col');
            col.setAttribute('id', `${letter}`);
            box.append(col);
        });

        resolve();
    });
}


function cellClick(event, cells = enemyCells) {
    
    if (event.nodeType !== 1) {
        event = event.target;
        console.log(event.target);
        
    }
   
    let cell = cells[`${event.id}`];
    
    if (cell.isMissed || cell.isExploded) {
        console.log(`repeat click, return null `);
        return
    }

    cell.isHide = false;
    let x = letters.indexOf(cell.row),
        y = Number(cell.col);

    if (!cell.isShip) {
        cell.isMissed = true;
    } else if (cell.isShip) {
        cell.isExploded = true;
        rightHit(x, y, cells);

        let ship = cell.identifyShip(cells[side].toString());

        console.log(ship);
        
        ship.checkState(cells);
    }  
    
    

    if (cells[side] === 'player') {
        return fieldDrawing(cells, playerBox);    
    }
    
    return fieldDrawing(cells, enemyBox);    
}


function clickEmulation(cells) {
    let cell = document.querySelector(`.player #${getRandomCell()}`);       
    
    if (cells[`${cell.id}`].isMissed || cells[`${cell.id}`].isExploded) {
       return clickEmulation(cells);
    }
    
    return cellClick(cell, playerCells);
}

// Функция очистки поля
function fieldClear(cells) {
    
    if (cells[side] === 'player') {
        let cols = document.querySelectorAll('.player .col');
        if (cols) {
            cols.forEach(col => col.remove());
        }
    } else {
        let cols = document.querySelectorAll('.enemy .col');
        if (cols) {
            cols.forEach(col => col.remove());
        } 
    }
}




















function createShips(cells, box) {
    createSingleShips(cells, box);
    createDoubleShips(cells, box);
    createTripleShips(cells, box);
    createQuadrupleShip(cells, box);
}

playerBtn.addEventListener('click', () => {
    createShips(playerCells, playerBox)
});
enemyBtn.addEventListener('click', () => {
    createShips(enemyCells, enemyBox)
});
emulation.addEventListener('click', () => {
    clickEmulation(playerCells)
});















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
