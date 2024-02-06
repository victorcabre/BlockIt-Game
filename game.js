let config = {
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
    playerColors: [0xff0000, 0x0000FF]
}

let game = new Phaser.Game(config);

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

        let cell_width = config.width/this.size;
        let cell_height = config.height/this.size;

        this.board = [];
        for (let i = 0; i < this.size; ++i) {
            let row = [];
            for (let j = 0; j < this.size; ++j) {
                row.push(new Cell(scene, this.colors[(i + j) % 2], cell_width*i, cell_height*j, cell_width, cell_height));
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
    getCell(row, column) {
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
        this.cell = scene.add.rectangle(pos_x, pos_y, width, height, color).setOrigin(0,0)
    }


}

/**
 * Represents a player.
 */
class Player {
    constructor(scene, color, pos_x, pos_y) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.color = color;

    }
}

const Directions = Object.freeze({
    Up: Symbol("Up"),
    Down: Symbol("Down"),
    Left: Symbol("Left"),
    Right: Symbol("Right"),
})


function preload ()
{
    
}

function create ()
{
    board = new Board(this, gameConfig.boardSize, gameConfig.boardColors)

    
}

function update ()
{
    
}