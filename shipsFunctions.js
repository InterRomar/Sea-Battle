
function createSingleShips(cells, box) {      
    let count = 0;
    let size = 'single';
    let cellsArr = [];    
    ships[`${cells[side].toString()}`] = [];
    
    
    
    while (count !== 4) {
        let randomCell = getRandomCell();       // Получаем рандомную клетку
        
        if (cells[`${randomCell}`].checkZone(size, 0, cells)) {       // Если эта клетка не соприкасается с другими кораблями, делаем из неё корабль
            cells[`${randomCell}`].isShip = true;
            cells[`${randomCell}`].size = 1;           
            cellsArr.push(cells[`${randomCell}`]);
            count++;    
            ships[`${cells[side].toString()}`].push(new Ship(size, cellsArr, 'vertical'));
            cellsArr = [];
        }
    }    
    
    fieldDrawing(cells, box);
}

function createDoubleShips(cells, box) {
    let count = 0;
    let size = 'double';
    let cellsArr = [];
    
    while (count !== 3) {           // Рисуем 3 корабля
        let position = getRandom(2);        // Рандомное положение (0 - вертикальное, 1 - горизонтальное)
        let randomCell = getRandomCell();         // Рандомная клетка на поле
        let letter = randomCell[0];                 // Буква клетки
        let number = randomCell.match(/\d/gi).join('');     // № Клетки 
        let letterIndex = letters.indexOf(letter);
        
        if (cells[`${randomCell}`].checkZone(size, position, cells)) {         // Если вокруг клетки нет кораблей, рисуем, если есть - то новая итерация
            
            
            // Если вертикальный, сразу проверяем хватит ли клеток вниз (чтобы не упереться в конец поля)
            if (position === 0 && (Number(number) + 1) <= 10 ) {       
                cells[`${randomCell}`].isShip = true;       // Выбранная клетка становится кораблём
                cells[`${randomCell}`].size = 2;            // В объект записывается размер корабля
                cells[`${letter + (Number(number) + 1)}`].isShip = true;    // Нужное количество клеток вниз так же становится кораблём (в зависимости от размера корабля)
                cells[`${letter + (Number(number) + 1)}`].size = 2; 
                cellsArr.push(cells[`${randomCell}`]);
                cellsArr.push(cells[`${letter + (Number(number) + 1)}`]);
                ships[`${cells[side].toString()}`].push(new Ship(size, cellsArr, 'vertical'));
                cellsArr = [];
                count++;
            // Если горизонтальный, сразу проверяем хватит ли клеток вправо (чтобы не упереться в конец поля)
            } else if (position === 1 && letters[letterIndex + 1]) {
                cells[`${randomCell}`].isShip = true;   // Выбранная клетка становится кораблём
                cells[`${randomCell}`].size = 2;
                cells[`${letters[letterIndex + 1]}${number}`].isShip = true;     // Нужное количество клеток вправо так же становится кораблём (в зависимости от размера корабля)
                cells[`${letters[letterIndex + 1]}${number}`].size = 2;  
                cellsArr.push(cells[`${randomCell}`]);
                cellsArr.push(cells[`${letters[letterIndex + 1]}${number}`]);
                ships[`${cells[side].toString()}`].push(new Ship(size, cellsArr, 'horizontal'));
                cellsArr = [];
                count++;

            }
        }
                
        fieldDrawing(cells, box);     
    }
}
function createTripleShips(cells, box) {
    let count = 0;
    let size = 'triple';
    let cellsArr = [];

    
    while (count !== 2) {
        let position = getRandom(2);
        let randomCell = getRandomCell();
        let letter = randomCell[0];
        let number = randomCell.match(/\d/gi).join('');
        let letterIndex = letters.indexOf(letter);
        
        if (cells[`${randomCell}`].checkZone(size, position,cells)) {
            if (position === 0 && (Number(number) + 2) <= 10 ) {                
                cells[`${randomCell}`].isShip = true;
                cells[`${randomCell}`].size = 3;
                cells[`${letter + (Number(number) + 1)}`].isShip = true;
                cells[`${letter + (Number(number) + 1)}`].size = 3;
                cells[`${letter + (Number(number) + 2)}`].isShip = true;
                cells[`${letter + (Number(number) + 2)}`].size = 3;
                cellsArr.push(cells[`${randomCell}`]);
                cellsArr.push(cells[`${letter + (Number(number) + 1)}`]);
                cellsArr.push(cells[`${letter + (Number(number) + 2)}`]);
                ships[`${cells[side].toString()}`].push(new Ship(size, cellsArr, 'vertical'));
                cellsArr = [];
                count++;
            } else if (position === 1 && letters[letterIndex + 2]) {                
                cells[`${randomCell}`].isShip = true;
                cells[`${randomCell}`].size = 3;
                cells[`${letters[letterIndex + 1]}${number}`].isShip = true;
                cells[`${letters[letterIndex + 1]}${number}`].size = 3;
                cells[`${letters[letterIndex + 2]}${number}`].isShip = true;
                cells[`${letters[letterIndex + 2]}${number}`].size = 3;
                cellsArr.push(cells[`${randomCell}`]);
                cellsArr.push(cells[`${letters[letterIndex + 1]}${number}`]);
                cellsArr.push(cells[`${letters[letterIndex + 2]}${number}`]);
                ships[`${cells[side].toString()}`].push(new Ship(size, cellsArr, 'horizontal'));
                cellsArr = [];
                count++;
            }
        }
    
        
        fieldDrawing(cells, box);     
    }
}
function createQuadrupleShip(cells, box) {
    let count = 0;
    let size = 'quadruple';
    let cellsArr = [];
    

    
    while (count !== 1) {
        let position = getRandom(2);
        let randomCell = getRandomCell();
        let letter = randomCell[0];
        let number = randomCell.match(/\d/gi).join('');
        let letterIndex = letters.indexOf(letter);
        
        if (cells[`${randomCell}`].checkZone(size, position, cells)) {
            if (position === 0 && (Number(number) + 3) <= 10 ) {                
                cells[`${randomCell}`].isShip = true;
                cells[`${randomCell}`].size = 4;
                cells[`${letter + (Number(number) + 1)}`].isShip = true;
                cells[`${letter + (Number(number) + 1)}`].size = 4;
                cells[`${letter + (Number(number) + 2)}`].isShip = true;
                cells[`${letter + (Number(number) + 2)}`].size = 4;
                cells[`${letter + (Number(number) + 3)}`].isShip = true;
                cells[`${letter + (Number(number) + 3)}`].size = 4;
                cellsArr.push(cells[`${randomCell}`]);
                cellsArr.push(cells[`${letter + (Number(number) + 1)}`]);
                cellsArr.push(cells[`${letter + (Number(number) + 2)}`]);
                cellsArr.push(cells[`${letter + (Number(number) + 3)}`]);
                ships[`${cells[side].toString()}`].push(new Ship(size, cellsArr, 'vertical'));
                cellsArr = [];
                count++;
            } else if (position === 1 && letters[letterIndex + 3]) {                
                cells[`${randomCell}`].isShip = true;
                cells[`${randomCell}`].size = 4;
                cells[`${letters[letterIndex + 1]}${number}`].isShip = true;
                cells[`${letters[letterIndex + 1]}${number}`].size = 4;
                cells[`${letters[letterIndex + 2]}${number}`].isShip = true;
                cells[`${letters[letterIndex + 2]}${number}`].size = 4;
                cells[`${letters[letterIndex + 3]}${number}`].isShip = true;
                cells[`${letters[letterIndex + 3]}${number}`].size = 4;
                cellsArr.push(cells[`${randomCell}`]);
                cellsArr.push(cells[`${letters[letterIndex + 1]}${number}`]);
                cellsArr.push(cells[`${letters[letterIndex + 2]}${number}`]);
                cellsArr.push(cells[`${letters[letterIndex + 3]}${number}`]);
                ships[`${cells[side].toString()}`].push(new Ship(size, cellsArr, 'horizontal'));
                cellsArr = [];
                count++;
            }
        }
        
        
        fieldDrawing(cells, box);     
    }
}