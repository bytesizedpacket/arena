import { Position } from "./Entity";
import { app, viewWidth, viewHeight, player } from "./index";
import { Container } from "pixi.js";
import { Tile, TILE_TYPE } from "./Tile";

export class Map {
  public startPosition: Position;
  public sizeX: number;
  public sizeY: number;
  public tiles: Tile[][];
  public tileContainer: Container;

  constructor(level: number) {
    // TODO: read size from json file
    this.sizeX = 16;
    this.sizeY = 16;
    let startPos: Position = {
      x: Math.round((this.sizeX * 16) / 2),
      y: Math.round((this.sizeY * 16) / 2)
    };

    player.position = startPos;

    this.tileContainer = new Container();
    this.tiles = []; // initialize the first dimension of the array
    // loop on X axis
    for (let stepX = 0; stepX < this.sizeX; stepX++) {
      this.tiles[stepX] = []; // initialize the second dimension of the array
      // loop on Y axis
      for (let stepY = 0; stepY < this.sizeY; stepY++) {
        // todo: read tiles from json file
        let currentTile: Tile;
        if (
          stepX == 0 ||
          stepY == 0 ||
          stepX == this.sizeX - 1 ||
          stepY == this.sizeY - 1
        ) {
          currentTile = new Tile(TILE_TYPE.WALL);
        } else {
          currentTile = new Tile(TILE_TYPE.FLOOR);
        }
        this.tiles[stepX][stepY] = currentTile;
        currentTile.spriteObject.position.set(stepX * 16, stepY * 16);

        this.tileContainer.addChild(currentTile.spriteObject);
      }
    }

    app.stage.addChild(this.tileContainer);
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
