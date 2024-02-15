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
     * @param {*} size The size of the board, i.e. the number of cells in a row or in a column.
     * @param {*} colorA The color value for one of the two sets of cells in the checkerboarded pattern.
     * @param {*} colorB The color value for one of the two sets of cells in the checkerboarded pattern.
     */
    constructor(size, colors) {
        this.size = size;
        this.colors = colors;

        let cell_width = phaserConfig.width/this.size;
        let cell_height = phaserConfig.height/this.size;

        this.board = [];
        for (let i = 0; i < this.size; ++i) {
            let row = [];
            for (let j = 0; j < this.size; ++j) {
                row.push(new Cell(this.colors[(i + j) % 2], cell_width*j, cell_height*i, cell_width, cell_height));
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
     * @param {*} color The color of the cell.
     * @param {*} pos_x The x coordinate within the canvas space where the top left corner of the cell will be.
     * @param {*} pos_y The y coordinate within the canvas space where the top left corner of the cell will be.
     * @param {*} width The width of the cell.
     * @param {*} height The height of the cell.
     */
    constructor(color, pos_x, pos_y, width, height) {
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
     * @param {*} board The Board object.
     * @param {*} color The color that will be used to draw the player's chips.
     * @param {*} pos_i The starting row of the player in the board.
     * @param {*} pos_i The starting column of the player in the board.
     */
    constructor(board, color, pos_i, pos_j) {
        this.position = new Position(pos_i, pos_j);
        this.board = board;
        this.color = color;
        let cellCoords = board.getCellAt(this.position.i, this.position.j).getCenterCoords();
        this.circle = scene.add.circle(cellCoords.x, cellCoords.y, gameConfig.playerRadius, this.color);
    }

    getCurrentPosition() {
        return this.position;
    }

    increasePositionInDirection(position, direction) {
        let newPosition;
        switch (direction) {
            case Directions.Up:
                newPosition = new Position(position.i - 1, position.j);
                break;
            case Directions.Down:
                newPosition = new Position(position.i + 1, position.j);
                break;
            case Directions.Left:
                newPosition = new Position(position.i, position.j - 1);
                break;
            case Directions.Right:
                newPosition = new Position(position.i, position.j + 1);
                break;
        }
        return newPosition;
    }

    /**
     * 
     * @param {*} direction The direction for the movement.
     * @param {*} enemyPlayerPosition The position of the enemy player.
     * @returns The new position if the player can move that direction, null otherwise.
     */
    getMovePosition(direction, enemyPlayerPosition) {
        // TODO: Include barrier logic
        let newPosition = this.increasePositionInDirection(this.position, direction);

        // Compute next position in case enemy is in same position as newPosition
        if (enemyPlayerPosition.i == newPosition.i && enemyPlayerPosition.j == newPosition.j) {
            newPosition = this.increasePositionInDirection(newPosition, direction);
        }

        if (newPosition.isWithinBounds()) {
            return newPosition;
        }
        else {
            return null;
        }
    }

    move(newPosition) {
        this.circle.depth = 1;
        console.log(player1.circle.depth + ' ' + player2.circle.depth)
        this.position = newPosition;
        let cellCoords = board.getCellAt(this.position.i, this.position.j).getCenterCoords();
        scene.tweens.add({
            targets: this.circle,
            duration: 300,
            props: {
                x: cellCoords.x,
                y: cellCoords.y,
            },
            ease: 'Power1',
            onComplete: () => {
                // Reset depth after animation completes
                this.circle.depth = 0;
            },
        })
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

let scene;
let board;
let player1;
let player2;
let keys;

function create()
{
    scene = this;
    board = new Board(gameConfig.boardSize, gameConfig.boardColors);
    player1 = new Player(board, gameConfig.playerColors[1], gameConfig.boardSize - 1, Math.floor(gameConfig.boardSize / 2));
    player2 = new Player(board, gameConfig.playerColors[0], 0, Math.floor(gameConfig.boardSize / 2));

    keys = {
        W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        Up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
        Down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
        Left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
        Right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
    }

}

function update()
{
    
    if (Phaser.Input.Keyboard.JustDown(keys.W)) {
        let position = player1.getMovePosition(Directions.Up, player2.getCurrentPosition());
        if (position != null) {
            player1.move(position);
        }
    }
    else if (Phaser.Input.Keyboard.JustDown(keys.A)) {
        let position = player1.getMovePosition(Directions.Left, player2.getCurrentPosition());
        if (position != null) {
            player1.move(position);
        }
    }
    else if (Phaser.Input.Keyboard.JustDown(keys.S)) {
        let position = player1.getMovePosition(Directions.Down, player2.getCurrentPosition());
        if (position != null) {
            player1.move(position);
        }
    }
    else if (Phaser.Input.Keyboard.JustDown(keys.D)) {
        let position = player1.getMovePosition(Directions.Right, player2.getCurrentPosition());
        if (position != null) {
            player1.move(position);
        }
    }

    if (Phaser.Input.Keyboard.JustDown(keys.Up)) {
        let position = player2.getMovePosition(Directions.Up, player1.getCurrentPosition());
        if (position != null) {
            player2.move(position);
        }
    }
    else if (Phaser.Input.Keyboard.JustDown(keys.Left)) {
        let position = player2.getMovePosition(Directions.Left, player1.getCurrentPosition());
        if (position != null) {
            player2.move(position);
        }
    }
    else if (Phaser.Input.Keyboard.JustDown(keys.Down)) {
        let position = player2.getMovePosition(Directions.Down, player1.getCurrentPosition());
        if (position != null) {
            player2.move(position);
        }
    }
    else if (Phaser.Input.Keyboard.JustDown(keys.Right)) {
        let position = player2.getMovePosition(Directions.Right, player1.getCurrentPosition());
        if (position != null) {
            player2.move(position);
        }
    }
 
}