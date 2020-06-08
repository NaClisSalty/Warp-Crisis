class Lose extends Phaser.Scene {
    constructor() {
        super("loseScene");
    }

    preload(){
        this.load.path = './Assets/'
        this.load.image("Loss", "loss_screen.png")
    }

    create(){
        this.display = this.add.image(0, 0, "Loss").setOrigin(0)
    }
}