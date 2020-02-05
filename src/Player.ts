import { HealthPack } from "./HealthPack";
import { Application } from "pixi.js";
import { entities, currentDelta, viewHeight, viewWidth } from "./index";
import { checkSpriteCollision } from "./index";
import { Entity, STATE } from "./Entity";
import { Enemy } from "./Enemy";
// @ts-ignore
import * as Keyboard from "pixi.js-keyboard";
// @ts-ignore
import * as Mouse from "pixi.js-mouse";

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

      // only if the player is alive...
      if (this.state == STATE.ACTIVE) {
        // handle input!
        if (Keyboard.isKeyDown("KeyS", "ArrowDown")) {
          this.velY = this.speed;
        } else {
          if (!Keyboard.isKeyDown("KeyW", "ArrowUp")) this.velY = 0;
        }

        if (Keyboard.isKeyDown("KeyD", "ArrowRight")) {
          this.velX = this.speed;
        } else {
          if (!Keyboard.isKeyDown("KeyA", "ArrowLeft")) this.velX = 0;
        }

        if (Keyboard.isKeyDown("KeyW", "ArrowUp")) {
          this.velY = this.speed * -1;
        } else {
          if (!Keyboard.isKeyDown("KeyS", "ArrowDown")) this.velY = 0;
        }

        if (Keyboard.isKeyDown("KeyA", "ArrowLeft")) {
          this.velX = this.speed * -1;
        } else {
          if (!Keyboard.isKeyDown("KeyD", "ArrowRight")) this.velX = 0;
        }
      }

      this.checkMapCollision();

      this.position.x += this.velX * currentDelta;
      this.position.y += this.velY * currentDelta;

      // check for collision
      entities.forEach(function(entity: Entity) {
        // also are we colliding with it?
        if (checkSpriteCollision(tthis, entity)) {
          switch (entity.constructor) {
            case Enemy:
              tthis.damage(1);
              break;
            case HealthPack:
              tthis.heal(100);
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
      // make sure we aren't clicking ourselves
      if (!(target instanceof Player)) {
        // make sure player is active
        if (this.distanceTo(target) < 80) target.damage(25);
      }
    }
  }
}
