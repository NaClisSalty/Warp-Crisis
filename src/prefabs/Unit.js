class Unit extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame, movement, tile){
        super(scene, x, y, texture, frame);
        this.movement = movement;
        this.tile = tile;
        this.remainingMovement = movement;
    }

    //Moves to a target tile
    move(target){
        //To save time, deal with the trivial cases first
        //If we're already at the target, do nothing
        if(this.tile == target)
            return;
        //If the target is impassable, also do nothing
        if(!target.isPassable)
            return;
        
        //Also, if we're out of moves then we shouldn't be moving
        if(this.remainingMovement == 0)
            return;
        //If the target is right next to us just go there
        if(this.scene.checkAdjacency(this.tile, target)){
            
            this.moveTo(target)
        }
        //Otherwise, do the pathfinding thing
        else{
            //First just run A* and get the path to the place
            //Passing in the tileMap as a param because it's just shorter
            let path = AStar(target, this.scene.map);
            //Keep moving until we can't any more
            while(this.remainingMovement > 0 && path.length != 0){
                let nextTile = path.shift();
                this.moveTo(nextTile);
            }
            //We should now be as close to the target as we could have gotten
        }

        //A* pathfinding algorithm
        //Basically the same as Dijkstra's algorithm but with a heuristic function
        //Said function ensures you're starting in the right direction
        //Credit for this goes either to wikipedia or my CS teacher in HS, can't remember
        //Wiki article for reference, look at pseudocode: https://en.wikipedia.org/wiki/A*_search_algorithm#Pseudocode
    }
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
        let nextTiles = new Set();
        //Start with current tile
        nextTiles.add(this.tile);

        //Main loop of algorithm
        //Run as long as there's still tiles to check
        while(nextTiles.size != 0){
            //Get the best tile to check
            //Doesn't actually exist rn, need to write method
            let currentTile = nextTiles.entries().next().value;

            //If we got there, we're done
            if(currentTile == target)
                return(this.reconstructPath(cameFrom, currentTile))
            
            //Otherwise, continue on
            //The current tile needs to be removed from the set, as it's being checked
            nextTiles.delete(currentTile);

            //Need to get all adjacent + passable tiles to loop through
            let adjacentTiles = new Array()
            
            //For loop is a bit weird to deal with map edges
            for(i = Math.max(currentTile.x-1, 0); i <= currentTile.x +1 && i < map.width; i++){
                for(j = Math.max(currentTile.y-1, 0); j <= currentTile.y +1 && j < map.height; j++){
                    if(map.getTileAt(i, j) != currentTile && map.getTileAt(i,j).isPassable)
                        adjacentTiles.push(map.getTileAt(i, j));
                }
            }

            //Now look through all these tiles
            adjacentTiles.forEach((tile)=>{
                //Store the cost to that neighbour through this tile
                let gScore = costTo.get(currentTile) + tile.movementCost;
                //if there's no current path to the tile, or this is better than the prior route
                if(costTo.get(tile) == undefined || gScore < costTo.get(tile)){
                    //We should set this as the new most efficient route to the tile
                    costTo.set(tile, gScore);
                    //Add it to the list of tiles to check, if it hasn't already been added
                    nextTiles.add(tile);
                    //Record that we got there from here
                    cameFrom.set(tile, currentTile);
                    //Record the fScore for sorting purposes
                    fMap.set(tile, gScore + this.estimate(tile));
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
        while(steps.has(destination)){
            current = steps.get(current)
            route.unshift(current)
        }
        return route;
    }

    //Helper function for moving tiles
    changeTile(destination){
        this.tile = destination;
        this.x = this.scene.map.tileToWorldX(destination.x);
        this.y = this.scene.map.tileToWorldY(destination.y);
    }

    //Another helper function for moving
    //This one is separate in case we want to use the above for moving without paying cost
    moveTo(destination){
        this.changeTile(destination);
        this.remainingMovement -= destination.movementCost;
        this.remainingMovement = Math.max(0, this.remainingMovement);
    }
}