class Enemy extends Unit{
    constructor(scene, x, y, texture, frame, movement, tile, strength, health){
        super(scene, x, y, texture, frame, movement, tile, strength, health);
        this.name = texture.slice(5);
        
        this.target = null;

        this.runningCD = 4;
        this.running = false;
        this.healing = false;
        this.runStaminaLeft = this.runningCD;
        this.exhausted = false;

    }
    //this is a function that controls the enemy behavior 
    //if above 20% hp fight
    //if below 20% hp run away
    //if running away and (dist from target == 2*target.movement), start to heal
        //if running for 4 turns stop running with 4 turn cooldown
    //if running away && health > 75% stop running
    takeTurn() {
        //console.log("healing",this.healing,"\nrunning",this.running,"\nstamina left",this.runStaminaLeft,"\nhealth",this.currentHealth);
        //sets target to closest "player"
        this.findTarget();
        if (this.target != null) {
            if (this.running) {
                //if running away and (dist from target == 2*target.movement), start to heal
                if (this.distToTarget() > (this.target.movement*2)) {
                    this.healing = true;
                }
                // if (this.healing) {
                //     //dont move or attack. WE HEALING
                //     if (this.currentHealth >= (0.75*this.health)) {
                //         this.running = false;
                //     }
                // }
                else {
                    if (this.exhausted) {
                        if (this.runStaminaLeft != this.runningCD) {
                            this.runStaminaLeft += 1;
                        }
                        else {
                            this.exhausted = false;
                        }
                    }
                    else if (this.runStaminaLeft > 0) {
                        let rundir = [Math.sign(this.x-this.target.x),Math.sign(this.y-this.target.y)];
                        let runTarget = null;
                        //clockwise from topleft
                        // to tired for vector math 
                        if (rundir[0] == 1 && rundir[1] == 1) {
                            runTarget = this.scene.map.getTileAt(20, 20, false, this.scene.terrainLayer);
                        }
                        else if (rundir[0] == 0 && rundir[1] == 1) {
                            runTarget = this.scene.map.getTileAt(10, 20, false, this.scene.terrainLayer);
                        }

                        else if (rundir[0] == -1 && rundir[1] == 1) {
                            runTarget = this.scene.map.getTileAt(0, 20, false, this.scene.terrainLayer);
                        }
                        else if (rundir[0] == -1 && rundir[1] == 0) {
                            runTarget = this.scene.map.getTileAt(0, 10, false, this.scene.terrainLayer);
                        }

                        else if (rundir[0] == -1 && rundir[1] == -1) {
                            runTarget = this.scene.map.getTileAt(0, 0, false, this.scene.terrainLayer);
                        }
                        else if (rundir[0] == 0 && rundir[1] == -1) {
                            runTarget = this.scene.map.getTileAt(10, 0, false, this.scene.terrainLayer);
                        }

                        else if (rundir[0] == 1 && rundir[1] == -1) {
                            runTarget = this.scene.map.getTileAt(20, 0, false, this.scene.terrainLayer);
                        }
                        else if (rundir[0] == 1 && rundir[1] == 0) {
                            runTarget = this.scene.map.getTileAt(20, 10, false, this.scene.terrainLayer);
                        }
                        else {

                        }
                        //RUN AWAYYYYYY
                        this.move(runTarget);
                        this.runStaminaLeft -= 1;
                    }
                    else {
                        this.exhausted = true;
                    }
                }
            }
            //if not running
            else {
                //if not healing
                if (!this.healing) {
                    this.move(this.target.tile);
                    //this.attackAdjacent();
                    //moveTo in unit.js does the attack for us???
                    if (this.currentHealth <= (0.34*this.health)) {
                        this.running = true;
                    }
                    
                }
                // else {
                //     if (this.currentHealth <= (0.34*this.health)) {
                //         //if we are out of stamina rest a bit
                //         if (this.runStaminaLeft != this.runningCD) {
                //             this.runStaminaLeft += 1;
                //         }
                //         else {
                //             this.running = true;
                //         }
                //     }
                // }
            }
            if (this.currentHealth >= (0.75*this.health)) {
                this.running = false;
                this.healing = false
            }
        }
    }
    //checks if this is dead and if so, removed from the enemy units
    checkDeath(){
        //console.log(this.currentHealth);
        if(this.currentHealth <= 0){
            this.tile.properties.occupant = undefined;
            this.scene.enemiesActive.remove(this, true, true);
            this.scene.enemies.remove(this, true, true);
            return true
        }
        return false
    }
    findTarget() {
        if (this.target == null && this.scene.allies.getChildren().length > 0) {
            this.target = this.scene.allies.getChildren()[0];
        }
        let closest = [this.target,100];
        this.scene.allies.getChildren().forEach((unit)=>{
            let pathLen = this.AStar(unit.tile, this.scene.map);
            pathLen = pathLen.length;
            if (pathLen < closest[1]) {
                closest = [unit,pathLen];
            }
        });
        //console.log(closest);

        this.target = closest[0];
    }
    //returns A* dist to target in tiles needed to travle
    distToTarget() {
        if (this.target != null) {
            return this.AStar(this.target.tile,this.scene.map).length;
        }
        return null;
    }

    //Moves to a target tile
    move(target){
        //To save time, deal with the trivial cases first
        //If we're already at the target, do nothing
        if(this.tile == target)
            return;
        //If the target is impassable, also do nothing
        // if(!target.properties.isPassable)
        //     return;
        //Also, if we're out of moves then we shouldn't be moving
        if(this.remainingMovement == 0)
            return;
        //If the target is right next to us just go there
        if(this.scene.checkAdjacency(this.tile, target)){
            this.moveTo(target)
        }
        //Otherwise, do the pathfinding thing
        //Except that we don't for now because it's all broken
        else{
            //First just run A* and get the path to the place
            //Passing in the tileMap as a param because it's just shorter
            let path = this.AStar(target, this.scene.map);
            //Keep moving until we can't any more
            while(this.remainingMovement > 0 && path.length != 0){
                let nextTile = path.shift();
                this.moveTo(nextTile);
            }
            //We should now be as close to the target as we could have gotten
        }
    }
    //Prototype combat behaviour = only attack adjacent units
    attackAdjacent(){
        //console.log("enemy smack");
        this.scene.allies.getChildren().forEach((ally)=> {
            //Need to check that it's still alive before continuing fighting
            if(this.scene != undefined && this.scene.checkAdjacency(this.tile, ally.tile)){
                if(this.combat(ally))
                    break;

            }
        })
    }
    //Simple helper function because JS's type checking is apparently garbage
    isAlly(){
        return false
    }
}