
function createSingleShips() {      
    let count = 0;
    let size = 'single';
    
    while (count !== 4) {
        let randomCell = getRandomCell();       // Получаем рандомную клетку
        
        if (cells[`${randomCell}`].checkZone(size, 0)) {       // Если эта клетка не соприкасается с другими кораблями, делаем из неё корабль
            cells[`${randomCell}`].isShip = true;
            count++;    
        }
    }

    fieldDrawing();
}

function createDoubleShips() {
    let count = 0;
    let size = 'double';
    
    while (count !== 3) {           // Рисуем 3 корабля
        let position = getRandom(2);        // Рандомное положение (0 - вертикальное, 1 - горизонтальное)
        let randomCell = getRandomCell();         // Рандомная клетка на поле
        let letter = randomCell[0];                 // Буква клетки
        let number = randomCell.match(/\d/gi).join('');     // № Клетки 
        let letterIndex = letters.indexOf(letter);
        
        if (cells[`${randomCell}`].checkZone(size, position)) {         // Если вокруг клетки нет кораблей, рисуем, если есть - то новая итерация
            // Если вертикальный, сразу проверяем хватит ли клеток вниз (чтобы не упереться в конец поля)
            if (position === 0 && (Number(number) + 1) <= 10 ) {       
                cells[`${randomCell}`].isShip = true;       // Выбранная клетка становится кораблём
                cells[`${letter + (Number(number) + 1)}`].isShip = true;    // Нужное количество клеток вниз так же становится кораблём (в зависимости от размера корабля)
                count++;
            // Если горизонтальный, сразу проверяем хватит ли клеток вправо (чтобы не упереться в конец поля)
            } else if (position === 1 && letters[letterIndex + 1]) {
                cells[`${randomCell}`].isShip = true;   // Выбранная клетка становится кораблём
                cells[`${letters[letterIndex + 1]}${number}`].isShip = true;     // Нужное количество клеток вправо так же становится кораблём (в зависимости от размера корабля)
                count++;
            }
        }
    
        fieldDrawing();     
    }
}
function createTripleShips() {
    let count = 0;
    let size = 'triple';
    
    while (count !== 2) {
        let position = getRandom(2);
        let randomCell = getRandomCell();
        let letter = randomCell[0];
        let number = randomCell.match(/\d/gi).join('');
        let letterIndex = letters.indexOf(letter);
        
        if (cells[`${randomCell}`].checkZone(size, position)) {
            if (position === 0 && (Number(number) + 2) <= 10 ) {                
                cells[`${randomCell}`].isShip = true;
                cells[`${letter + (Number(number) + 1)}`].isShip = true;
                cells[`${letter + (Number(number) + 2)}`].isShip = true;
                count++;
            } else if (position === 1 && letters[letterIndex + 2]) {                
                cells[`${randomCell}`].isShip = true;
                cells[`${letters[letterIndex + 1]}${number}`].isShip = true;
                cells[`${letters[letterIndex + 2]}${number}`].isShip = true;
                count++;
            }
        }
    
        fieldDrawing();     
    }
}
function createQuadrupleShip() {
    let count = 0;
    let size = 'quadruple';
    
    while (count !== 1) {
        let position = getRandom(2);
        let randomCell = getRandomCell();
        let letter = randomCell[0];
        let number = randomCell.match(/\d/gi).join('');
        let letterIndex = letters.indexOf(letter);
        
        if (cells[`${randomCell}`].checkZone(size, position)) {
            if (position === 0 && (Number(number) + 3) <= 10 ) {                
                cells[`${randomCell}`].isShip = true;
                cells[`${letter + (Number(number) + 1)}`].isShip = true;
                cells[`${letter + (Number(number) + 2)}`].isShip = true;
                cells[`${letter + (Number(number) + 3)}`].isShip = true;
                count++;
            } else if (position === 1 && letters[letterIndex + 3]) {                
                cells[`${randomCell}`].isShip = true;
                cells[`${letters[letterIndex + 1]}${number}`].isShip = true;
                cells[`${letters[letterIndex + 2]}${number}`].isShip = true;
                cells[`${letters[letterIndex + 3]}${number}`].isShip = true;
                count++;
            }
        }
        
        fieldDrawing();     
    }
}