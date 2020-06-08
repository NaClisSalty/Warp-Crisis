class Lose extends Phaser.Scene {
    constructor() {
        super("winScene");
    }

    preload(){
        this.load.image("Loss", "loss_screen.png")
    }

    create(){
        this.display = this.add.image(0, 0, "Loss").setOrigin(0)
    }

    update(){

    }
}