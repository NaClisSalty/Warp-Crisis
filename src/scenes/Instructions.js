class Instructions extends Phaser.Scene {
    constructor() {
        super("instructionsScene");
    }

    preload(){
        this.load.path = './Assets/'
        this.load.image("InstructionImage", "instructions_menu.png")
        this.load.image("backButton.png")
    }

    create(){
        this.display = this.add.image(0, 0, "InstructionImage").setOrigin(0)
        this.backButton = this.add.sprite(800, 420, "Back").setInteractive({ useHandCursor: true }).on('pointerup', () => {this.scene.start("menuScene")});
    }
}