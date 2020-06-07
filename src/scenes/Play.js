class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.path = './Assets/'
        this.load.image("tiles", "allTiles_v2.png");
        this.load.tilemapTiledJSON("mapjson", "tileMap_v07.json")

        this.load.image("tempWizard", "wizard_character.png")
        this.load.image("enemyWarpsoul", "enemy.png");
        this.load.image("tempTank", "robo_character.png")

        this.load.audio('enemyAttack', 'enemyAttackNoise.mp3');
        this.load.audio('enemyDeath', 'enemyDeathNoise.mp3');
        this.load.audio('flubershuble', 'flubershuble.mp3');
        this.load.audio('grunt1', 'grunt.mp3');
        this.load.audio('grunt2', 'grunt2.mp3');
        this.load.audio('grunt3', 'grunt3.mp3');
        this.load.audio('grunt4', 'grunt4.mp3');
        this.load.audio('grunt5', 'grunt5.mp3');
        this.load.audio('grunt6', 'grunt6.mp3');
        this.load.audio('movementSound', 'movement.mp3');
        this.load.audio('tankAttack', 'robotAttack.mp3');
        this.load.audio('wizardAttack', 'wizardAttack.mp3');
    } 

    create() {
        //Add the tile map

        this.map = this.add.tilemap("mapjson");

        //Give it tiles
        this.tileset = this.map.addTilesetImage("allTilesv2", "tiles")

        //make the layers
        this.backgroundLayer = this.map.createDynamicLayer("Background", this.tileset, 0,0);
        this.terrainLayer = this.map.createDynamicLayer("Map", this.tileset, 0,0);
        this.enemyLayer = this.map.createStaticLayer("Enimies", this.tileset, 0,0);

        //add ui
        this.add.image(638,-3, 'UI').setOrigin(0,0);


        //statsheet implementation
        //menu display
        let statConfig1 = {
            fontFamily: 'Helvetica',
            fontSize: '48px',
            //backgroundColor: 'Black',
            color: 'Black',
            align: 'right',
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
            },
            fixedWidth: 0
        }

        let statConfig2 = {
            fontFamily: 'Helvetica',
            fontSize: '24px',
            //backgroundColor: 'Black',
            color: 'Black',
            align: 'right',
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
            },
            fixedWidth: 0
        }
        //stattext
        this.nameText = this.add.text(780, 20, 'Name', statConfig1).setOrigin(.5,0);
        this.moveText = this.add.text(700, 100, 'Movement: X/X', statConfig2);
        this.healthText = this.add.text(700, 140, 'Health: X/X', statConfig2);
        this.powerText = this.add.text(700, 180, 'Power: X', statConfig2);
        this.distText = this.add.text(700, 220, 'Distortion: X/X', statConfig2);

        //Set the selected object to null initially since the player shouldn't have anything at the start
        this.selected = null;
        //Also track the currently displayed character
        this.displayed = null
        //Make all the enemies/allies
        this.spawns = this.map.filterTiles(tile => true,
             this, 0, 0, this.map.width, this.map.height, {isNotEmpty:true}, this.enemyLayer);
        this.enemies = this.add.group({
            runChildUpdate: true
        })
        this.enemiesActive = this.add.group({
            runChildUpdate: true
        })
        this.allies = this.add.group({
            runChildUpdate: true
        })

        //We generally want this layer so just setting the default here
        this.map.setLayer(this.terrainLayer)
        this.spawns.forEach(element => {
            //Need to get the tiles for the actually important layer when spawning
            if(element.index == 15)
                this.enemies.add(new Enemy(this, 0, 0, "enemyWarpsoul", 0, 2, 
                    this.map.getTileAt(element.x, element.y, false, this.terrainLayer), 2, 50,false, "Warpsoul"))
            else if (element.index == 14)
                this.allies.add(new Ally(this, 0, 0, "tempWizard", 0, 2, 
                this.map.getTileAt(element.x, element.y, false, this.terrainLayer), 3, 50, "Wizard"))
            else if (element.index == 13) 
                this.allies.add(new Ally(this, 0, 0, "tempTank", 0, 3, 
                this.map.getTileAt(element.x, element.y, false, this.terrainLayer), 2, 200, "Tank"))              
        });
        ///////////////
        //test enemy
        ////////////////
        this.enemies.add(new Enemy(this, 0, 0, Phaser.Math.RND.pick(["tempWizard","tempTank"]), 0, 2, 
                this.map.getTileAt(8, 17, false, this.terrainLayer), 2, 150, true, "Warped Ally"));
        //Don't need to show the enemy's spawns
        this.enemyLayer.visible = false;
        
        //define mouse
        //map is 20x20
        game.input.mouse.capture = true;
        //stop those pesky right clicks
        game.canvas.oncontextmenu = function (e) {e.preventDefault();};

        //onclick events for players
        this.input.on('pointerdown', (pointer)=>{
            if(this.selected != null && pointer.rightButtonDown()){
                console.log(pointer.position.x/32)
                this.selected.move(this.map.getTileAtWorldXY(pointer.position.x, pointer.position.y,false,
                    this.cameras.main,  this.terrainLayer));
                }
        })

        //End turn button
        this.clickButton = this.add.text(800, 600, 'End Turn', {fill: '#d437bc'})
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            this.endTurn()
        });

        

        //Start with a unit selected
        this.displayed = this.allies.getChildren()[0];
        this.selected = this.displayed

        //Selection box
        this.selectionBox = this.add.rectangle(this.displayed.x, this.displayed.y, 32, 32).setStrokeStyle(2, "0xFFFF34");

        //function to warp the stats of tiles, to be assigned to every tile
        //Going to be pretty similar to the version for units
        //Could be a *lot* similar, but if we add more tile properties later I want to futureproof it
        let warpStats = function(){
            //get a shorthand version of the tile's warp level
            let warp = this.properties.warpLevel
            this.statWarpArray.forEach((statSet)=>{
                if(Math.random() * 100 <= warp){
                    //if we've hit maximum warp value, warp relative to current value
                    if(warp >= 99)
                        this.properties[statSet[0]] += this.properties[statSet[0]]*(Math.random()-.5) * warp/100
                    //otherwise warp relative to base value
                    else
                        this.properties[statSet[0]] = statSet[1] + statSet[1]*(Math.random()-.5) * warp/100
                    //Regardless, need to make sure the decimal isn't too excessive
                    this.properties[statSet[0]] = Math.round(this.properties[statSet[0]] * 100)/100
                }
            })
            //Also going to include changing of the tilemap image in here for efficiency
            if(warp >= 50 && !this.warped){
                this.warped = true
                if(tileWarpMap.has(this.index)){
                    this.index = tileWarpMap.get(this.index)
                    //If we're warping this tile, and it's a tile with a background, change the background too
                    //God this chain of references looks awful
                    //I think this still winds up being shorter than not using a forEachTile method though
                    this.layer.tilemapLayer.scene.backgroundLayer.forEachTile((backTile)=>{
                        if(backTile.index != 0)
                            backTile.index = tileWarpMap.get(backTile.index);
                    }, this, this.x, this.y, 1, 1)
                }
            }
        }


        //Now we need to give this + the relevant array to every tile
        this.terrainLayer.layer.data.forEach((subArray)=>{subArray.forEach((tile)=>{
            //console.log(tile)
            tile.warpStats = warpStats;
            tile.statWarpArray = [["movementCost", tile.properties.movementCost]]
            tile.warped = false;
        })});

        //tile we are hovering (to show the path of a selected unit)
        this.tileHovered = null;
        this.selectedPath = null;
        this.selectedPathGraphic = this.add.graphics();
    }

    update() {
        //have we hovered a new tile with a unit selected
        if(this.selected != null) {
            if (this.tileHovered != null && this.map.getTileAtWorldXY(game.input.mousePointer.x,game.input.mousePointer.y) != null) {
                if (this.tileHovered != this.map.getTileAtWorldXY(game.input.mousePointer.x,game.input.mousePointer.y)) {
                    this.tileHovered = this.map.getTileAtWorldXY(game.input.mousePointer.x,game.input.mousePointer.y);
                    //make sure we dont trigger on our own tile (that casues an infinite loop D:)
                    if (this.selectedPath == null && this.tileHovered != this.selected.tile) {
                        this.selectedPathGraphic.clear();
                        this.selectedPathGraphic.lineStyle(3, 0x000000, 1);
                        this.selectedPath = this.selected.AStar(this.tileHovered,this.map);
                        if (this.selectedPath != null) {
                            //this line restricts the display, making it only show path lines equal to how far the unit can move
                            this.selectedPath = this.selectedPath.slice(0,this.selected.remainingMovement);
                            //add the sellected units tile to the list of tiles to draw a path through
                            this.selectedPath.unshift(this.selected.tile);
                            for (var i = 0; i < this.selectedPath.length-1;i++) {
                                this.selectedPathGraphic.lineBetween(
                                    this.map.tileToWorldX(this.selectedPath[i].x)+16,
                                    this.map.tileToWorldY(this.selectedPath[i].y)+16,
                                    this.map.tileToWorldX(this.selectedPath[i+1].x)+16,
                                    this.map.tileToWorldY(this.selectedPath[i+1].y)+16);
                            }
                            //console.log("draw path from ", this.tileHovered.x, ",", this.tileHovered.y);
                        }
                        //console.log(this.selectedPath);
                        this.selectedPath = null;
                    }
                    //console.log(this.tileHovered.x, ",", this.tileHovered.y);
                }
            }
        }
        this.tileHovered = this.map.getTileAtWorldXY(game.input.mousePointer.x,game.input.mousePointer.y);
    }
    _onFocus() {
        this.paused = false;
        console.log("Hi!")
    }
    _onBlur() {
        this.paused = true;
        console.log("Bye!")
    }
    //Quick and dirty method to check if 2 tiles are adjacent.
    checkAdjacency(tile, otherTile){
        return(Math.abs(tile.x-otherTile.x)<= 1 && Math.abs(tile.y-otherTile.y)<= 1);
    }
    //Sets stats to match the selected or moused-over unit
    setStatWindow(unit) {
        this.nameText.text = unit.name;
        this.moveText.text = "Movement: "+unit.remainingMovement+"/"+unit.movement;
        this.healthText.text = "Health: "+unit.currentHealth+"/"+unit.health;
        this.powerText.text = "Power: "+unit.strength;
        this.distText.text = "Warp: " + unit.warp + "/" + 100;
    }

    //Resets the displayed stats to what they were at the start of the game if there's no selected unit
    resetStatDisplay(){
        this.nameText.text = "Name"
        this.moveText.text = 'Movement: X/X';
        this.healthText.text =  'Health: X/X';
        this.powerText.text =  'Power: X'
        this.distText.text ="Warp: X/X";

    }

    //Handles ending the turn
    endTurn(){
        this.allies.getChildren().forEach((unit)=>{
            unit.balanceWarp()
            if(unit.remainingMovement == unit.movement)
                unit.currentHealth = Math.min(Math.round(unit.currentHealth + unit.health/50), unit.health);
            unit.remainingMovement = unit.movement;
            unit.warpStats()
        });
        this.enemies.getChildren().forEach((unit)=>{
            unit.balanceWarp()
            if (unit.canMove) {
                unit.takeTurn();
                //if we didnt move heal for 17.5% of our max hp
                if (unit.remainingMovement == unit.movement) {
                    //unit.currentHealth = Math.min(Math.round(unit.currentHealth + (unit.health*0.175)), unit.health);
                    unit.currentHealth = unit.currentHealth + 10;

                }
                unit.remainingMovement = unit.movement;
            }
            else {
                unit.attackAdjacent();
            }
            unit.warpStats()
        });

        //Go through and warp all the tiles
        this.terrainLayer.layer.data.forEach((subArray)=>{subArray.forEach((tile)=>{
            tile.warpStats()
        })});


        // this.enemies.getChildren().forEach((unit)=>{
        //     unit.balanceWarp()
        //     unit.attackAdjacent();
        // })
        //this.enemies.getChildren().forEach((unit)=>{unit.attackAdjacent()})
        if(this.displayed!= null)
            this.setStatWindow(this.displayed)
    }

}