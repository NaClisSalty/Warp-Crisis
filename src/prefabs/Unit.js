class Unit extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame, movement, tile, strength, health){
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.name = texture;
        this.movement = movement;
        this.tile = tile;
        this.remainingMovement = movement;
        this.x = tile.pixelX + tile.width/2;
        this.y = tile.pixelY + tile.height/2;
        this.strength = strength;
        this.health = health;
        this.currentHealth = health;
        this.setInteractive({
            draggable: false,
            useHandCursor: false
        });
        this.on('pointerover', function(pointer){scene.setStatWindow(this); scene.displayed = this;});
        this.on('pointerout', function(pointer){
            if(scene.selected != null) {
                scene.setStatWindow(scene.selected)
                scene.displayed = scene.selected;
            }
            else{
                scene.resetStatDisplay()
                scene.displayed = null
            }
        });
        this.tile.properties.occupant = this;
    }

    //Moves to a target tile
    move(target){
        //To save time, deal with the trivial cases first
        //If we're already at the target, do nothing
        if(this.tile == target)
            return;
        //If the target is impassable, also do nothing
        if(!target.properties.isPassable)
            return;

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

    //A* pathfinding algorithm
    //Basically the same as Dijkstra's algorithm but with a heuristic function
    //Said function ensures you're starting in the right direction
    //Credit for this goes either to wikipedia or my CS teacher in HS, can't remember
    //Wiki article for reference, look at pseudocode: https://en.wikipedia.org/wiki/A*_search_algorithm#Pseudocode
    AStar(target, map){
        //Need a few things here
        //Firstly, need to track how each tile is reached
        //Keys and values will be tiles
        let cameFrom = new Map();
        //Also need to track the cost to any given tile
        //keys are tiles, values are doubles
        let costTo = new Map();
        //Obviously it cost nothing to get to where we started
        costTo.set(this.tile, 0.0);

        //Map that contains the estimated cost to destination passing through any given point
        //f(tile) = cost to tile + estimated cost to target
        let fMap = new Map();
        //Obviously cost to the start is 0 so this is just h(current)
        fMap.set(this.tile, this.estimate(this.tile, target));
        //Tracking the tiles yet to be processed
        //let nextTiles = new SortedSet({comparator:(a, b)=>{return (fMap.get(b) -fMap.get(a))}})
        let nextTiles = new Set();
        //Start with current tile
        nextTiles.add(this.tile);

        //Main loop of algorithm
        //Run as long as there's still tiles to check
        while(nextTiles.size != 0){
            //Get the best tile to check
            //Doesn't actually exist rn, need to write method
            let currentTile = this.lowestVal(nextTiles, fMap);
            //If we got there, we're done
            if(currentTile == target)
                return(this.reconstructPath(cameFrom, currentTile))
            
            //Otherwise, continue on
            //The current tile needs to be removed from the set, as it's being checked
            nextTiles.delete(currentTile);

            //Need to get all adjacent + passable tiles to loop through
            let adjacentTiles = new Array()
            
            //For loop is a bit weird to deal with map edges
            for(let i = Math.max(currentTile.x-1, 0); i <= currentTile.x +1 && i < map.width; i++){
                for(let j = Math.max(currentTile.y-1, 0); j <= currentTile.y +1 && j < map.height; j++){
                    if(map.getTileAt(i, j) != currentTile && map.getTileAt(i,j).properties.isPassable)
                        adjacentTiles.push(map.getTileAt(i, j));
                }
            }
            //Now look through all these tiles
            adjacentTiles.forEach((tile)=>{
                //Store the cost to that neighbour through this tile
                let gScore = costTo.get(currentTile) + tile.properties.movementCost;
                //if there's no current path to the tile, or this is better than the prior route
                if(costTo.get(tile) == undefined || gScore < costTo.get(tile)){
                    //We should set this as the new most efficient route to the tile
                    costTo.set(tile, gScore);
                    //Add it to the list of tiles to check, if it hasn't already been added
                    nextTiles.add(tile);
                    //Record that we got there from here
                    cameFrom.set(tile, currentTile);
                    //Record the fScore for sorting purposes
                    fMap.set(tile, gScore + this.estimate(tile, target));
                }
            })
        }
    }

    // Fulfils the role of h() in A*, estimates cost to reach target
    //Is just equal to the longest difference in coords b/c base cost of a tile is 1
    //And diagonal movement is free
    estimate(tile, otherTile){
        return(Math.max(Math.abs(tile.x - otherTile.x), Math.abs(tile.y- otherTile.y)));
    }
    
    //Will reconstruct the path taken to reach the target, into an array
    reconstructPath(steps, destination){
        //Track overall route and current location as we stepped back
        let route = Array();
        route.push(destination)
        let current = destination
        while(steps.get(current)!= this.tile){
            current = steps.get(current)
            route.unshift(current)
        }
        return route;
    }

    //Helper function for moving tiles
    changeTile(destination){
        this.tile.properties.occupant = undefined
        this.tile = destination;
        this.tile.properties.occupant = this
        this.x = this.scene.map.tileToWorldX(destination.x) + destination.width/2;
        this.y = this.scene.map.tileToWorldY(destination.y) + destination.width/2;
    }

    //Another helper function for moving
    //This one is separate in case we want to use the above for moving without paying cost
    moveTo(destination){
        //Check to see if anyone is there
        if(destination.properties.occupant != undefined){
            //if it's not us
            if(destination.properties.occupant.isAlly()!= this.isAlly()){
                //Fight it
                this.combat(destination.properties.occupant)
                //If it's not dead, stop moving and pay movement costs
                if(destination.properties.occupant != undefined){
                    this.remainingMovement -= destination.properties.movementCost;
                    this.remainingMovement = Math.max(0, this.remainingMovement);
                    return;
                }
            }
            //if it's not our enemy, stop moving
            else
                return;
        }
        this.changeTile(destination);
        this.remainingMovement -= destination.properties.movementCost;
        this.remainingMovement = Math.max(0, this.remainingMovement);
        this.scene.setStatWindow(this.scene.displayed)
    }

    //Have to make my own method to find + remove least value from a set because modules don't like working
    lowestVal(set, map){
        let lowestValue = set.values().next().value;
        set.forEach(element => {
            if(map.get(element) < map.get(lowestValue))
                lowestValue = element;
        });
        set.delete(lowestValue);
        return(lowestValue)
    }
    //Runs to fight whatever unit is opponent
    combat(opponent){
        //Need to store damage separately to not affect calculations
        let healthChange = opponent.strength * opponent.currentHealth / opponent.health/ 
                (this.strength * this.currentHealth/this.health) * 25;
        opponent.currentHealth -= this.strength * this.currentHealth / this.health/ 
            (opponent.strength * opponent.currentHealth/opponent.health) * 25;

        this.currentHealth -= healthChange
        this.currentHealth = Math.round(this.currentHealth);
        opponent.currentHealth = Math.round(opponent.currentHealth)
        opponent.checkDeath()
        this.checkDeath()
    }
}