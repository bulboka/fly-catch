'use strict';

var Sachock = require("../prefabs/sachock");

function Play() {}
Play.prototype = {
	create: function() {

		this.game.world.setBounds(-this.game.width, -this.game.height, this.game.width * 3, this.game.height * 3);
		this.game.physics.startSystem(Phaser.Physics.P2JS);
		this.game.physics.p2.restituion = 0.8;

		//this.apple = this.game.add.sprite(340, 550, "playAtlas", "apple0", null);
		this.apple = new Phaser.Sprite(this.game, 340, 550, "playAtlas", "apple0");
		this.apple.anchor.setTo(0.5, 0.5);
		/*this.game.physics.p2.enable(this.apple);
		this.apple.body.clearShapes();
		this.appleShape = this.apple.body.addCircle(this.apple.width * 0.5);
		this.apple.body.debug = true;*/

		//this.apple.width = this.apple.height = 250;
		//this.appleShape.radius = 100;
		//this.appleShape.updateBoundingRadius();*/
		this.game.time.events.add(Phaser.Timer.SECOND * 5, this.addApple, this).autoDestroy = true;

		this.sachockBackContainer = this.game.add.group();
		this.appleContainer = this.game.add.group();
		this.sachockFrontContainer = this.game.add.group();

		this.sachock = new Sachock(this.game, this.sachockFrontContainer, "playAtlas", this.sachockBackContainer);
		this.sachock.x = this.game.width - 60;
		this.sachock.y = this.game.height * 0.5;
		this.sachock.events.onComplete.add(this.sachockCompleteHandler, this);
		this.sachock.start(this.game.height * 0.5 - 60, 1000, -0.03, 0);

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
		if (this.creatingApple) {
			if (this.game.input.mousePointer.isUp) {
				this.creatingApple = false;
			}
			else {
				this.apple.height = this.apple.width = this.apple.width + 4;
				this.appleShape.radius += this.game.physics.p2.pxm(2);
				this.appleShape.updateBoundingRadius();
				this.apple.body.debugBody.draw();
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
				if (this.aimR < this.sachock.MIN_POLE_SIZE) {
					this.aimSpeed *= -1;
					this.aimR = this.sachock.MIN_POLE_SIZE;
				}
			}
			this.positionOnRadius(this.aim, this.sachock.position, this.aimAngle, this.aimR);
		}

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
		this.removeApple();
		sachock.start(this.game.height * 0.5 - 60, 1000, -0.03, 0);
		this.startAim();
	},
	positionOnRadius : function(target, center, angle, radius) {
		target.x = center.x + radius * Math.cos(angle);
		target.y = center.y + radius * Math.sin(angle);
	},
	startAim : function() {
		this.aim.scale.setTo(1, 1);
		this.aimAngle = this.game.rnd.realInRange(0.25, 0.375) * Phaser.Math.PI2;
		this.aimR = this.sachock.MIN_POLE_SIZE;
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
		this.apple.body.clearShapes();
		this.appleShape = this.apple.body.addCircle(this.apple.width * 0.5);
		this.apple.body.debug = true;
	},
	removeApple : function() {
		this.game.physics.p2.removeBody(this.apple.body);
		this.apple.body.destroy();
		this.apple.body = null;
		this.appleShape = null;
		this.appleContainer.remove(this.apple);
	}
};
  
  module.exports = Play;