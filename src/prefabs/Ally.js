class Ally extends Unit{
    constructor(scene, x, y, texture, frame, movement, tile, strength, health){
        super(scene, x, y, texture, frame, movement, tile, strength, health);
        this.name = texture.slice(4);
        this.on('pointerdown', function(pointer){
            scene.selected = this;
        });
    }

    //checks if this is dead and if so, removed from the player's units
    checkDeath(){
        if(this.currentHealth <= 0){
            if(this.scene.selected == this){
                this.scene.selected = null
                this.scene.resetStatDisplay()
            }
            this.scene.allies.remove(this, true, true);
        }
    }
}