
"use strict";

let config = {
    type: Phaser.CANVAS,
    width: 960,
    height: 640,
    backgroundColor: 0x02BBFF,
    scene:[Menu, Play],
    backgroundColor: 'rgba(255,110,110,0.5)',
    piexlArt: true,
};
//Putting the mapping from non-warped tiles to warped here because it being global is useful
let tileWarpMap = new Map([[5, 7],[10, 11],[1, 4], [2, 9],[8, 3]])
let game = new Phaser.Game(config);

//define game settings
game.settings = {
}