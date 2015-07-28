(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(640, 960, Phaser.AUTO, 'flycatch');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":3,"./states/gameover":4,"./states/menu":5,"./states/play":6,"./states/preload":7}],2:[function(require,module,exports){
'use strict';

var Sachock = function(game, parent, atlasName, backContainer) {
	Phaser.Group.call(this, game, parent);

	this.MIN_POLE_SIZE = 200;
	this.MAX_SPEED = 10;
	this.BASKET_MAX_ROTATION = 0.1 * Phaser.Math.PI2;

	this.events = {};
	this.events.onComplete = new Phaser.Signal();
	this.events.onPassedMiddle = new Phaser.Signal();

	this.poleEnd = this.game.add.sprite(0, 0, atlasName, "sachockPoleBottom");
	this.poleEnd.anchor.setTo(0.5, 0.5);
	this.add(this.poleEnd);

	this.enterBackGroup = this.game.add.group(backContainer);
	this.basketGroup = this.game.add.group(this);
	this.enterFrontGroup = this.game.add.group(this);

	//Задняя часть входа в корзину
	this.enterBackLeft = this.game.add.sprite(0, 0, atlasName, "basketEnterBackLeft", this.enterBackGroup);
	this.enterBackLeft.anchor.setTo(0, 0.5);
	this.enterBackMid = this.game.add.sprite(0, 0, atlasName, "basketEnterBackMid", this.enterBackGroup);
	this.enterBackMid.anchor.setTo(0, 0.5);
	this.enterBackRight = this.game.add.sprite(0, 0, atlasName, "basketEnterBackRight", this.enterBackGroup);
	this.enterBackRight.anchor.setTo(1, 0.5);

	//Корзина
	this.basketLeft = this.game.add.sprite(0, -2, atlasName, "basketLeft", this.basketGroup);
	this.basketLeft.anchor.setTo(0, 0);
	this.basketMid = this.game.add.sprite(0, -2, atlasName, "basketMid", this.basketGroup);
	this.basketMid.anchor.setTo(0, 0);
	this.basketRight = this.game.add.sprite(0, -2, atlasName, "basketRight", this.basketGroup);
	this.basketRight.anchor.setTo(1, 0);

	//Передняя часть входа в корзину
	this.enterFrontLeft = this.game.add.sprite(0, -8, atlasName, "basketEnterFrontLeft", this.enterFrontGroup);
	this.enterFrontLeft.anchor.setTo(0, 0);
	this.enterFrontMid = this.game.add.sprite(0, -8, atlasName, "basketEnterFrontMid", this.enterFrontGroup);
	this.enterFrontMid.anchor.setTo(0, 0);
	this.enterFrontRight = this.game.add.sprite(0, -8, atlasName, "basketEnterFrontRight", this.enterFrontGroup);
	this.enterFrontRight.anchor.setTo(1, 0);

	this.poleMid = this.game.add.sprite(0, 0, atlasName, "sachockPoleMiddle", this);
	this.poleMid.anchor.setTo(0, 0.5);

	//Создание физических тел сетки сачка
	this.borderBodies = this.game.add.sprite(0, 0);
	this.parent.add(this.borderBodies);
	this.game.physics.p2.enableBody(this.borderBodies);
	this.borderBodies.body.kinematic = true;
	this.borderBodies.body.debug = false;

	this.slowDownAcc = 3.5;

	/*this.borderLeftBody = this.game.add.sprite(0, 0, undefined, undefined, this.parent);
	this.borderRightBody = this.game.add.sprite(0, 0, undefined, undefined, this.parent);
	this.borderBottomBody = this.game.add.sprite(0, 0, undefined, undefined, this.parent);
	this.borderBodies = [this.borderLeftBody, this.borderRightBody, this.borderBottomBody];
	this.game.physics.p2.enable(this.borderBodies);
	for (var i = 0; i < this.borderBodies.length; i++) {
		this.borderBodies[i].body.kinematic = true;
		this.borderBodies[i].body.debug = false;
	}*/

};

Sachock.prototype = Object.create(Phaser.Group.prototype);
Sachock.prototype.constructor = Sachock;

Sachock.prototype.update = function() {
	//this.speed += this.acc * this.game.time.elapsed / 1000;
	//this.rotation += this.speed * this.game.time.elapsed / 1000;
	if (!this.passedMiddle && this.rotation < -0.75 * Phaser.Math.PI2) {
		this.passedMiddle = true;
		this.game.physics.p2.gravity.y = 1200;
		this.events.onPassedMiddle.dispatch(this);
	}
	if (this.passedMiddle) {
		this.borderBodies.body.angularVelocity += this.slowDownAcc * this.game.time.elapsed / 1000;
		if (this.borderBodies.body.angularVelocity > -0.2) {
			this.borderBodies.body.angularVelocity = -0.2;
		}
		console.log(this.borderBodies.body.angularVelocity);
	}
	else {
		this.borderBodies.body.angularVelocity += this.angAcc * this.game.time.elapsed / 1000;
	}
	if (this.rotation < -1 * Phaser.Math.PI2) {
		this.borderBodies.body.angularVelocity = 0;
		this.events.onComplete.dispatch(this);
	}
	this.basketGroup.scale.y = this.basketStartScale * (1 + Math.abs(1 * this.borderBodies.body.angularVelocity / this.MAX_SPEED));
	this.basketGroup.rotation = 0 + this.BASKET_MAX_ROTATION * (Math.max(Math.abs(this.borderBodies.body.angularVelocity) - 0.03, 0) / this.MAX_SPEED);
	this.updateBodies();
};

Sachock.prototype.updateBodies = function() {
	/*for (var i = 0; i < this.borderBodies.length; i++) {
		this.borderBodies[i].body.x = this.x;
		this.borderBodies[i].body.y = this.y;
		this.borderBodies[i].body.rotation = this.rotation;
	}*/
	this.borderBodies.body.x = this.x;
	this.borderBodies.body.y = this.y;
	this.rotation = this.borderBodies.body.rotation;
	this.enterBackGroup.position.setTo(this.x, this.y);
	this.enterBackGroup.rotation = this.rotation;
};

Sachock.prototype.start = function(size, startPause, speed, acc) {
	startPause = typeof startPause !== 'undefined' ? startPause : 900;
	speed = typeof speed !== 'undefined' ? speed : -0.03;
	acc = typeof acc !== 'undefined' ? acc : -0.001;

	this.size = size;
	this.speed = speed;
	this.acc = acc;
	this.startPause = startPause;
	this.direction = -1;

	this.MIN_POLE_SIZE = size * 0.5;
	size -= this.MIN_POLE_SIZE;
	var enterSize = this.game.rnd.integerInRange(0.4 * size, 0.6 * size);
	var startPos = this.MIN_POLE_SIZE + this.game.rnd.integerInRange(0, size - enterSize);
	var endPos = startPos + enterSize;
	var halfSize = enterSize * 0.5;

	this.poleEnd.position.setTo(0, 0);
	this.basketGroup.x = this.enterFrontGroup.x = startPos + halfSize;
	this.basketLeft.x = this.enterFrontLeft.x = 0 - halfSize - 11;
	this.enterBackLeft.x = startPos - 11;
	this.basketRight.x = this.enterFrontRight.x = halfSize + 11;
	this.enterBackRight.x = endPos + 11;
	this.enterFrontMid.x = this.enterFrontLeft.x + this.enterFrontLeft.width;
	this.enterBackMid.x = this.enterBackLeft.x + this.enterBackLeft.width;
	this.enterBackMid.scale.x = this.enterFrontMid.scale.x = 1;
	this.enterBackMid.scale.x = this.enterFrontMid.scale.x = ((this.enterBackRight.x - this.enterBackRight.width) - (this.enterBackLeft.x + this.enterBackLeft.width)) / this.enterBackMid.width;
	this.basketMid.x = this.basketLeft.x + this.basketLeft.width;
	this.basketMid.scale.x = 1;
	this.basketMid.scale.x = ((this.basketRight.x - this.basketRight.width) - (this.basketLeft.x + this.basketLeft.width)) / this.basketMid.width;
	this.basketStartScale = 1;
	this.basketGroup.rotation = 0;
	this.basketGroup.scale.y = 1;
	this.poleMid.scale.x = 1;
	this.poleMid.scale.x = startPos / this.poleMid.width;

	this.passedMiddle = false;
	this.game.physics.p2.gravity.y = 0;

	this.game.time.events.add(startPause, this.startRotation, this).autoDestroy = true;

	/*this.enterBottom.position.setTo(startPos, 0);
	this.enterTop.position.setTo(endPos - 23, 0);
	this.enterMiddle.position.setTo(startPos, 0);
	this.enterMiddle.scale.x = 1;
	this.enterMiddle.scale.x = (enterSize - 23) / this.enterMiddle.width;
	this.poleMiddle.position.setTo(0, 0);
	this.poleMiddle.scale.x = 1;
	this.poleMiddle.scale.x = (startPos - this.enterBottom.width) / this.poleMiddle.width;
	this.basket.scale.setTo(1, 1);
	this.basket.x = startPos + enterSize * 0.5;
	this.basket.rotation = 0;
	this.basketStartScale = this.basket.scale.x = this.basket.scale.y = enterSize / this.basket.width;*/

	//this.rotation = -0.25 * Phaser.Math.PI2;

	var bordersWidth = 20;
	var halfBordersWidth = bordersWidth * 0.5;

	/*this.borderLeftBody.body.clearShapes();
	this.borderLeftBody.body.addCapsule(this.basketMid.height, halfBordersWidth, startPos - halfBordersWidth, this.basketMid.height * 0.5, Phaser.Math.PI2 * 0.25);
	this.borderRightBody.body.clearShapes();
	this.borderRightBody.body.addCapsule(this.basketMid.height, halfBordersWidth, endPos + halfBordersWidth, this.basketMid.height * 0.5, Phaser.Math.PI2 * 0.25);
	this.borderBottomBody.body.clearShapes();
	this.borderBottomBody.body.addRectangle(enterSize, bordersWidth, startPos + enterSize * 0.5, this.basketMid.height);

	for (var i = 0; i < this.borderBodies.length; i++) {
		this.borderBodies[i].body.x = this.x;
		this.borderBodies[i].body.y = this.y;
		this.borderBodies[i].body.rotation = this.rotation;
		//this.borderBodies[i].body.rotateRight(this.speed / Math.PI * 180);
	}*/

	this.borderBodies.body.clearShapes();
	this.borderBodies.body.addCircle(halfBordersWidth, startPos - halfBordersWidth, 0);
	this.borderBodies.body.addCircle(halfBordersWidth, endPos + halfBordersWidth, 0);
	this.borderBodies.body.addRectangle(bordersWidth, this.basketMid.height, startPos - halfBordersWidth, this.basketMid.height * 0.5);
	this.borderBodies.body.addRectangle(bordersWidth, this.basketMid.height, endPos + halfBordersWidth, this.basketMid.height * 0.5);
	this.borderBodies.body.addRectangle(enterSize, bordersWidth, startPos + enterSize * 0.5, this.basketMid.height);
	this.borderBodies.body.rotation = -0.25 * Phaser.Math.PI2;
	this.borderBodies.body.angularVelocity = 0;
	this.angAcc = 0;

	this.updateBodies();
};

Sachock.prototype.startRotation = function() {
	/*for (var i = 0; i < this.borderBodies.length; i++) {
		this.borderBodies[i].body.angularVelocity = this.game.physics.p2.pxm(this.speed);
		this.borderBodies[i].body.angularForce = this.acc;
	}*/
	this.borderBodies.body.angularVelocity = this.game.physics.p2.pxm(this.speed);
	this.angAcc = this.acc;
};

Sachock.prototype.stop = function() {
	this.borderBodies.body.angularVelocity = 0;
	this.angAcc = 0;
};

module.exports = Sachock;

},{}],3:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],4:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],5:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
	preload: function() {

	},
	create: function() {
		this.background = this.game.add.sprite(0, this.game.height - 406, "menuAtlas", "menu_bg");
		this.background.width = this.game.width;
		this.title = this.game.add.sprite(0, 155, "menuAtlas", "menu_title");
		this.tap_text = this.game.add.sprite(43, 631, "menuAtlas", "tap_to_start");
		//this.tap_text.anchor.setTo(0.5, 0.5);
		this.game.add.tween(this.tap_text)
			.to({alpha:0.3}, 2000, Phaser.Easing.Cubic.InOut, true, 0, 1000, true);
	},
	update: function() {
		if (this.game.input.activePointer.justPressed()) {
			this.game.state.start("play");
		}
	}
};

