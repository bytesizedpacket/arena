import { Sprite } from "pixi.js";
import { Application } from "pixi.js";
import { Entity, STATE, MOVEMENT_TYPE } from "./entity";
import { player } from "./index";
import { app } from "./index";
import { entities } from "./index";

// main enemy object
export class Enemy extends Entity {
  constructor(
    spriteName: string,
    app: Application,
    speed?: number,
    displayHealthBar?: boolean,
    movementType?: MOVEMENT_TYPE
  ) {
    super(spriteName, app, speed, displayHealthBar, movementType);
  }

  // this will run every frame
  public tick() {
    super.tick();
    // oh no it fucking died :c
    if (this.health <= 0) {
      player.setScore(player.score + 1); // yay

      this.destroy(); // :c
    } else {
      // if you have reached this point, the thing isn't dead

      // direction towards player
      let toPlayerX = player.spriteObject.x - this.spriteObject.x;
      let toPlayerY = player.spriteObject.y - this.spriteObject.y;

      // normalize
      let toPlayerLength = Math.sqrt(
        toPlayerX * toPlayerX + toPlayerY * toPlayerY
      );
      toPlayerX = toPlayerX / toPlayerLength;
      toPlayerY = toPlayerY / toPlayerLength;

      // different movement based on enemy type
      switch (this.movementType) {
        case MOVEMENT_TYPE.DEFAULT:
          this.velX = toPlayerX * this.speed;
          this.velY = toPlayerY * this.speed;
          break;
        case MOVEMENT_TYPE.FLY:
          this.velX += (toPlayerX * this.speed) / 50;
          this.velY += (toPlayerY * this.speed) / 50;
          break;
      }
    }
  }

  // we have been clicked!
  public onClick(e?: Event) {
    super.onClick(e);
    if (player.state == STATE.ACTIVE) this.health -= 25;
  }
}
