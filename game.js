var config = {
    type: Phaser.AUTO,
    width: 600,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

class Board {
    constructor(scene, size, colorA, colorB) {
        this.size = size;
        this.colors = [colorA, colorB]

        let cell_width = config.width/this.size;
        let cell_height = config.height/this.size;

        this.board = [];
        for (let i = 0; i < this.size; ++i) {
            let row = [];
            for (let j = 0; j < this.size; ++j) {
                row.push(scene.add.rectangle(cell_width*i, cell_height*j, cell_width, cell_height, this.colors[(i+j)%2]).setOrigin(0,0));
            }
            this.board.push(row)
        }
    }


}

// draw() {

//     for (let row = 0; row < this.size; ++row) {
//         for (let column = 0; column < this.size; ++column) {
            
//         }
//     }
// }


function preload ()
{
    
}

function create ()
{
    board = new Board(this, 13, 0x769656, 0xeeeed2)
}

function update ()
{
    
}