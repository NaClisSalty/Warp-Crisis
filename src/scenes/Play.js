class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.path = './Assets/'
    } 

    create() {
    }

    update() {

    }
    _onFocus() {
        this.paused = false;
        console.log("Hi!")
    }
    _onBlur() {
        this.paused = true;
        console.log("Bye!")
    }
    //Quick and dirty method to check if 2 tiles are adjacent.
    checkAdjacency(tile, otherTile){
        return(Math.abs(tile.x-otherTile.x)<= 1 && Math.abs(tile.y-otherTile.y)<= 1);
    }
}