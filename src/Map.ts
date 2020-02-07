import { Position } from "./Entity";
import { app, viewWidth, viewHeight, player, statusDiv } from "./index";
import { Container } from "pixi.js";
import { Tile, TILE_TYPE } from "./Tile";
import { Enemy } from "./Enemy";

const levelData = require("./levels.json");

export class Map {
  public startPosition: Position;
  public sizeX: number;
  public sizeY: number;
  public tiles: Tile[][];
  public tileContainer: Container;

  constructor(level: number) {
    // levelData is our levels json file

    // TODO: create proper end-of-levels handling
    level = 1;

    // does this level exist in the data?
    if (levelData.levels[level - 1] != undefined) {
      // yes!

      let currentLevel: any = levelData.levels[level - 1];

      // construct map
      let tiles = currentLevel.tiles;
      this.sizeX = tiles.length;
      this.sizeY = tiles[0].length;

      let startPos = currentLevel.startPos;

      player.position = { x: startPos.x * 16, y: startPos.y * 16 };

      this.tileContainer = new Container();
      this.tiles = []; // initialize the first dimension of the array
      // loop on X axis
      for (let stepX = 0; stepX < this.sizeX; stepX++) {
        this.tiles[stepX] = []; // initialize the second dimension of the array
        // loop on Y axis
        for (let stepY = 0; stepY < this.sizeY; stepY++) {
          // todo: read tiles from json file
          let currentTile: Tile;

          currentTile = new Tile(tiles[stepX][stepY].type, {
            x: stepX * 16,
            y: stepY * 16
          });

          currentTile.spriteObject.position.set(
            currentTile.position.x,
            currentTile.position.y
          );
          this.tiles[stepX][stepY] = currentTile;

          this.tileContainer.addChild(currentTile.spriteObject);
        }
      }

      app.stage.addChild(this.tileContainer);

      // construct enemies
      currentLevel.enemies.forEach(function(enemy: any) {
        let currentEnemy = new Enemy(
          enemy.type,
          app,
          undefined,
          undefined,
          enemy.type
        );

        currentEnemy.position = {
          x: enemy.position.x * 16,
          y: enemy.position.y * 16
        };
      });
    } else {
      statusDiv.innerHTML = "<b>Unfortunately, that was the last level.</b>";
    }
  }

  // update all of our sprites!
  public updateSprites() {
    // we need to move the container relative to the player's location
    this.tileContainer.x =
      -player.position.x + viewWidth / 2 - player.spriteObject.width / 2;
    this.tileContainer.y =
      -player.position.y + viewHeight / 2 - player.spriteObject.height / 2;
  }

  // oh my god it fucking exploded
  public destroy() {
    // loop on X axis
    for (let stepX = 0; stepX < this.sizeX; stepX++) {
      // loop on Y axis
      for (let stepY = 0; stepY < this.sizeY; stepY++) {
        let currentTile = this.tiles[stepX][stepY];
        currentTile.spriteObject.destroy();
      }
    }

    app.stage.removeChild(this.tileContainer);
    this.tileContainer.destroy();
  }
}
