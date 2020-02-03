import { Application } from "pixi.js";
import { Entity } from "./Entity";

export class HealthPack extends Entity {
  constructor(spriteName: string, app: Application) {
    super(spriteName, app, 1, false); // this won't have a health bar
  }
}
