class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.path = './Assets/'
        this.load.image("tiles", "warpTiles.png");
        this.load.tilemapTiledJSON("mapjson", "tileMap_v02.json")

        this.load.image("tempWizard", "wizard_character.png")
        this.load.image("enemyArt", "enemy.png");
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

        //Make all the enemies/allies
        this.spawns = this.map.filterTiles(tile => true,
             this, 0, 0, this.map.width, this.map.height, {isNotEmpty:true}, this.enemyLayer);
        this.enemies = this.add.group({
            runChildUpdate: true
        })
        this.allies = this.add.group({
            runChildUpdate: true
        })
        this.spawns.forEach(element => {
            console.log(element)
            if(element.index == 15)
                this.enemies.add(new Enemy(this, 0, 0, "enemyArt", 0, 2, element, 2, 50))
            else if (element.index == 14)
                this.allies.add(new Ally(this, 0, 0, "tempWizard", 0, 2, element, 3, 50))
            else if (element.index == 13)
                this.allies.add(new Ally(this, 0, 0, "tempTank", 0, 3, element, 2, 200))
        });

        //Don't need to show the enemy's spawns
        this.enemyLayer.visible = false;
        
        //define mouse
        //map is 20x20
        game.input.mouse.capture = true;

        //onclick events for players
        //this.input.on('pointerdown', (pointer)=>{})
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
    setStatWindow(unit) {
        this.nameText.text = unit.name;
        this.moveText.text = "Movement: "+unit.movement+"/"+unit.remainingMovement;
        this.healthText.text = "Health: "+unit.health+"/"+unit.currentHealth;
        this.powerText.text = "Power: "+unit.strength;
        this.distText.text = "Distortion > 9000";
    }
}