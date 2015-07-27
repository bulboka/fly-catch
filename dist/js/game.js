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

	this.MIN_POLE_SIZE = 70;
	this.MAX_SPEED = 0.1;
	this.BASKET_MAX_ROTATION = 0.1 * Phaser.Math.PI2;

	this.events = {};
	this.events.onComplete = new Phaser.Signal();

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

	this.poleMiddle = this.game.add.sprite(0, 0, atlasName, "sachockPoleMiddle");
	this.poleMiddle.anchor.setTo(0, 0.5);
	this.add(this.poleMiddle);

	this.borderBodies = this.game.add.sprite(0, 0);
	this.parent.add(this.borderBodies);
	this.game.physics.p2.enableBody(this.borderBodies);
	this.borderBodies.body.kinematic = true;
	this.borderBodies.body.debug = true;

	this.rotateSpeed = 0;
};

Sachock.prototype = Object.create(Phaser.Group.prototype);
Sachock.prototype.constructor = Sachock;

Sachock.prototype.update = function() {

	// write your prefab's specific update code here
	this.timeTillStart -= this.game.time.elapsed;
	if (this.timeTillStart < 0) {
		this.speed += this.acc;
		this.rotation += this.speed;
		if (this.rotation < -1 * Phaser.Math.PI2) {
			//this.start(this.size);
			this.events.onComplete.dispatch(this);
		}
		this.basketGroup.scale.y = this.basketStartScale * (1 + Math.abs(1 * this.speed / this.MAX_SPEED));
		this.basketGroup.rotation = 0 + this.BASKET_MAX_ROTATION * (Math.max(Math.abs(this.speed) - 0.03, 0) / this.MAX_SPEED);
	}
	this.updateBodies();
};

Sachock.prototype.updateBodies = function() {
	this.borderBodies.body.x = this.x;
	this.borderBodies.body.y = this.y;
	this.borderBodies.body.rotation = this.rotation;
	//this.borderBodies.body.scale.x = this.scale.x;
	//this.borderBodies.body.scale.y = this.scale.y;
};

