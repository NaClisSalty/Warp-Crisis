
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

let game = new Phaser.Game(config);

//define game settings
game.settings = {
}