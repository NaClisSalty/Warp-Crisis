class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.path = './Assets/'
        this.load.image("tiles", "warpTiles.png");
        this.load.tilemapTiledJSON("mapjson", "tileMap_v01..json")

        this.load.image("tempWizard", "Wizard_hat.png")
        this.load.image("enemyArt", "definetlyTheFinalLastVersionOfCharacterArtWeAreGonnaUse.png");
        this.load.image("tempTank", "tank.png")
    } 

    create() {
        //Add the tile map

        this.map = this.add.tilemap("mapjson");

        //Give it tiles
        this.tileset = this.map.addTilesetImage("warp_tileMap", "tiles")

        //make the layers
        this.backgroundLayer = this.map.createStaticLayer("Background", this.tileset, 0,0);
        this.terrainLayer = this.map.createStaticLayer("Map", this.tileset, 0,0);


        //Make all the enemies
        this.enemySpawns = this.map.filterTiles(tile => {tile.id == 11}, 
                    this, 0, 0, this.map.width, this.map.height, {}, "Enimies");
        this.enemies = new Array()
        this.enemySpawns.forEach(element => {
            this.enemies.push(new Enemy(this, 0, 0, enemyArt, 0, 2, element))
        });

        //give the player some units
        this.wizardUnit = new Ally(this, 200, 200, "tempWizard", 0, 2, this.terrainLayer.getTileAt(1, 18));
        this.tankUnit = new Ally(this, 200, 200, "tempTank", 0, 3, this.terrainLayer.getTileAt(2, 18));

        //statsheet implementation
        
        //menu display
        let statConfig1 = {
            fontFamily: 'Helvetica',
            fontSize: '48px',
            backgroundColor: 'Black',
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
            backgroundColor: 'Black',
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
        
        this.add.text(800, 20, 'Stats', statConfig1);
        this.add.text(720, 60, 'Movement: X/X', statConfig1);
        this.add.text(720, 80, 'Health: X/X', statConfig1);
        this.add.text(720, 100, 'Power: X', statConfig1);
        this.add.text(720, 120, 'Distortion X/X', statConfig1);


        
    }

    update() {

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
}