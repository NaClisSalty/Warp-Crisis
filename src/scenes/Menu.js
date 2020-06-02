class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    preload() {
        this.load.path = './Assets/'

        this.load.audio('folk', 'folk.mp3');
        this.load.audio('enemyAttack', 'enemyAttackNoise.mp3');
        this.load.audio('weird', 'flubershuble.mp3');
        this.load.audio('grunt', 'grunt.mp3');
        this.load.audio('grunt2', 'grunt2.mp3');
        this.load.audio('grunt3', 'grunt3.mp3');
        this.load.audio('grunt4', 'grunt4.mp3');
        this.load.audio('grunt5', 'grunt5.mp3');
        this.load.audio('grunt6', 'grunt6.mp3');
        this.load.audio('movementSound', 'movement.mp3');
        this.load.audio('robotAttack', 'robotAttack.mp3');
        this.load.audio('wizardAttack', 'wizardAttack.mp3');

        this.load.image('menu', 'Warp_menu.png');
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