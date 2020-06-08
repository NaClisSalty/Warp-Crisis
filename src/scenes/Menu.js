class Menu extends Phaser.Scene {
    constructor() {
        super({key: "menuScene",
        pack: {
            files: [
                { type: 'image', key: 'loading', url: './Assets/loading_screen.png' }
            ]
        }});
    }

    preload() {
        this.load.path = './Assets/'
        this.add.image(0,0,"loading").setOrigin(0)
        this.load.audio('folk', 'folk.mp3');

        this.load.image('menu', 'Warp_menu.png');

        this.load.image('UI', 'UI.png');
        this.load.atlas('Buttons', 'BUTTONS.png', "buttons.json");
        this.load.image("Back", "backButton.png")
    }

    create() {
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        // this.clickButton = this.add.text(centerX-20, centerY, 'Play', {fill: '#d437bc'})
        // .setInteractive({ useHandCursor: true })
        // .on('pointerover', () => this.enterButtonHoverState())
        // .on('pointerout', () => this.enterButtonRestState())
        // .on('pointerdown', () => this.enterButtonActiveState())
        // .on('pointerup', () => {
        //     this.enterButtonHoverState();
        //     this.scene.start("playScene");
        // });
        /*
        this.add.text(centerX, centerY-140, "Warp Crisis", {fontSize: 24}).setOrigin(0.5)
        this.add.text(centerX, centerY-110, "Left click to select your units", {fontSize: 18}).setOrigin(0.5)
        this.add.text(centerX, centerY-80, "Right click to move and attack", {fontSize: 18}).setOrigin(0.5)
        this.add.text(centerX, centerY-50, "End turn to recover movement points, or health if you didn't move", {fontSize: 18}).setOrigin(0.5)
        this.add.text(centerX, centerY-20, "Defeat all enemies", {fontSize: 18}).setOrigin(0.5)
        */

        this.add.image(0,0, 'menu').setOrigin(0,0);

        //music implementation
        let folk = 0;

        this.folk = this.sound.add('folk', {loop: true});
        //music1.setLoop(true);
        this.folk.play();
        this.folk.setVolume(.2);

        let playButton = this.add.rectangle(481, 354, 290, 122, 0x000000, 0)
        .setInteractive({ useHandCursor: true })
        .on('pointerup', () => {
            this.scene.start("playScene");
            this.folk.stop();
        });

        let instructionButton = this.add.rectangle(200, 515, 290, 122, 0x000000, 0)
        .setInteractive({ useHandCursor: true })
        .on('pointerup', () => {
            this.scene.start("instructionsScene");
            this.folk.stop();
        });

        let creditsButton = this.add.rectangle(772, 515, 290, 122, 0x000000, 0)
        .setInteractive({ useHandCursor: true })
        .on('pointerup', () => {
            this.scene.start("creditsScene");
            this.folk.stop();
        });

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