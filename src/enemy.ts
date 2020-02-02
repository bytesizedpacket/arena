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
    if (this.health <= 0) {
      player.setScore(player.score + 1);

      // we need to destroy this now :c
      app.stage.removeChild(this.spriteObject);
      app.stage.removeChild(this.healthBar);
      entities.splice(entities.indexOf(this), 1);
      this.healthBar.destroy();
      this.spriteObject.destroy();
    }
  }

  // we have been clicked!
  public onClick(e?: Event) {
    super.onClick(e);
    this.health -= 25;
  }
}
