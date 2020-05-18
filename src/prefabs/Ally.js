class Ally extends Unit{
    constructor(scene, x, y, texture, frame, movement, tile, strength, health){
        super(scene, x, y, texture, frame, movement, tile, strength, health);

        this.on('pointerdown', function(pointer){
            scene.selected = this;
        });
    }
}