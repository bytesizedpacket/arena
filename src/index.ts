///<reference types="pixi.js"/>
import * as PIXI from "pixi.js";
// TODO: reduce size of bundle.js by following this guide https://medium.com/anvoevodin/how-to-set-up-pixijs-v5-project-with-npm-and-webpack-41c18942c88d

// game properties
let gameWidth: number = 256;
let gameHeight: number = 256;
let gameState: Function;
let player: Player;

// main player object
class Player {
  public spriteObject: PIXI.Sprite;

  constructor(spriteObject: PIXI.Sprite) {
    this.spriteObject = spriteObject;
  }
}

// aliases and helpful variables
let statusDiv = document.getElementById("status");

// these are our assets
let assets = [{ name: "player", url: "assets/sprites/player.png" }];
let sprites: PIXI.Sprite[] = []; // this will be populated later

// setup pixi
let app = new PIXI.Application({ width: gameWidth, height: gameHeight });
document.body.appendChild(app.view);

// main gameplay loop
let gameLoop = function(delta: any) {
  // TODO: create player object that references this
  let playerSprite = player.spriteObject;

  playerSprite.x += 0.5; // look at her go
  if (playerSprite.x > app.view.width) playerSprite.x = playerSprite.width * -1; // wrap around
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

// runs 60 times per second
let tick = function(delta: any) {
  gameState(delta);
};
