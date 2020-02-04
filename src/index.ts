import * as PIXI from "pixi.js";
// make vscode ignore these since they don't have typings
// @ts-ignore
import * as Keyboard from "pixi.js-keyboard";
// @ts-ignore
import * as Mouse from "pixi.js-mouse";
import { Entity } from "./Entity";
import { STATE, MOVEMENT_TYPE } from "./Entity";
import { Player } from "./Player";
import { Enemy } from "./Enemy";
import { HealthPack } from "./HealthPack";
// TODO: reduce size of bundle.js by following this guide https://medium.com/anvoevodin/how-to-set-up-pixijs-v5-project-with-npm-and-webpack-41c18942c88d

// aliases and helpful variables
const urlParams = new URLSearchParams(window.location.search);
let statusDiv = document.getElementById("status");
let levelDiv = document.getElementById("level");

// game properties
export let viewWidth: number = 256;
export let viewHeight: number = 256;
let zoomScale: number = parseInt(urlParams.get("zoom")); // URL query parameter ?zoom=_
export let currentLevel: number;
if (isNaN(zoomScale)) zoomScale = 2; // default to 2 if not specified
// TODO: if zoom level isn't specified, automatically determine largest possible zoom level (also put this in window.onresize)
let gameState: Function;
export let player: Player;
export let currentDelta = 0;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

// these are our assets
let assets = [
  { name: "player", url: "assets/sprites/Player.png" },
  { name: "enemy-default", url: "assets/sprites/Enemy-default.png" },
  { name: "enemy-fly", url: "assets/sprites/Enemy-fly.png" },
  { name: "healthpack", url: "assets/sprites/HealthPack.png" }
];
export let entities: Entity[] = []; // this will be populated later

// setup pixi
export let app = new PIXI.Application({ width: viewWidth, height: viewHeight });
document.body.appendChild(app.view);

// disable rightclicking
app.view.addEventListener("contextmenu", e => {
  if (e.type == "contextmenu") e.preventDefault();
});

// initialize a new level
let initLevel = function(delta?: any) {
  if (!currentLevel) {
    // level hasn't been set - let's check the url variable
    let levelSelect: number = parseInt(urlParams.get("level"));
    if (!isNaN(levelSelect)) {
      currentLevel = levelSelect;
    } else {
      currentLevel = 1; // default to 1 if not set
    }
  }
  levelDiv.innerHTML = "<b>LEVEL " + currentLevel + "</b>";

  // actually generate the level now

  switch (currentLevel) {
    case 1:
    // yay it's level 1
    // fall throguh to default for now so it keeps going forever
    default:
      // put player in the center
      // TODO: let maps define a start posiiton
      player.position.x = viewWidth / 2 - player.spriteObject.width / 2;
      player.position.y = viewHeight / 2 - player.spriteObject.height / 2;

      // create 3 enemies
      for (let i = 0; i < 3; i++) {
        let currentEnemy: Enemy;

        // the middle enemy will have fly movement
        if (i == 1) {
          currentEnemy = createEnemy("enemy-fly", 1, true, MOVEMENT_TYPE.FLY);
        } else {
          currentEnemy = createEnemy("enemy-default", 0.8);
        }

        switch (i) {
          case 0:
            // do nothing (starts at 0,0)
            break;
          case 1:
            // put it halfway down the screen
            currentEnemy.position.y =
              viewHeight / 2 - currentEnemy.spriteObject.height / 2;
            break;
          case 2:
            // put it at the bottom
            currentEnemy.position.y =
              viewHeight - currentEnemy.spriteObject.height;
            break;
        }
      }

      // are we on a prime numbered level?
      if (isPrime(currentLevel)) {
        // yes - generate a health pack somewhere
        let healthPack = new HealthPack("healthpack", app);
        let pos = {
          x: getRandomInt(0, viewWidth - healthPack.spriteObject.width - 1),
          y: getRandomInt(0, viewHeight - healthPack.spriteObject.height - 1)
        };
        healthPack.position = pos;
      }
      break;
  }

  // set the gameState to gameLoop;
  gameState = gameLoop;
};

