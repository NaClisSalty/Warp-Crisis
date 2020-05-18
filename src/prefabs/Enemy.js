class Enemy extends Unit{
    constructor(scene, x, y, texture, frame, movement, tile, strength, health){
        super(scene, x, y, texture, frame, movement, tile, strength, health);
        this.name = texture.slice(5);
    }

    //checks if this is dead and if so, removed from the enemy units
    checkDeath(){
        if(this.currentHealth <= 0)
            this.scene.enemies.remove(this, true, true);
    }
}