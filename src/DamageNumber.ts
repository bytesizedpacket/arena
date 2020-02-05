import { Entity } from "./Entity";
import { app, damageNumbers } from "./index";
import { Text } from "pixi.js";

// these pop up when we damage something
export class DamageNumber {
  public textObject: Text;
  constructor(text: string, entity: Entity, color: string) {
    let damageText = new Text(text, {
      fill: color,
      fontFamily: "Roboto",
      fontSize: 40
    });

    // make it smaller so it looks cleaner
    damageText.scale.set(0.2, 0.2);

    // put it above the given entity
    damageText.x =
      entity.spriteObject.x +
      entity.spriteObject.width / 2 -
      damageText.width / 2;
    damageText.y = entity.spriteObject.y - damageText.height;

    this.textObject = damageText;

    damageNumbers.push(this);
    app.stage.addChild(damageText);
  }

  public tick() {
    // gradually move the thing up
    this.textObject.y -= 1;
    // gradually fade out
    this.textObject.alpha -= 0.05;

    // destroy this if it's invisible
    if (this.textObject.alpha <= 0) this.destroy();
  }

  // rip
  public destroy() {
    app.stage.removeChild(this.textObject);
    damageNumbers.splice(damageNumbers.indexOf(this), 1);
    this.textObject.destroy();
  }
}