// main gameplay loop
let gameLoop = function(delta: any) {
  // only if the player is alive...
  if (player.state == STATE.ACTIVE) {
    // handle input!
    if (Keyboard.isKeyDown("KeyS", "ArrowDown")) {
      player.velY = player.speed;
    } else {
      if (!Keyboard.isKeyDown("KeyW", "ArrowUp")) player.velY = 0;
    }

    if (Keyboard.isKeyDown("KeyD", "ArrowRight")) {
      player.velX = player.speed;
    } else {
      if (!Keyboard.isKeyDown("KeyA", "ArrowLeft")) player.velX = 0;
    }

    if (Keyboard.isKeyDown("KeyW", "ArrowUp")) {
      player.velY = player.speed * -1;
    } else {
      if (!Keyboard.isKeyDown("KeyS", "ArrowDown")) player.velY = 0;
    }

    if (Keyboard.isKeyDown("KeyA", "ArrowLeft")) {
      player.velX = player.speed * -1;
    } else {
      if (!Keyboard.isKeyDown("KeyD", "ArrowRight")) player.velX = 0;
    }
  }

  let enemyCheck = false; // do we have any enemies?

  // make sure every entity handles their ticks and stays inside the map
  entities.forEach(function(entity: Entity) {
    // don't tick it if it's inactive
    if (entity.state != STATE.INACTIVE) {
      // TEMPORARILY DISABLED
      /*

      // constrain it to the map
      // also set velocity to 0 so they turn around quicker
      if (entity.position.x < 0) {
        entity.position.x = 0;
        entity.velX = 0;
      }
      if (entity.position.y < 0) {
        entity.position.y = 0;
        entity.velY = 0;
      }
      // TODO: constrain these to map instead of screen size
      if (entity.position.x > viewWidth - entity.spriteObject.width) {
        entity.position.x = viewWidth - entity.spriteObject.width;
        entity.velX = 0;
      }
      if (entity.position.y > viewHeight - entity.spriteObject.height) {
        entity.position.y = viewHeight - entity.spriteObject.height;
        entity.velY = 0;
      }

      */

      entity.tick(); // tock

      // is this an enemy?
      if (entity instanceof Enemy) enemyCheck = true;
    }
  });

  // if there are no enemies left, set up a new level
  if (!enemyCheck) {
    currentLevel = currentLevel + 1;
    gameState = initLevel;
  }
};

// begin loading assets
app.loader
  .add(assets)
  .on("progress", function() {
    statusDiv.innerHTML = app.loader.progress + "% Loading...";
  })
  .load(function() {
    // Set up a new game

    // make stage interactable
    app.stage.interactive = true;

    // tell the user to click the enemies!
    // TODO: make this a popup notification of some kind
    statusDiv.innerHTML = "Click the enemies!";

    // set up player object
    player = new Player("player", app);

    // add sprite to stage
    app.stage.addChild(player.spriteObject);

    // scale view
    app.renderer.resize(viewWidth * zoomScale, viewHeight * zoomScale);
    app.stage.scale.set(zoomScale, zoomScale);

    // center
    app.view.style.position = "absolute";
    app.view.style.left =
      ((window.innerWidth - app.renderer.width) >> 1) + "px";

    // keep centered on resize
    window.onresize = function(event: Event) {
      app.view.style.position = "absolute";
      app.view.style.left =
        ((window.innerWidth - app.renderer.width) >> 1) + "px";
    };

    // begin game loop
    gameState = initLevel;
    app.ticker.add(delta => tick(delta));
  });

// keeps all of our shit running
let tick = function(delta: any) {
  currentDelta = delta;
  gameState(delta);
  Keyboard.update();
  Mouse.update();
};

// check for collision between two sprites
export let checkSpriteCollision = function(entity1: Entity, entity2: Entity) {
  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
  let sprite1 = entity1.spriteObject;
  let sprite2 = entity2.spriteObject;

  // alsdjfkafds
  let r1 = {
    //Find the center points of each sprite
    centerX: entity1.position.x + sprite2.width / 2,
    centerY: entity1.position.y + sprite1.height / 2,
    //Find the half-widths and half-heights of each sprite
    halfWidth: sprite1.width / 2,
    halfHeight: sprite1.height / 2
  };

  let r2 = {
    //Find the center points of each sprite
    centerX: entity2.position.x + sprite2.width / 2,
    centerY: entity2.position.y + sprite2.height,
    //Find the half-widths and half-heights of each sprite
    halfWidth: sprite2.width / 2,
    halfHeight: sprite2.height / 2
  };

  //hit will determine whether there's a collision
  hit = false;

  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {
    //A collision might be occurring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {
      //There's definitely a collision happening
      hit = true;
    } else {
      //There's no collision on the y axis
      hit = false;
    }
  } else {
    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
};

let createEnemy = function(
  spriteName: string,
  speed?: number,
  displayHealthBar?: boolean,
  movementType?: MOVEMENT_TYPE
): Enemy {
  let enemy = new Enemy(spriteName, app, speed, displayHealthBar, movementType);

  return enemy;
};

// check if a number is prime
function isPrime(num: number): boolean {
  for (var i = 2; i < num; i++) if (num % i === 0) return false;
  return num > 1;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 */
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
