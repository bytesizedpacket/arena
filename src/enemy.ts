import { Sprite } from "pixi.js";
import { Application } from "pixi.js";
import { Entity } from "./entity";
import { player } from "./index";

// main enemy object
export class Enemy extends Entity {
  constructor(
    spriteObject: Sprite,
    app: Application,
    speed?: number,
    displayHealthBar?: boolean
  ) {
    super(spriteObject, app, speed, displayHealthBar);
  }

  // this will run every frame
  public tick() {
    super.tick();
    if (this.health <= 0) {
      player.setScore(player.score++);
    }
  }
}
