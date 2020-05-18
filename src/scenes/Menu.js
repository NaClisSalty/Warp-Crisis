class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    preload() {
        this.load.path = './Assets/'

        this.load.audio('folk', 'folk.mp3');
    }

    create() {
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        this.clickButton = this.add.text(centerX-20, centerY, 'Play', {fill: '#d437bc'})
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => this.enterButtonHoverState())
        .on('pointerout', () => this.enterButtonRestState())
        .on('pointerdown', () => this.enterButtonActiveState())
        .on('pointerup', () => {
            this.enterButtonHoverState();
            this.scene.start("playScene");
        });

        let folk = 0;

        this.folk = this.sound.add('folk', {loop: true});
        //music1.setLoop(true);
        this.folk.play();
        this.folk.setVolume(.2);

    }

    update() {  
        //this.scene.start("playScene")
    }

    enterButtonHoverState() {
        this.clickButton.setStyle({ fill: '#6b1c5f'});
    }

    enterButtonRestState() {
        this.clickButton.setStyle({ fill: '#6b1c5f' });
    }

    enterButtonActiveState() {
        this.clickButton.setStyle({ fill: '#000000' });
    }
}