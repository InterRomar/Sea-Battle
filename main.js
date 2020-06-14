let box = document.querySelectorAll('.game-box')[1];
let btn = document.getElementById('btn');

let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
let cells = {};


// Создание массива объектов cells
letters.forEach((letter, idx) => {
    for (let i = 1; i <= 10; i++) {
        cells[`${letter}${i}`] = new Cell(letter, String(i))
    }
});

// Отрисовка всех клеток-объектов
fieldDrawing();



// функция рисования клеток
function fieldDrawing() {
    fieldClear();

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
                cell.setAttribute('id', `${key}`);
                col.appendChild(cell);
            });
            col.classList.add('col');
            col.setAttribute('id', `${letter}`);
            box.appendChild(col);
        });

        resolve();
    });
}


function createShips() {
    createSingleShips();
    createDoubleShips();
    createTripleShips();
    createQuadrupleShip();
}

btn.addEventListener('click', createShips)



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
// Функция очистки поля
function fieldClear() {
    let cols = document.querySelectorAll('.col');
    if (cols) {
        cols.forEach(col => col.remove());
    }
    // return true;
}

/// Пока не очень нужна эта функция
function cellClick(event) {
    event = event.target;

    console.log(event);
    

    fieldDrawing().then(() => {
        let cellsDOM = document.querySelectorAll('.cell');
        cellsDOM.forEach(cell => {
            cell.addEventListener('click', (event) => {
                cellClick(event);
            });
        })
    });
}

fieldDrawing().then(() => {
    let cellsDOM = document.querySelectorAll('.cell');
    cellsDOM.forEach(cell => {
        cell.addEventListener('click', (event) => {
            cellClick(event);
        });
    })
});





