import { Sprite } from "pixi.js";
import { Application } from "pixi.js";
import { Entity, State } from "./entity";
import { player } from "./index";
import { app } from "./index";
import { entities } from "./index";

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

      this.velX += (toPlayerX * this.speed) / 50;
      this.velY += (toPlayerY * this.speed) / 50;
    }
  }

  // we have been clicked!
  public onClick(e?: Event) {
    super.onClick(e);
    if (player.state == State.ACTIVE) this.health -= 25;
  }
}
