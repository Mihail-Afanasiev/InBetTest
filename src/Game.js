import PIXI from 'pixi.js';
import Sprite from 'pixi.js';

export default class Game {
	constructor(){
		
		this.renderer = new PIXI.autoDetectRenderer(800, 600);
		document.body.appendChild(this.renderer.view);
	
		PIXI.loader.add("./assets/spritesheet.json")
					.load(this.startApp.bind(this));
	}
  
	update(){
		/*for(let i = 0; i < this.stage.children.length; i++){
			if(this.stage.children[i].update){
				this.stage.children[i].update(this.animationLoop.delta);
			}
		}*/
	}
  
	startApp() {
		this.gameLoop = new PIXI.AnimationLoop(this.renderer);
		this.gameLoop.on('prerender', this.update.bind(this));
	  
		const textures = PIXI.loader.resources["./assets/spritesheet.json"].textures;
		this.wheel = new Sprite(textures["wheel.png"]);
		this.wheel.anchor.x = 0.5;
		this.wheel.anchor.y = 0.5;
		
		this.stage.addChild(this.wheel);
		
		this.gameLoop.start();
	}

	get stage(){
		return this.gameLoop.stage;
	}

	set stage(stage){
		this.gameLoop.stage = stage;
	}
}