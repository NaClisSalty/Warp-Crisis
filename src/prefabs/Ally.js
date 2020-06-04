class Ally extends Unit{
    constructor(scene, x, y, texture, frame, movement, tile, strength, health, name){
        super(scene, x, y, texture, frame, movement, tile, strength, health, 1, name);
        this.on('pointerdown', function(pointer){
            scene.selected = this;
            scene.displayed = this;
            scene.selectionBox.setVisible(true)
            scene.selectionBox.setPosition(this.x,this.y)
        });
    }

    //checks if this is dead and if so, removed from the player's units
    checkDeath(){
        if(this.currentHealth <= 0){
            if(this.scene.selected == this){
                this.scene.selected = null
                this.scene.resetStatDisplay()
                this.scene.selectionBox.setVisible(false)
            }
            this.tile.properties.occupant = undefined;
            this.scene.allies.remove(this, true, true);
            return true
        }
        return false
    }
    //Simple helper function because JS's type checking is apparently garbage
    isAlly(){
        return true
    }
}