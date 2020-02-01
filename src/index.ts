///<reference types="pixi.js"/>
import * as PIXI from "pixi.js";
// make vscode ignore these since they don't have typings
// @ts-ignore
import * as Keyboard from "pixi.js-keyboard";
// @ts-ignore
import * as Mouse from "pixi.js-mouse";
import { Player } from "./player";
// TODO: reduce size of bundle.js by following this guide https://medium.com/anvoevodin/how-to-set-up-pixijs-v5-project-with-npm-and-webpack-41c18942c88d

// game properties
let gameWidth: number = 256;
let gameHeight: number = 256;
let gameState: Function;
let player: Player;

// aliases and helpful variables
let statusDiv = document.getElementById("status");

// these are our assets
let assets = [{ name: "player", url: "assets/sprites/player.png" }];
let sprites: PIXI.Sprite[] = []; // this will be populated later

// setup pixi
let app = new PIXI.Application({ width: gameWidth, height: gameHeight });
document.body.appendChild(app.view);

// disable rightclicking
app.view.addEventListener("contextmenu", e => {
  if (e.type == "contextmenu") e.preventDefault();
});

// main gameplay loop
let gameLoop = function(delta: any) {
  let playerSprite = player.spriteObject;

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

  if (Keyboard.isKeyDown("KeyB")) {
    player.health -= 1;
  }

  // actually move the sprite
  playerSprite.x += player.velX * delta;
  playerSprite.y += player.velY * delta;

};

// this won't run until after our assets have loaded
let setup = function() {
  // clear our status thingy
  statusDiv.innerHTML = "";

  // run this for each asset we have loaded
  assets.forEach(function(asset) {
    // create the sprite object
    let currentSprite = new PIXI.Sprite(
      app.loader.resources[asset.name].texture
    );

    if (asset.name == "player") {
      player = new Player(currentSprite);
    }

    // populate our sprite array with this
    sprites.push(currentSprite);

    // add sprite to stage
    app.stage.addChild(currentSprite);

    // begin game loop
    gameState = gameLoop;
    app.ticker.add(delta => tick(delta));
  });
};

// begin loading assets
app.loader
  .add(assets)
  .on("progress", function() {
    statusDiv.innerHTML = app.loader.progress + "% Loading...<br/>";
  })
  .load(setup);

// keeps all of our shit running
let tick = function(delta: any) {
  gameState(delta);
  Keyboard.update();
  Mouse.update();
};
