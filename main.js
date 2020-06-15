let playerBox = document.querySelectorAll('.game-box')[0];
let enemyBox = document.querySelectorAll('.game-box')[1];

let start = document.getElementById('start');

let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
let side = Symbol();

let playerCells = {};
playerCells[side] = 'player';
let enemyCells = {};
enemyCells[side] = 'enemy';
let ships = {};


const ENEMY_DELAY = 1000;  // Задержка, с которой ai будет выполнять действия (в ms)

// Создание массива объектов cells
letters.forEach((letter, idx) => {
    for (let i = 1; i <= 10; i++) {
        playerCells[`${letter}${i}`] = new Cell(letter, String(i));
        enemyCells[`${letter}${i}`] = new Cell(letter, String(i));
    }
});

// Отрисовка всех клеток-объектов
fieldDrawing(playerCells, playerBox).then(() => createShips(playerCells, playerBox));
fieldDrawing(enemyCells, enemyBox).then(() => createShips(enemyCells, enemyBox));

enemyBox.addEventListener('click', async (event) => {
    if (event.target.classList.contains('cell')) {
        let success = await cellClick(event.target);
        if (!success) {
            enemyBox.classList.add('blocked');
            return enemyShot();
        }  
               
    }
} )

start.addEventListener('click', async () => {
    enemyShot();
})

async function enemyShot() {
    let success;
    setTimeout(async () => {
        success = await clickEmulation(playerCells);
    }, ENEMY_DELAY);
    
    setTimeout(() => {
        if (success) {
            return enemyShot();
        }
        enemyBox.classList.remove('blocked');
    }, ENEMY_DELAY);
    
}


// функция рисования клеток
function fieldDrawing(cells, box, success) {   
    
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

        resolve(success);
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
let container = document.getElementById('container');



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


// document.onload = function {
 
//     container.style.backgroundColor = 'red';
// }