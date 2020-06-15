class Ship {
    constructor(size, cells, position) {
        this.size = size;
        this.cells = cells;
        this.position = position;
    }

    checkState(cells) {
        console.log('check state');
        if (this.cells.every(cell => cell.isExploded === true)) {       // Если все клетки корабля уже взорваны
            
            this.blowUpShip(cells);            
        }
    }

    blowUpShip(cells) {
        let mainCell = this.cells[0];
        
        let coordinates = getCoordinates(letters.indexOf(mainCell.row), Number(mainCell.col))[this.size][this.position];
        
        coordinates.forEach(coords => {
            let cell = cells[`${letters[coords[0]]}${coords[1]}`];
            if (cell) {
                if (cell.isHide) {
                    cell.isHide = false;
                }
                if (!cell.isMissed) {
                    cell.isMissed = true;
                }
            }  
        });

        if (cells[side] === 'player') {
            return fieldDrawing(cells, playerBox);    
        } 
        return fieldDrawing(cells, enemyBox);    
  
    }
}