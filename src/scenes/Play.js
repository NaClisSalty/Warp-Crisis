class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.path = './Assets/'
        this.load.image("tiles", "warpTiles.png");
        this.load.tilemapTiledJSON("mapjson", "tileMap_v02.json")

        this.load.image("tempWizard", "wizard_character.png")
        this.load.image("enemyWarpsoul", "enemy.png");
        this.load.image("tempTank", "robo_character.png")
    } 

    create() {
        //Add the tile map

        this.map = this.add.tilemap("mapjson");

        //Give it tiles
        this.tileset = this.map.addTilesetImage("warp_tileMap", "tiles")

        //make the layers
        this.backgroundLayer = this.map.createStaticLayer("Background", this.tileset, 0,0);
        this.terrainLayer = this.map.createStaticLayer("Map", this.tileset, 0,0);
        this.enemyLayer = this.map.createStaticLayer("Enimies", this.tileset, 0,0);

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
        this.nameText = this.add.text(800, 20, 'Name', statConfig1).setOrigin(.5,0);
        this.moveText = this.add.text(720, 100, 'Movement: X/X', statConfig2);
        this.healthText = this.add.text(720, 140, 'Health: X/X', statConfig2);
        this.powerText = this.add.text(720, 180, 'Power: X', statConfig2);
        this.distText = this.add.text(720, 220, 'Distortion X/X', statConfig2);

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
                    this.map.getTileAt(element.x, element.y, false, this.terrainLayer), 2, 50))
            else if (element.index == 14)
                this.allies.add(new Ally(this, 0, 0, "tempWizard", 0, 2, 
                this.map.getTileAt(element.x, element.y, false, this.terrainLayer), 3, 50))
            else if (element.index == 13) 
                this.allies.add(new Ally(this, 0, 0, "tempTank", 0, 3, 
                this.map.getTileAt(element.x, element.y, false, this.terrainLayer), 2, 200))              
        });
        ///////////////
        //test enemy
        ////////////////
        this.enemiesActive.add(new Enemy(this, 0, 0, Phaser.Math.RND.pick(["tempWizard","tempTank"]), 0, 2, 
                this.map.getTileAt(8, 17, false, this.terrainLayer), 2, 150))
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
    }

    update() {
       game.input.mousePointer.x
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
        this.distText.text = "Distortion > 9000";
    }

    //Resets the displayed stats to what they were at the start of the game if there's no selected unit
    resetStatDisplay(){
        this.nameText.text = "Name"
        this.moveText.text = 'Movement: X/X';
        this.healthText.text =  'Health: X/X';
        this.powerText.text =  'Power: X'
        this.distText.text ="Distortion X/X";

    }

    //Handles ending the turn
    endTurn(){
        this.allies.getChildren().forEach((unit)=>{
            if(unit.remainingMovement == unit.movement)
                unit.currentHealth = Math.min(Math.round(unit.currentHealth + unit.health/50), unit.health);
            unit.remainingMovement = unit.movement;
        });
        this.enemiesActive.getChildren().forEach((unit)=>{
            unit.takeTurn();
            //if we didnt move heal for 17.5% of our max hp
            if (unit.remainingMovement == unit.movement) {
                //unit.currentHealth = Math.min(Math.round(unit.currentHealth + (unit.health*0.175)), unit.health);
                unit.currentHealth = unit.currentHealth + 10;

            }
            unit.remainingMovement = unit.movement;
        });
        //this.enemies.getChildren().forEach((unit)=>{unit.attackAdjacent()})
        if(this.displayed!= null)
            this.setStatWindow(this.displayed)
    }

}