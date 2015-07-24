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
},{"./states/boot":2,"./states/gameover":3,"./states/menu":4,"./states/play":5,"./states/preload":6}],2:[function(require,module,exports){

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

},{}],3:[function(require,module,exports){

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

},{}],4:[function(require,module,exports){

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

},{}],5:[function(require,module,exports){

'use strict';
function Play() {}
Play.prototype = {
	create: function() {
		this.game.world.setBounds(0, 0, this.game.width, this.game.height);
		this.game.physics.startSystem(Phaser.Physics.P2JS);
		this.game.physics.p2.restituion = 0.8;

		this.apple = this.game.add.sprite(340, 550, "playAtlas", "apple0");
		this.apple.anchor.setTo(0.5, 0.5);
		this.game.physics.p2.enable(this.apple);
		this.apple.body.clearShapes();
		this.appleShape = this.apple.body.addCircle(250);
		this.apple.body.debug = true;
		this.haveToUpdate = true;
		//this.apple.width = this.apple.height = 250;
		//this.appleShape.radius = 100;
		//this.appleShape.updateBoundingRadius();

		this.sachockTop = this.game.add.sprite(100, 100, "playAtlas", "sachockEnterTop");
		this.sachockBottom = this.game.add.sprite(100, 300, "playAtlas", "sachockEnterBottom");
		this.game.physics.p2.enable([this.sachockTop, this.sachockBottom]);
		this.sachockTop.body.kinematic = true;
		this.sachockBottom.body.kinematic = true;

		this.cursors = this.game.input.keyboard.createCursorKeys();
	},
	update: function() {

		this.appleShape.radius -= 0.01;
		this.apple.width -= 0.45;
		this.apple.height -= 0.45;
		this.appleShape.updateBoundingRadius();
		this.apple.body.debugBody.draw();

		if (this.cursors.left.isDown)
		{
			this.apple.body.rotateLeft(80);
		}
		else if (this.cursors.right.isDown)
		{
			this.apple.body.rotateRight(80);
		}
		else
		{
			this.apple.body.setZeroRotation();
		}

		if (this.cursors.up.isDown)
		{
			this.apple.body.thrust(400);
		}
		else if (this.cursors.down.isDown)
		{
			this.apple.body.reverse(400);
		}
	}
};
  
  module.exports = Play;
},{}],6:[function(require,module,exports){

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