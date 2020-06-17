
function createSingleShips(cells, box, times, selectedCell) {      
    let count = 0;
    let size = 'single';
    let cellsArr = [];    
    
    if (!ships[cells[side]]) {
        ships[cells[side]] = [];
    }
    
    
    
    while (count !== times) {

        let cell;
        if (!selectedCell) {
            cell = getRandomCell();       // Получаем рандомную клетку
        } else {
            cell = selectedCell;
        }
        
        
        
        if (cells[side] === 'player' && selectedCell) {        
            if (!cells[cell].checkZone(size, 0, cells)) {
                console.log('в этом месте установить нельзя');
                return false;     // alert с сообщением
            }
        }
            
        
        if (cells[cell].checkZone(size, 0, cells)) {       // Если эта клетка не соприкасается с другими кораблями, делаем из неё корабль
            cells[cell].isShip = true;
            cells[cell].size = 1;           
            cellsArr.push(cells[cell]);
            count++;    
            ships[cells[side]].push(new Ship(size, cellsArr, 'vertical'));
            cellsArr = [];
            
        }
    }    
    
    fieldDrawing(cells, box);
    return true;
}

function createDoubleShips(cells, box, times, selectedCell, position) {
    let count = 0;
    let size = 'double';
    let cellsArr = [];
    
    if (!ships[cells[side]]) {
        ships[cells[side]] = [];
    }

    while (count !== times) {           // Рисуем 3 корабля

        let cell;

        if (!selectedCell) {
            cell = getRandomCell();       // Получаем рандомную клетку
            
        } else {
            cell = selectedCell;
            
        }

        if (position === undefined) {
            position = getRandom(2);            
        }      

        let letter = cell[0];                 // Буква клетки
        let number = cell.match(/\d/gi).join('');     // № Клетки 
        let letterIndex = letters.indexOf(letter);
        
        if (cells[side] === 'player' && selectedCell) {        
            if (!cells[cell].checkZone(size, position, cells)) {
                console.log('в этом месте установить нельзя');
                return;     // alert с сообщением                
            }
        }

        if (cells[cell].checkZone(size, position, cells)) {         // Если вокруг клетки нет кораблей, рисуем, если есть - то новая итерация
            // Если вертикальный, сразу проверяем хватит ли клеток вниз (чтобы не упереться в конец поля)
            if (position === 0 && (Number(number) + 1) <= 10 ) {                       
                cells[cell].isShip = true;       // Выбранная клетка становится кораблём
                cells[cell].size = 2;            // В объект записывается размер корабля
                cells[`${letter + (Number(number) + 1)}`].isShip = true;    // Нужное количество клеток вниз так же становится кораблём (в зависимости от размера корабля)
                cells[`${letter + (Number(number) + 1)}`].size = 2; 
                cellsArr.push(cells[cell]);
                cellsArr.push(cells[`${letter + (Number(number) + 1)}`]);
                ships[cells[side]].push(new Ship(size, cellsArr, 'vertical'));
                cellsArr = [];
                count++;
            // Если горизонтальный, сразу проверяем хватит ли клеток вправо (чтобы не упереться в конец поля)
            } else if (position === 1 && letters[letterIndex + 1]) {                
                cells[cell].isShip = true;   // Выбранная клетка становится кораблём
                cells[cell].size = 2;
                cells[`${letters[letterIndex + 1]}${number}`].isShip = true;     // Нужное количество клеток вправо так же становится кораблём (в зависимости от размера корабля)
                cells[`${letters[letterIndex + 1]}${number}`].size = 2;  
                cellsArr.push(cells[`${cell}`]);
                cellsArr.push(cells[`${letters[letterIndex + 1]}${number}`]);
                ships[cells[side]].push(new Ship(size, cellsArr, 'horizontal'));
                cellsArr = [];
                count++;

            }
            
        }
                
        fieldDrawing(cells, box);     
        if (selectedCell) return true;
    }
    
}
function createTripleShips(cells, box, times, selectedCell, position) {
    let count = 0;
    let size = 'triple';
    let cellsArr = [];

    if (!ships[cells[side]]) {
        ships[cells[side]] = [];
    }
    
    while (count !== times) {
        
        let cell;
        if (!selectedCell) {
            cell = getRandomCell();       // Получаем рандомную клетку
        } else {
            cell = selectedCell;
        }
        
        if (position === undefined) {
            position = getRandom(2);            
        } 

        let letter = cell[0];
        let number = cell.match(/\d/gi).join('');
        let letterIndex = letters.indexOf(letter);

        if (cells[side] === 'player' && selectedCell) {        
            if (!cells[cell].checkZone(size, position, cells)) {
                console.log('в этом месте установить нельзя');
                return;     // alert с сообщением
            }
        }
        
        if (cells[`${cell}`].checkZone(size, position,cells)) {
            if (position === 0 && (Number(number) + 2) <= 10 ) {                
                cells[cell].isShip = true;
                cells[cell].size = 3;
                cells[`${letter + (Number(number) + 1)}`].isShip = true;
                cells[`${letter + (Number(number) + 1)}`].size = 3;
                cells[`${letter + (Number(number) + 2)}`].isShip = true;
                cells[`${letter + (Number(number) + 2)}`].size = 3;
                cellsArr.push(cells[`${cell}`]);
                cellsArr.push(cells[`${letter + (Number(number) + 1)}`]);
                cellsArr.push(cells[`${letter + (Number(number) + 2)}`]);
                ships[cells[side]].push(new Ship(size, cellsArr, 'vertical'));
                cellsArr = [];
                count++;
            } else if (position === 1 && letters[letterIndex + 2]) {                
                cells[cell].isShip = true;
                cells[cell].size = 3;
                cells[`${letters[letterIndex + 1]}${number}`].isShip = true;
                cells[`${letters[letterIndex + 1]}${number}`].size = 3;
                cells[`${letters[letterIndex + 2]}${number}`].isShip = true;
                cells[`${letters[letterIndex + 2]}${number}`].size = 3;
                cellsArr.push(cells[`${cell}`]);
                cellsArr.push(cells[`${letters[letterIndex + 1]}${number}`]);
                cellsArr.push(cells[`${letters[letterIndex + 2]}${number}`]);
                ships[cells[side]].push(new Ship(size, cellsArr, 'horizontal'));
                cellsArr = [];
                count++;
            }
            
        }
    
        
        fieldDrawing(cells, box);  
        if (selectedCell) return true;   
    }
}
function createQuadrupleShip(cells, box, times, selectedCell, position) {
    let count = 0;
    let size = 'quadruple';
    let cellsArr = [];
    
    if (!ships[cells[side]]) {
        ships[cells[side]] = [];
    }
    
    while (count !== 1) {
        let cell;
        if (!selectedCell) {
            cell = getRandomCell();       // Получаем рандомную клетку
        } else {
            cell = selectedCell;
        }

        if (position === undefined) {
            position = getRandom(2);            
        } 

        let letter = cell[0];
        let number = cell.match(/\d/gi).join('');
        let letterIndex = letters.indexOf(letter);

        if (cells[side] === 'player' && selectedCell) {        
            if (!cells[cell].checkZone(size, position, cells)) {
                console.log('в этом месте установить нельзя');
                return;     // alert с сообщением
            }
        }
        
        if (cells[`${cell}`].checkZone(size, position, cells)) {
            if (position === 0 && (Number(number) + 3) <= 10 ) {                
                cells[cell].isShip = true;
                cells[cell].size = 4;
                cells[`${letter + (Number(number) + 1)}`].isShip = true;
                cells[`${letter + (Number(number) + 1)}`].size = 4;
                cells[`${letter + (Number(number) + 2)}`].isShip = true;
                cells[`${letter + (Number(number) + 2)}`].size = 4;
                cells[`${letter + (Number(number) + 3)}`].isShip = true;
                cells[`${letter + (Number(number) + 3)}`].size = 4;
                cellsArr.push(cells[`${cell}`]);
                cellsArr.push(cells[`${letter + (Number(number) + 1)}`]);
                cellsArr.push(cells[`${letter + (Number(number) + 2)}`]);
                cellsArr.push(cells[`${letter + (Number(number) + 3)}`]);
                ships[cells[side]].push(new Ship(size, cellsArr, 'vertical'));
                cellsArr = [];
                count++;
            } else if (position === 1 && letters[letterIndex + 3]) {                
                cells[cell].isShip = true;
                cells[cell].size = 4;
                cells[`${letters[letterIndex + 1]}${number}`].isShip = true;
                cells[`${letters[letterIndex + 1]}${number}`].size = 4;
                cells[`${letters[letterIndex + 2]}${number}`].isShip = true;
                cells[`${letters[letterIndex + 2]}${number}`].size = 4;
                cells[`${letters[letterIndex + 3]}${number}`].isShip = true;
                cells[`${letters[letterIndex + 3]}${number}`].size = 4;
                cellsArr.push(cells[`${cell}`]);
                cellsArr.push(cells[`${letters[letterIndex + 1]}${number}`]);
                cellsArr.push(cells[`${letters[letterIndex + 2]}${number}`]);
                cellsArr.push(cells[`${letters[letterIndex + 3]}${number}`]);
                ships[cells[side]].push(new Ship(size, cellsArr, 'horizontal'));
                cellsArr = [];
                count++;
            } 
        }
        
        
        fieldDrawing(cells, box);  
        if (selectedCell) return true;   
    }
}