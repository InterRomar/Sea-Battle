

class Cell {
    constructor(row, col) {
      this.row = row;
      this.col = col;
      this.id = row + col;
      this.isShip = false;
      this.isMissed = false;
      this.isExploded = false;
      this.isHide = true;
    }

    // Определяем есть ли в клетках вокруг выбранной клетки корабли (количество клеток зависит от размера)
    // Принимает два параметра (size, position); size - размер корабля от 1 до 4, position (1 | 0) 0 - вертикально, 1 - горизонтально 
    checkZone(size, position, cells) {       
        let x = letters.indexOf(this.row);
        let y = +this.col;

        let coordinates = getCoordinates(x, y);
        
        if (position === 0) {
          position = 'vertical';
        } else {
          position = 'horizontal';
        }

        
        
        // Проверяем каждый объект по координатам, не является ли он кораблём
        // Если хоть одна из клеток является кораблём, функция возвращает false, в противном случае true;
        let result = coordinates[`${size}`][`${position}`].map(coordinates => {
            let [x, y] = coordinates;
            if (!cells[`${letters[x]}${y}`]) {
                return '';
            }
            return cells[`${letters[x]}${y}`].isShip;
        }).filter(item => item !== '')
          .every((item) => item === false);
    
        return result;
    }

    identifyShip(side) {
      if (ships[side].filter(ship => ship.cells.includes(this))) {
        return ships[side].filter(ship => ship.cells.includes(this))[0];
      }
    }
}

function getCoordinates(x, y) {
        // Координаты клеток вокруг выбранной клетки для разных размеров кораблей
        const coordinates = {
          single: {
            vertical: [[x - 1, y - 1], [x, y - 1], [x + 1, y - 1 ], [x - 1, y],[x, y], [x + 1, y], [x - 1, y + 1], [x, y + 1], [x + 1, y + 1]]
          },
          double: {
            vertical: [[x - 1, y - 1], [x, y - 1], [x + 1, y - 1 ], [x - 1, y],[x, y], [x + 1, y], [x - 1, y + 1], [x, y + 1], [x + 1, y + 1], [x - 1, y + 2], [x, y + 2], [x + 1, y + 2]],
            horizontal: [[x - 1, y - 1], [x, y - 1], [x + 1, y - 1 ], [x - 1, y],[x, y], [x + 1, y], [x - 1, y + 1], [x, y + 1], [x + 1, y + 1], [x + 2, y - 1], [x + 2, y], [x + 2, y + 1]]
          },
          triple: {
            vertical: [[x - 1, y - 1], [x, y - 1], [x + 1, y - 1 ], [x - 1, y],[x, y], [x + 1, y], [x - 1, y + 1], [x, y + 1], [x + 1, y + 1], [x - 1, y + 2], [x, y + 2], [x + 1, y + 2],[x - 1, y + 3], [x, y + 3], [x + 1, y + 3]],
            horizontal: [[x - 1, y - 1], [x, y - 1], [x + 1, y - 1 ], [x - 1, y],[x, y], [x + 1, y], [x - 1, y + 1], [x, y + 1], [x + 1, y + 1], [x + 2, y - 1], [x + 2, y], [x + 2, y + 1], [x + 3, y - 1], [x + 3, y], [x + 3, y + 1]]
          },
          quadruple: {
            vertical: [[x - 1, y - 1], [x, y - 1], [x + 1, y - 1 ], [x - 1, y],[x, y], [x + 1, y], [x - 1, y + 1], [x, y + 1], [x + 1, y + 1], [x - 1, y + 2], [x, y + 2], [x + 1, y + 2], [x - 1, y + 3], [x, y + 3], [x + 1, y + 3],[x - 1, y + 4], [x, y + 4], [x + 1, y + 4]],
            horizontal: [[x - 1, y - 1], [x, y - 1], [x + 1, y - 1 ], [x - 1, y],[x, y], [x + 1, y], [x - 1, y + 1], [x, y + 1], [x + 1, y + 1], [x + 2, y - 1], [x + 2, y], [x + 2, y + 1], [x + 3, y - 1], [x + 3, y], [x + 3, y + 1], [x + 4, y - 1], [x + 4, y], [x + 4, y + 1]]
          },
        };
        
        return coordinates;
}