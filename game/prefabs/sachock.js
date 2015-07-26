'use strict';

var Sachock = function(game, parent, atlasName) {
	Phaser.Group.call(this, game, parent);

	this.MIN_POLE_SIZE = 70;
	this.MAX_SPEED = 0.1;
	this.BASKET_MAX_ROTATION = 0.1 * Phaser.Math.PI2;

	this.events = {};
	this.events.onComplete = new Phaser.Signal();

	this.poleEnd = this.game.add.sprite(0, 0, atlasName, "sachockPoleBottom");
	this.poleEnd.anchor.setTo(1, 0.5);
	this.add(this.poleEnd);

	this.basket = this.game.add.sprite(0, 0, atlasName, "sachockBasket");
	this.basket.anchor.setTo(0.5, 0);
	this.add(this.basket);

	this.enterBottom = this.game.add.sprite(0, -15, atlasName, "sachockEnterBottom");
	this.enterBottom.anchor.setTo(1, 0.5);
	this.add(this.enterBottom);

	this.enterTop = this.game.add.sprite(0, 0, atlasName, "sachockEnterTop");
	this.enterTop.anchor.setTo(0, 0.5);
	this.add(this.enterTop);

	this.enterMiddle = this.game.add.sprite(0, 0, atlasName, "sachockEnterMiddle");
	this.enterMiddle.anchor.setTo(0, 0.5);
	this.add(this.enterMiddle);

	this.poleMiddle = this.game.add.sprite(0, 0, atlasName, "sachockPoleMiddle");
	this.poleMiddle.anchor.setTo(0, 0.5);
	this.add(this.poleMiddle);

	this.borderBodies = this.game.add.sprite(0, 0);
	this.parent.add(this.borderBodies);
	this.game.physics.p2.enableBody(this.borderBodies);
	this.borderBodies.body.kinematic = true;
	//this.borderBodies.body.debug = true;

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
		this.basket.scale.y = this.basketStartScale * (1 + Math.abs(1 * this.speed / this.MAX_SPEED));
		this.basket.rotation = 0 + this.BASKET_MAX_ROTATION * (Math.max(Math.abs(this.speed) - 0.03, 0) / this.MAX_SPEED);
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
	this.speed = speed;
	this.acc = acc;
	this.timeTillStart = startPause;
	this.direction = -1;

	size -= this.MIN_POLE_SIZE;
	var enterSize = this.game.rnd.integerInRange(0.3 * size, 0.6 * size);
	var startPos = this.MIN_POLE_SIZE + this.game.rnd.integerInRange(0, size - enterSize);
	var endPos = startPos + enterSize;

	this.poleEnd.position.setTo(0, 0);
	this.enterBottom.position.setTo(startPos, 0);
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
	this.basketStartScale = this.basket.scale.x = this.basket.scale.y = enterSize / this.basket.width;

	this.borderBodies.body.clearShapes();
	this.borderBodies.body.addCircle(15, startPos - 10, -14);
	this.borderBodies.body.addCircle(15, endPos + 10, -14);

	this.rotation = -0.25 * Phaser.Math.PI2;

	this.updateBodies();
};

module.exports = Sachock;
