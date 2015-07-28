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
				this.game.physics.p2.gravity.y = 100;
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
		this.apple.body.angularVelocity = 3;
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