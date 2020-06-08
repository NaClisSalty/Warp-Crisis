class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    preload(){
        this.load.path = './Assets/'
        this.load.image("CreditsImage", "Credits.png")
        this.load.image("backButton.png")
    }

    create(){
        this.display = this.add.image(0, 0, "CreditsImage").setOrigin(0)
        this.backButton = this.add.sprite(game.config.width/2, 550, "Back").setInteractive({ useHandCursor: true }).on('pointerup', () => {this.scene.start("menuScene")});
    }
}