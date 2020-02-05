import { app } from "./index";
import { Sprite } from "pixi.js";
export enum TILE_TYPE {
  FLOOR = "tile-floor",
  WALL = "tile-wall"
}

export class Tile {
  public tileType: TILE_TYPE;
  public spriteObject: Sprite;

  constructor(tileType: TILE_TYPE) {
    this.tileType = tileType;

    switch (this.tileType) {
      case TILE_TYPE.FLOOR:
        this.spriteObject = new Sprite(
          app.loader.resources[TILE_TYPE.FLOOR].texture
        );
        break;
      case TILE_TYPE.WALL:
        this.spriteObject = new Sprite(
          app.loader.resources[TILE_TYPE.WALL].texture
        );
        break;
    }
  }
}
