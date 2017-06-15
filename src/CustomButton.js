export default class CustomButton extends PIXI.Container
{	
	constructor(txt) {
		super();
		
		this.view = new PIXI.Sprite(PIXI.loader.resources["./assets/spritesheet.json"].textures["button_normal.png"]);
		this.tf = new PIXI.Text(txt, {fontFamily : "Arial", fontSize : 32, fill : "white"});
		
		this.addChild(this.view);
		this.addChild(this.tf);
		
		this.tf.anchor.x = 0.5;
		this.tf.anchor.y = 0.5;
		this.tf.x = this.view.width / 2;
		this.tf.y = this.view.height / 2;
		
		this.interactive = true;
		this.buttonMode = true;
		
		this.isOver = false;
		
		this.mouseover = function() {
			this.isOver = true;
			this.view.texture = PIXI.loader.resources["./assets/spritesheet.json"].textures["button_over.png"];
		}.bind(this);
		
		this.mouseout = function() {
			this.isOver = false;
			this.view.texture = PIXI.loader.resources["./assets/spritesheet.json"].textures["button_normal.png"];
		}.bind(this);
		
		this.mousedown = function() {
			this.view.texture = PIXI.loader.resources["./assets/spritesheet.json"].textures["button_down.png"];
		}.bind(this);
		
		this.mouseup = function() {
			this.view.texture = PIXI.loader.resources["./assets/spritesheet.json"].textures[this.isOver ? "button_over.png" : "button_normal.png"];
		}.bind(this);
	}
	
	set enabled(val) {
		this.buttonMode = this.interactive = val;
		if (!val)
			this.view.texture = PIXI.loader.resources["./assets/spritesheet.json"].textures["button_normal.png"];
		this.view.alpha = val ? 1 : 0.7;
	}
	
	get enabled() {
		return this.interactive;
	}
}