let phaserConfig = {
    type: Phaser.AUTO,
    width: 600,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let gameConfig = {
    boardSize: 9,
    boardColors: [0xeeeed2, 0x769656],
    playerColors: [0xfe4c3c, 0x3498fc],
    playerRadius: 22,
};

let game = new Phaser.Game(phaserConfig);

/**
 * Represents a board, composed of multiple cells.
 */
class Board {
    /**
     * Construct a new board and draw it.
     * @param {*} scene The Phaser.Scene object.
     * @param {*} size The size of the board, i.e. the number of cells in a row or in a column.
     * @param {*} colorA The color value for one of the two sets of cells in the checkerboarded pattern.
     * @param {*} colorB The color value for one of the two sets of cells in the checkerboarded pattern.
     */
    constructor(scene, size, colors) {
        this.size = size;
        this.colors = colors;

        let cell_width = phaserConfig.width/this.size;
        let cell_height = phaserConfig.height/this.size;

        this.board = [];
        for (let i = 0; i < this.size; ++i) {
            let row = [];
            for (let j = 0; j < this.size; ++j) {
                row.push(new Cell(scene, this.colors[(i + j) % 2], cell_width*j, cell_height*i, cell_width, cell_height));
            }
            this.board.push(row)
        }
    }

    /**
     * Gets a cell at the specified row and column.
     * @param {*} row 
     * @param {*} column 
     * @returns The cell at the specified row and column.
     */
    getCellAt(row, column) {
        return this.board[row][column];
    }
}

/**
 * Represents a cell, which is a square in the Phaser environment.
 */
class Cell {
    /**
     * Constructs a new cell object.
     * @param {*} scene The Phaser.Scene object.
     * @param {*} color The color of the cell.
     * @param {*} pos_x The x coordinate within the canvas space where the top left corner of the cell will be.
     * @param {*} pos_y The y coordinate within the canvas space where the top left corner of the cell will be.
     * @param {*} width The width of the cell.
     * @param {*} height The height of the cell.
     */
    constructor(scene, color, pos_x, pos_y, width, height) {
        this.rectangle = scene.add.rectangle(pos_x, pos_y, width, height, color).setOrigin(0, 0);
    }

    getCenterCoords() {
        return this.rectangle.getCenter()
    }
}

class Position {
    constructor(i, j) {
        this.i = i;
        this.j = j;
    }

    isWithinBounds() {
        return (this.i >= 0 && this.i < gameConfig.boardSize) && (this.j >= 0 && this.j < gameConfig.boardSize);
    }
}

/**
 * Represents a player.
 */
class Player {
    /**
     * Construct a new player.
     * @param {*} scene The Phaser.Scene object.
     * @param {*} board The Board object.
     * @param {*} color The color that will be used to draw the player's chips.
     * @param {*} pos_i The starting row of the player in the board.
     * @param {*} pos_i The starting column of the player in the board.
     */
    constructor(scene, board, color, pos_i, pos_j) {
        this.position = new Position(pos_i, pos_j);
        this.color = color;
        let cellCoords = board.getCellAt(position.i, position.j).getCenterCoords();
        this.player = scene.add.circle(cellCoords.x, cellCoords.y, gameConfig.playerRadius, this.color);
    }

    canMove(direction) {
        // TODO: Include barrier logic
        let newPosition;
        switch (direction) {
            case Directions.Up:
                newPosition = new Position(this.position.i, this.position.j - 1);
                
            case Directions.Down:
                newPosition = new Position(this.position.i, this.position.j + 1);
                
            case Directions.Left:
                newPosition = new Position(this.position.i - 1, this.position.j);

            case Directions.Right:
                newPosition = new Position(this.position.i + 1, this.position.j);
        }

        return newPosition.isWithinBounds();
    }

    move(direction) {
        // TODO: Include opponent overtaking logic.
        let newPosition;
        switch (direction) {
            case Directions.Up:
                newPosition = new Position(this.position.i, this.position.j - 1);
                
            case Directions.Down:
                newPosition = new Position(this.position.i, this.position.j + 1);
                
            case Directions.Left:
                newPosition = new Position(this.position.i - 1, this.position.j);

            case Directions.Right:
                newPosition = new Position(this.position.i + 1, this.position.j);
        }

        
    }
}

const Directions = Object.freeze({
    Up: Symbol("Up"),
    Down: Symbol("Down"),
    Left: Symbol("Left"),
    Right: Symbol("Right"),
});


function preload()
{
    
}

let board;
let player1;
let player2;

function create()
{
    board = new Board(this, gameConfig.boardSize, gameConfig.boardColors);
    player1 = new Player(this, board, gameConfig.playerColors[0], 0, Math.floor(gameConfig.boardSize / 2));
    player2 = new Player(this, board, gameConfig.playerColors[1], gameConfig.boardSize - 1, Math.floor(gameConfig.boardSize / 2));
}

function update()
{
    
}