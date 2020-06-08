class Win extends Phaser.Scene {
    constructor() {
        super("winScene");
    }

    preload(){
        this.load.path = './Assets/'
        this.load.image("Victory", "win_screen.png")
    }

    create(){
        this.display = this.add.image(game.config.width/2, game.config.height/2, "Victory")
    }
}