module.exports = Menu;

},{}],6:[function(require,module,exports){
'use strict';

var Sachock = require("../prefabs/sachock");

function Play() {}
Play.prototype = {
	create: function() {

		this.game.world.setBounds(-this.game.width, -this.game.height, this.game.width * 3, this.game.height * 3);
		this.game.physics.startSystem(Phaser.Physics.P2JS);
		this.game.physics.p2.restituion = 0.9;

		this.apple = new Phaser.Sprite(this.game, 340, 550, "playAtlas", "apple0");
		this.apple.anchor.setTo(0.5, 0.5);
		this.game.time.events.add(Phaser.Timer.SECOND * 5, this.addApple, this).autoDestroy = true;

		this.sachockBackContainer = this.game.add.group();
		this.appleContainer = this.game.add.group();
		this.sachockFrontContainer = this.game.add.group();

		this.sachock = new Sachock(this.game, this.sachockFrontContainer, "playAtlas", this.sachockBackContainer);
		this.sachock.x = this.game.width - 110;
		this.sachock.y = this.game.height * 0.5;
		this.sachock.events.onComplete.add(this.sachockCompleteHandler, this);
		this.sachock.events.onPassedMiddle.add(this.sachockPassedMiddleHandler, this);
		this.sachock.start(this.game.height * 0.5 - 60, 1000, 0, -1.5);

		this.MAX_AIM_R = this.game.width - 60;
		this.MIN_AIM_R = 30;

		this.aim = this.game.add.sprite(this.sachock.x, this.sachock.y, "playAtlas", "aim");
		this.aim.anchor.setTo(0.5, 0.5);
		this.appleContainer.add(this.aim);
		this.startAim();
		this.positionOnRadius(this.aim, this.sachock.position, this.aimAngle, this.aimR);

		this.cursors = this.game.input.keyboard.createCursorKeys();
	},
	update: function() {
		if (this.creatingApple) {
			if (this.game.input.mousePointer.isUp) {
				this.creatingApple = false;
				this.game.physics.p2.gravity.y = 150;
			}
			else {
				this.apple.height = this.apple.width = this.apple.width + 4;
				this.appleShape.radius += this.game.physics.p2.pxm(2);
				this.appleShape.updateBoundingRadius();
				if (this.apple.body.debugBody) {
					this.apple.body.debugBody.draw();
				}
			}
		}
		else {
			if (this.canCreateApple) {
				if (this.game.input.mousePointer.isDown) {
					this.creatingApple = true;
					this.game.add.tween(this.aim.scale)
						.to({x:0, y:0}, 500, Phaser.Easing.Back.Out);
					this.addApple(this.aim.x, this.aim.y, 20);
					this.apple.body.angularVelocity = 0.005;
				}
			}
		}

		if (!this.creatingApple) {
			this.aimR += this.aimSpeed;
			if (this.aimSpeed > 0) {
				if (this.aimR > this.MAX_AIM_R) {
					this.aimSpeed *= -1;
					this.aimR = this.MAX_AIM_R;
				}
			}
			else {
				if (this.aimR < this.MIN_AIM_R) {
					this.aimSpeed *= -1;
					this.aimR = this.MIN_AIM_R;
				}
			}
			this.positionOnRadius(this.aim, this.sachock.position, this.aimAngle, this.aimR);
		}
	},
	sachockCompleteHandler: function(sachock) {
		this.game.camera.follow(null);
		this.sachock.stop();
		this.game.time.events.add(Phaser.Timer.SECOND * 3, this.startSachock, this).autoDestroy = true;
	},
	startSachock: function() {
		this.game.camera.x = 0;
		this.removeApple();
		sachock.start(this.game.height * 0.5 - 60, 1000, 0, -1.5);
		this.startAim();
	},
	positionOnRadius : function(target, center, angle, radius) {
		target.x = center.x + radius * Math.cos(angle);
		target.y = center.y + radius * Math.sin(angle);
	},
	startAim : function() {
		this.aim.scale.setTo(1, 1);
		this.aimAngle = this.game.rnd.realInRange(0.3, 0.4) * Phaser.Math.PI2;
		this.aimR = this.MIN_AIM_R;
		this.positionOnRadius(this.aim, this.sachock.position, this.aimAngle, this.aimR);
		this.aimSpeed = 0;
		this.game.time.events.add(Phaser.Timer.SECOND * 0.5, this.setAimSpeed, this).autoDestroy = true;
		this.creatingApple = false;
		this.canCreateApple = false;
	},
	setAimSpeed : function() {
		this.aimSpeed = 5;
		this.canCreateApple = true;
	},
	addApple : function(x, y, size) {
		this.apple.width = this.apple.height = size;
		this.apple.position.setTo(x, y);
		this.appleContainer.add(this.apple);
		this.game.physics.p2.enable(this.apple);
		//this.apple.body.mass = 2000;
		this.apple.body.clearShapes();
		this.appleShape = this.apple.body.addCircle(this.apple.width * 0.5);
		this.apple.body.debug = false;
		this.game.camera.follow(this.apple);
		var cameraBorder = this.game.width * 0.2;
		this.game.camera.deadzone = new Phaser.Rectangle(cameraBorder, -this.game.height, this.game.width - cameraBorder * 2, this.game.height * 3);
	},
	removeApple : function() {
		if (this.apple) {
			this.game.physics.p2.removeBody(this.apple.body);
			this.apple.body.destroy();
			this.apple.body = null;
			this.appleShape = null;
			this.appleContainer.remove(this.apple);
		}
	},
	sachockPassedMiddleHandler : function(sachock) {
		//this.game.camera.x = 400;
		/*this.game.add.tween(this.game.camera)
			.to({x:300}, 2000, Phaser.Easing.Cubic.InOut);*/
	}
};
  
  module.exports = Play;
},{"../prefabs/sachock":2}],7:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
	preload: function() {
		this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
		this.asset.anchor.setTo(0.5, 0.5);
		this.game.stage.backgroundColor = 0xffffff;

		this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
		this.load.setPreloadSprite(this.asset);
		this.game.load.atlasJSONHash("menuAtlas", "assets/menu_ss.png", "assets/menu_ss.json");
		this.game.load.atlasJSONHash("playAtlas", "assets/play_ss.png", "assets/play_ss.json");
	},
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('play');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])