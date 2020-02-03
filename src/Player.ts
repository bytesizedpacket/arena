import { HealthPack } from "./HealthPack";
import { Sprite } from "pixi.js";
import { Application } from "pixi.js";
import { entities } from "./index";
import { checkSpriteCollision } from "./index";
import { Entity } from "./Entity";
import { Enemy } from "./Enemy";

// useful variables
let statusDiv = document.getElementById("status");

// main player object
export class Player extends Entity {
  public score: number = 0;
  constructor(
    spriteName: string,
    app: Application,
    speed?: number,
    displayHealthBar?: boolean
  ) {
    super(spriteName, app, speed, displayHealthBar);
    console.log("Player has been initialized", this);
  }

  // this will run every frame
  public tick() {
    super.tick();
    let tthis = this; // we do this because the forEach fucks with the `this` keyword

    if (this.health <= 0) {
      statusDiv.innerHTML = "Uh-oh spaghetti-o's! You're <b>dead.</b>";
    } else {
      // we're still alive!

      // check for collision
      entities.forEach(function(entity: Entity) {
        // also are we colliding with it?
        if (checkSpriteCollision(tthis.spriteObject, entity.spriteObject)) {
          switch (entity.constructor) {
            case Enemy:
              tthis.health -= 1;
              break;
            case HealthPack:
              tthis.health = 100;
              entity.destroy();
              break;
          }
        }
      });
    }
  }

  // sets the player's current score
  public setScore(score: number) {
    this.score = score;
    // TODO: render this within the game window
    statusDiv.innerHTML = "Current Score: " + this.score;
  }
}
