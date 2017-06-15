import CustomButton from "./CustomButton";
import {TimelineLite, TweenLite, Power1, Power3, TweenMax} from "gsap";
import keyboard from "./Keyboard";

const SECTORS = [0, 26, 3, 35, 12, 28, 7, 29, 18, 22, 9, 31, 14, 20, 1, 33, 16, 24, 5, 10, 23, 8, 30, 11, 36, 13, 27, 6, 34, 17, 25, 2, 21, 4, 19, 15, 32];
const SECTOR_ANGLE = 2 * Math.PI / 37.0;

export default class Game {
	
	constructor(){
		this.renderer = new PIXI.autoDetectRenderer({ width : 900, height : 900, view : document.getElementById('fortune_wheel_canvas')});
		this.renderer.backgroundColor  = 0x04cc7b;
		
		PIXI.loader.add("./assets/spritesheet.json")
					.add("stopper", "./assets/stopper.png")
					.load(this.startApp.bind(this));
					
		window.onresize = this.onResize.bind(this);
		window.onload = this.onResize.bind(this);
	}
	
	onResize() {
		const RATIO = 1; //900 / 900
		let w,h;
		w = h = (window.innerWidth / window.innerHeight >= RATIO) ? window.innerHeight : window.innerWidth;
		
		this.renderer.view.style.width = w + 'px';
		this.renderer.view.style.height = h + 'px';
	}
  
	startApp() {
		this.textures = PIXI.loader.resources["./assets/spritesheet.json"].textures;
		this.initViews();
		
		this.gameLoop();
		
		var keyObject = keyboard(32);
		keyObject.press = this.onSpacePressed.bind(this);
	}
	
	gameLoop(){
		requestAnimationFrame(this.gameLoop.bind(this));
		
		if (this.btnStop.enabled) {
			this.wheel.rotation += 0.1;
			this.normalizeWheelRotation();
		}
		
		this.renderer.render(this.stage);
	}
	
	onSpacePressed() {
		if (this.btnStart.enabled)
			this.onStart();
		else if (this.btnStop.enabled)
			this.onStop();
	}
	
	onStart() {
		this.btnStart.enabled = false;
		this.tfResult.visible = false;
		
		this.tweenData = {currentRotation : this.wheel.rotation};
		
		var tl = new TimelineLite();
		tl.add( TweenLite.to(this.tweenData, 0.25, {currentRotation : this.wheel.rotation - Math.PI / 20, onUpdate : this.updateWheelPosition.bind(this), ease : Power1.easeOut } ) );
		tl.add( TweenLite.to(this.tweenData, 1, {currentRotation : this.wheel.rotation + 0.75 * Math.PI, onUpdate : this.updateWheelPosition.bind(this), onComplete : this.onReadyToStop.bind(this), ease : Power2.easeIn } ) );
	}
	
	onStop() {
		this.btnStop.enabled = false;
		this.resultSectorValue = this.getResultSector();
		
		//угол, выставляющий колесо на центр сектора, который выпал
		let resultRotation = SECTORS.indexOf(this.resultSectorValue) * SECTOR_ANGLE - 0.5 * SECTOR_ANGLE;
		//добавляем небольшого рандома, чтоб естесственнее выглядело
		resultRotation += (0.6 * Math.random() - 0.3) * SECTOR_ANGLE;
		//добавляем тормозной путь, кратный 2*PI
		resultRotation += 4 * Math.PI;
		
		this.tweenData = {currentRotation : this.wheel.rotation};
		TweenLite.to(this.tweenData, (resultRotation - this.wheel.rotation) * 0.5, {currentRotation : resultRotation, onUpdate : this.updateWheelPosition.bind(this), ease : Power3.easeOut, onComplete : this.onWheelStopped.bind(this) } )
	}
	
	updateWheelPosition() {
		this.wheel.rotation = this.tweenData.currentRotation;
		this.normalizeWheelRotation();
	}
	
	onReadyToStop() {
		this.btnStop.enabled = true;
	}
	
	onWheelStopped() {
		this.btnStart.enabled = true;
		this.tfResult.text = "" + this.resultSectorValue;
		this.tfResult.anchor.x = 0.5;
		this.tfResult.anchor.y = 0.5;
		this.tfResult.x = this.wheel.x;
		this.tfResult.y = this.wheel.y;
		this.tfResult.visible = true;
		TweenMax.to(this.tfResult.scale, 0.25, {x : 1.5, y : 1.5, yoyo : true, repeat : 5});
	}
	
	getResultSector() {
		//возвращает значение сектора, на котором должно остановиться колесо.
		//по идее должно возвращаться с сервера, это как симуляция
		return Math.floor(Math.random() * 37);
	}
	
	normalizeWheelRotation() {
		while (this.wheel.rotation > 2 * Math.PI)
			this.wheel.rotation -= 2 * Math.PI;
	}
	
	initViews() {
		this.stage = new PIXI.Container();
		
		this.wheel = new PIXI.Sprite(this.textures["wheel.png"]);
		this.wheel.anchor.x = 0.5;
		this.wheel.pivot.y = 356;
		this.wheel.x = 450;
		this.wheel.y = 400;
		this.wheel.rotation = Math.random() * 2 * Math.PI;
		
		this.tfResult = new PIXI.Text("", {fontFamily : "Arial", fontSize : 100, fill : "black"});
		this.tfResult.visible = false;
		
		this.stopper = new PIXI.Sprite(PIXI.utils.TextureCache["stopper"]);
		this.stopper.anchor.x = 0.5;
		this.stopper.x = this.wheel.x;
		this.stopper.y = 10;
		
		this.btnStart = new CustomButton("START");
		this.btnStart.x = this.wheel.x - this.btnStart.width - 50;
		this.btnStart.y = this.wheel.y + 375;
		this.btnStart.click = this.btnStart.touchstart = this.onStart.bind(this);
		
		this.btnStop = new CustomButton("STOP");
		this.btnStop.x = this.wheel.x + 50;
		this.btnStop.y = this.wheel.y + 375;
		this.btnStop.click = this.btnStop.touchstart = this.onStop.bind(this);
		
		this.stage.addChild(this.wheel);
		this.stage.addChild(this.tfResult);
		this.stage.addChild(this.stopper);
		this.stage.addChild(this.btnStart);
		this.stage.addChild(this.btnStop);
		
		this.btnStart.enabled = true;
		this.btnStop.enabled = false;
	}
}