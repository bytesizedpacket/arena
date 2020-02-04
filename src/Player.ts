import { HealthPack } from "./HealthPack";
import { Application } from "pixi.js";
import { entities, currentDelta, viewHeight, viewWidth } from "./index";
import { checkSpriteCollision } from "./index";
import { Entity, STATE } from "./Entity";
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

      this.position.x += this.velX * currentDelta;
      this.position.y += this.velY * currentDelta;

      // check for collision
      entities.forEach(function(entity: Entity) {
        // also are we colliding with it?
        if (checkSpriteCollision(tthis, entity)) {
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

    // since we handle movement here
    this.updateSprite();
  }

  // override the entity one to always put us in the center
  public updateSprite() {
    this.spriteObject.position.set(
      viewWidth / 2 - this.spriteObject.width / 2,
      viewHeight / 2 - this.spriteObject.height / 2
    );
  }

  // sets the player's current score
  public setScore(score: number) {
    this.score = score;
    // TODO: render this within the game window
    statusDiv.innerHTML = "Current Score: " + this.score;
  }

  // when entities are clicked, they trigger this function on the player
  public interact(target: Entity) {
    // TODO: different weapons
    if (this.state == STATE.ACTIVE) {
      // make sure player is active
      if (this.distanceTo(target) < 80) target.health -= 25;
    }
  }
}
