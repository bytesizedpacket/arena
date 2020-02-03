import { Sprite } from "pixi.js";
import { Application } from "pixi.js";
import { Entity, STATE, MOVEMENT_TYPE } from "./Entity";
import { player } from "./index";
import {
  entities,
  checkSpriteCollision,
  currentDelta,
  viewHeight,
  viewWidth
} from "./index";

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

      // remember these for a sec
      let prevX = this.spriteObject.x;
      let prevY = this.spriteObject.y;

      // TODO: change all entity.spriteObject.x/y to a property of the entity itself so we can have the camera render separately

      // prevent enemies from colliding with each other
      // don't do this if we can fly
      if (this.movementType != MOVEMENT_TYPE.FLY) {
        // are we now intersecting with something?
        let tthis = this; // gotta work around this jank lol
        entities.forEach(function(entityB: Entity) {
          if (
            entityB instanceof Enemy &&
            entityB != tthis &&
            entityB.movementType != MOVEMENT_TYPE.FLY
          ) {
            if (
              checkSpriteCollision(entityB.spriteObject, tthis.spriteObject)
            ) {
              let toEnemyX = entityB.spriteObject.x - tthis.spriteObject.x;
              let toEnemyY = entityB.spriteObject.y - tthis.spriteObject.y;
              let toEnemyLength = Math.sqrt(
                toEnemyX * toEnemyX + toEnemyY * toEnemyY
              );
              toEnemyX = toEnemyX / toEnemyLength;
              toEnemyY = toEnemyY / toEnemyLength;

              // move AWAY from the enemy for a frame
              tthis.velX = toEnemyX * -1 * tthis.speed;
              tthis.velY = toEnemyY * -1 * tthis.speed;
            }
          }
        });
      }

      // actually move the sprite
      this.spriteObject.x += this.velX * currentDelta;
      this.spriteObject.y += this.velY * currentDelta;

      // prepare velocity for next frame
      // different movement based on enemy type
      switch (this.movementType) {
        case MOVEMENT_TYPE.DEFAULT:
          this.velX = toPlayerX * this.speed;
          this.velY = toPlayerY * this.speed;
          break;
        case MOVEMENT_TYPE.FLY:
          this.velX += (toPlayerX * this.speed) / 15;
          this.velY += (toPlayerY * this.speed) / 15;
          break;
      }

      // we don't *actually* move the entity here, we leave this to the main game loop
    }
  }

  // we have been clicked!
  public onClick(e?: Event) {
    super.onClick(e);
    if (player.state == STATE.ACTIVE) this.health -= 25;
  }
}
