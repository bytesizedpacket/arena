import * as PIXI from "pixi.js";
// make vscode ignore these since they don't have typings
// @ts-ignore
import * as Keyboard from "pixi.js-keyboard";
// @ts-ignore
import * as Mouse from "pixi.js-mouse";
import { Entity } from "./entity";
import { STATE, MOVEMENT_TYPE } from "./entity";
import { Player } from "./player";
import { Enemy } from "./enemy";
// TODO: reduce size of bundle.js by following this guide https://medium.com/anvoevodin/how-to-set-up-pixijs-v5-project-with-npm-and-webpack-41c18942c88d

// aliases and helpful variables
const urlParams = new URLSearchParams(window.location.search);
let statusDiv = document.getElementById("status");
let levelDiv = document.getElementById("level");

// game properties
let viewWidth: number = 256;
let viewHeight: number = 256;
let zoomScale: number = parseInt(urlParams.get("zoom")); // URL query parameter ?zoom=_
export let currentLevel: number = 1;
if (isNaN(zoomScale)) zoomScale = 2; // default to 2 if not specified
// TODO: if zoom level isn't specified, automatically determine largest possible zoom level (also put this in window.onresize)
let gameState: Function;
export let player: Player;
export let currentDelta = 0;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

// these are our assets
let assets = [
  { name: "player", url: "assets/sprites/player.png" },
  { name: "enemy-default", url: "assets/sprites/enemy-default.png" },
  { name: "enemy-fly", url: "assets/sprites/enemy-fly.png" },
  { name: "health", url: "assets/sprites/health.png" }
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
  if (!currentLevel) currentLevel = 1; // default to 1 if not set
  levelDiv.innerHTML = "<b>LEVEL " + currentLevel + "</b>";
  switch (currentLevel) {
    case 1:
    // yay it's level 1
    // fall throguh to default for now so it keeps going forever
    default:
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
            currentEnemy.spriteObject.y =
              viewHeight / 2 - currentEnemy.spriteObject.height / 2;
            break;
          case 2:
            // put it at the bottom
            currentEnemy.spriteObject.y =
              viewHeight - currentEnemy.spriteObject.height;
            break;
        }
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

  // make sure every entity handles their ticks
  entities.forEach(function(entity: Entity) {
    // don't tick it if it's inactive
    if (entity.state != STATE.INACTIVE) {
      // we need to check if theit potential movement is outside the map boundary
      // TODO: change all entity.spriteObject.x/y to a property of the entity itself so we can have the camera render separately
      let tempX = entity.spriteObject.x + entity.velX * delta;
      let tempY = entity.spriteObject.y + entity.velY * delta;

      // constrain it to the map if so
      // also set velocity to 0 so they turn around quicker
      if (tempX < 0) {
        tempX = 0;
        entity.velX = 0;
      }
      if (tempY < 0) {
        tempY = 0;
        entity.velY = 0;
      }
      // TODO: constrain these to map instead of screen size
      if (tempX > viewWidth - entity.spriteObject.width) {
        tempX = viewWidth - entity.spriteObject.width;
        entity.velX = 0;
      }
      if (tempY > viewHeight - entity.spriteObject.height) {
        tempY = viewHeight - entity.spriteObject.height;
        entity.velY = 0;
      }

      // actually apply the movement
      entity.spriteObject.x = tempX;
      entity.spriteObject.y = tempY;

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
    entities.push(player);

    // put sprite in the center of the stage
    player.spriteObject.x =
      app.renderer.width / 2 - player.spriteObject.width / 2;
    player.spriteObject.y =
      app.renderer.height / 2 - player.spriteObject.height / 2;
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
// TODO: adjust for entity position property collision instead of PIXI.Sprite
export let checkSpriteCollision = function(
  sprite1: PIXI.Sprite,
  sprite2: PIXI.Sprite
) {
  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  // alsdjfkafds
  let r1 = {
    //Find the center points of each sprite
    centerX: sprite1.x + sprite2.width / 2,
    centerY: sprite1.y + sprite1.height / 2,
    //Find the half-widths and half-heights of each sprite
    halfWidth: sprite1.width / 2,
    halfHeight: sprite1.height / 2
  };

  let r2 = {
    //Find the center points of each sprite
    centerX: sprite2.x + sprite2.width / 2,
    centerY: sprite2.y + sprite2.height,
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

  // add sprite to stage
  entities.push(enemy);
  app.stage.addChild(enemy.spriteObject);

  return enemy;
};
