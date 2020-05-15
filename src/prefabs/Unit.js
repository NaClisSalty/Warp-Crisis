class Unit extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame, movement){
        super(scene, x, y, texture, frame);
        this.movement = movement;
    }
}