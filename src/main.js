let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    backgroundColor: 0x02BBFF,
    scene:[Menu, Play],
    backgroundColor: 'rgba(255,110,110,0.5)',
};

let game = new Phaser.Game(config);

//define game settings
game.settings = {
}