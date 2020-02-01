import { Sprite } from "pixi.js";
import { Application } from "pixi.js";
import { entities } from "./index";
import { checkSpriteCollision } from "./index";
import { Entity } from "./entity";

// useful variables
let statusDiv = document.getElementById("status");

// main player object
export class Player extends Entity {
  spriteObject: Sprite = this.spriteObject;
  public score: number;
  constructor(
    spriteObject: Sprite,
    app: Application,
    speed?: number,
    displayHealthBar?: boolean
  ) {
    super(spriteObject, app, speed, displayHealthBar);
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
        // make sure we're not checking ourselves (which would wreck ourselves)
        // also are we colliding with it?
        if (
          entity.spriteObject.name != "player" &&
          checkSpriteCollision(tthis.spriteObject, entity.spriteObject)
        ) {
          tthis.health -= 1;
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
