import { Sprite } from "pixi.js";
import { Application } from "pixi.js";
import { Entity } from "./entity";
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

      // we need to destroy this now :c
      app.stage.removeChild(this.spriteObject);
      app.stage.removeChild(this.healthBar);
      entities.splice(entities.indexOf(this), 1);
      this.healthBar.destroy();
      this.spriteObject.destroy();
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

      /*
    // this made the cookie move too fast
    // it actually ORBITED the player
    // tfw you accidentally invent gravity
    // TODO: make this an actual game mechanic somehow
    // because it's cool
    this.velX += toPlayerX * this.speed;
    this.velY += toPlayerY * this.speed;
    */

      this.velX = toPlayerX * this.speed;
      this.velY = toPlayerY * this.speed;
    }
  }

  // we have been clicked!
  public onClick(e?: Event) {
    super.onClick(e);
    this.health -= 25;
  }
}