Sachock.prototype.start = function(size, startPause, speed, acc) {
	startPause = typeof startPause !== 'undefined' ? startPause : 900;
	speed = typeof speed !== 'undefined' ? speed : -0.03;
	acc = typeof acc !== 'undefined' ? acc : -0.001;

	this.size = size;
	this.speed = speed = 0;
	this.acc = acc = 0;
	this.timeTillStart = startPause;
	this.direction = -1;

	size -= this.MIN_POLE_SIZE;
	var enterSize = this.game.rnd.integerInRange(0.3 * size, 0.6 * size);
	var startPos = this.MIN_POLE_SIZE + this.game.rnd.integerInRange(0, size - enterSize);
	var endPos = startPos + enterSize;
	var halfSize = enterSize * 0.5;

	this.poleEnd.position.setTo(0, 0);
	this.enterBackGroup.x = this.basketGroup.x = this.enterFrontGroup.x = startPos + halfSize;
	this.enterBackLeft.x = this.basketLeft.x = this.enterFrontLeft.x = 0 - halfSize - 11;
	this.enterBackRight.x = this.basketRight.x = this.enterFrontRight.x = halfSize + 11;
	this.enterBackMid.x = this.enterFrontMid.x = this.enterBackLeft.x + this.enterBackLeft.width;
	this.enterBackMid.scale.x = this.enterFrontMid.scale.x = 1;
	this.enterBackMid.scale.x = this.enterFrontMid.scale.x = ((this.enterBackRight.x - this.enterBackRight.width) - (this.enterBackLeft.x + this.enterBackLeft.width)) / this.enterBackMid.width;
	this.basketMid.x = this.basketLeft.x + this.basketLeft.width;
	this.basketMid.scale.x = 1;
	this.basketMid.scale.x = ((this.basketRight.x - this.basketRight.width) - (this.basketLeft.x + this.basketLeft.width)) / this.basketMid.width;
	this.basketStartScale = 1;
	this.basketGroup.rotation = 0;
	this.basketGroup.scale.y = 1;

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

	this.borderBodies.body.clearShapes();
	this.borderBodies.body.addCircle(6, startPos - 6, 0);
	this.borderBodies.body.addCircle(6, endPos + 6, 0);

	this.rotation = -0.25 * Phaser.Math.PI2;

	this.updateBodies();
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

		this.game.world.setBounds(0, 0, this.game.width, this.game.height);
		this.game.physics.startSystem(Phaser.Physics.P2JS);
		this.game.physics.p2.restituion = 0.8;

		/*this.apple = this.game.add.sprite(340, 550, "playAtlas", "apple0");
		this.apple.anchor.setTo(0.5, 0.5);
		this.game.physics.p2.enable(this.apple);
		this.apple.body.clearShapes();
		this.appleShape = this.apple.body.addCircle(250);
		//this.apple.body.debug = true;
		//this.apple.width = this.apple.height = 250;
		//this.appleShape.radius = 100;
		//this.appleShape.updateBoundingRadius();*/

		this.sachockBackContainer = this.game.add.group();
		this.appleContainer = this.game.add.group();
		this.sachockFrontContainer = this.game.add.group();

		this.sachock = new Sachock(this.game, this.sachockFrontContainer, "playAtlas", this.sachockBackContainer);
		this.sachock.x = this.game.width - 60;
		this.sachock.y = this.game.height * 0.5;
		this.sachock.events.onComplete.add(this.sachockCompleteHandler, this);
		this.sachock.start(this.game.height * 0.5 - 60);

		this.MAX_AIM_R = this.game.width - 60;

		this.aim = this.game.add.sprite(this.sachock.x, this.sachock.y, "playAtlas", "aim");
		this.aim.anchor.setTo(0.5, 0.5);
		this.appleContainer.add(this.aim);
		this.startAim();
		this.positionOnRadius(this.aim, this.sachock.position, this.aimAngle, this.aimR);

		/*this.testGroup = this.game.add.group();
		this.testSprite = this.game.add.sprite(0, 0, "playAtlas", "sachockEnterTop");
		this.game.physics.p2.enableBody(this.testSprite);
		this.testSprite.body.kinematic = true;
		this.testSprite.body.debug = true;
		this.testSprite.body.x = 100;
		this.testSprite.body.y = 150;
		this.testGroup.add(this.testSprite);
		this.testGroup.x = this.game.width * 0.5;
		this.testGroup.y = this.game.height * 0.5;
		this.game.add.tween(this.testGroup).to({y:100}, 1000, Phaser.Easing.Cubic.InOut, true, 0, 1000, true);*/

		this.cursors = this.game.input.keyboard.createCursorKeys();
	},
	update: function() {

		this.aimR += this.aimSpeed;
		if (this.aimSpeed > 0) {
			if (this.aimR > this.MAX_AIM_R) {
				this.aimSpeed *= -1;
				this.aimR = this.MAX_AIM_R;
			}
		}
		else {
			if (this.aimR < this.sachock.MIN_POLE_SIZE) {
				this.aimSpeed *= -1;
				this.aimR = this.sachock.MIN_POLE_SIZE;
			}
		}
		this.positionOnRadius(this.aim, this.sachock.position, this.aimAngle, this.aimR);

		/*if (this.apple) {
			this.appleShape.radius -= 0.01;
			this.apple.width -= 0.45;
			this.apple.height -= 0.45;
			//this.appleShape.updateBoundingRadius();
			//this.apple.body.debugBody.draw();

			if (this.cursors.left.isDown) {
				this.apple.body.rotateLeft(80);
			}
			else if (this.cursors.right.isDown) {
				this.apple.body.rotateRight(80);
			}
			else {
				this.apple.body.setZeroRotation();
			}

			if (this.cursors.up.isDown) {
				this.apple.body.thrust(400);
			}
			else if (this.cursors.down.isDown) {
				this.apple.body.reverse(400);
			}
		}*/
	},
	sachockCompleteHandler: function(sachock) {
		sachock.start(this.game.height * 0.5 - 60);
		this.startAim();
	},
	positionOnRadius : function(target, center, angle, radius) {
		target.x = center.x + radius * Math.cos(angle);
		target.y = center.y + radius * Math.sin(angle);
	},
	startAim : function() {
		this.aimAngle = this.game.rnd.realInRange(0.25, 0.375) * Phaser.Math.PI2;
		this.aimR = this.sachock.MIN_POLE_SIZE;
		this.positionOnRadius(this.aim, this.sachock.position, this.aimAngle, this.aimR);
		this.aimSpeed = 0;
		this.game.time.events.add(Phaser.Timer.SECOND * 0.5, this.setAimSpeed, this).autoDestroy = true;
	},
	setAimSpeed : function() {
		this.aimSpeed = 6;
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