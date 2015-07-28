'use strict';

var Sachock = function(game, parent, atlasName, backContainer) {
	Phaser.Group.call(this, game, parent);

	this.MIN_POLE_SIZE = 200;
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

	this.poleMid = this.game.add.sprite(0, 0, atlasName, "sachockPoleMiddle", this);
	this.poleMid.anchor.setTo(0, 0.5);

	//Создание физических тел сетки сачка
	this.borderBodies = this.game.add.sprite(0, 0);
	this.parent.add(this.borderBodies);
	this.game.physics.p2.enableBody(this.borderBodies);
	this.borderBodies.body.kinematic = true;
	this.borderBodies.body.debug = false;

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
	this.borderBodies.body.angularVelocity += this.angAcc * this.game.time.elapsed / 1000;
	if (this.rotation < -1 * Phaser.Math.PI2) {
		this.borderBodies.body.angularVelocity = 0;
		this.events.onComplete.dispatch(this);
	}
	//this.basketGroup.scale.y = this.basketStartScale * (1 + Math.abs(1 * this.speed / this.MAX_SPEED));
	//this.basketGroup.rotation = 0 + this.BASKET_MAX_ROTATION * (Math.max(Math.abs(this.speed) - 0.03, 0) / this.MAX_SPEED);
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

module.exports = Sachock;
